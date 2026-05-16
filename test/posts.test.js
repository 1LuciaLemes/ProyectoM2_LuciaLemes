import { describe, test, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
const app = require('../app'); // tu app Express
const pool = require('../db/config'); // conexión a PostgreSQL

// Datos de prueba
let testAuthor = { name: 'Author Test', email: 'author@test.com', bio: 'Bio prueba' };
let testPost = { title: 'Post Test', content: 'Contenido de prueba', author_id: null };

// Limpiar tablas antes de cada test
beforeEach(async () => {
    await pool.query('DELETE FROM posts');
    await pool.query('DELETE FROM authors');

    // Creamos un author de prueba para usar en los posts
    const res = await pool.query(
        'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *',
        [testAuthor.name, testAuthor.email, testAuthor.bio]
    );
    testPost.author_id = res.rows[0].id;
});

// Cerrar la conexión al final
afterAll(async () => {
    await pool.end();
});

describe('Posts API', () => {

    test('POST /posts - debe crear un post válido', async () => {
        const response = await request(app).post('/posts').send(testPost);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(testPost.title);
        expect(response.body.author_id).toBe(testPost.author_id);

        testPost.id = response.body.id; // guardar para otros tests
    });

    test('GET /posts - debe listar posts', async () => {
        const resPost = await request(app).post('/posts').send(testPost);
        testPost.id = resPost.body.id;

        const response = await request(app).get('/posts');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.some(p => p.id === testPost.id)).toBe(true);
    });

    test('GET /posts/:id - debe devolver un post específico', async () => {
        const resPost = await request(app).post('/posts').send(testPost);
        testPost.id = resPost.body.id;

        const response = await request(app).get(`/posts/${testPost.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(testPost.title);
    });

    test('GET /posts/:id - devuelve 404 si no existe', async () => {
        const response = await request(app).get('/posts/99999');
        expect(response.statusCode).toBe(404);
        expect(response.body.error.message).toContain('no encontrado');
    });

    test('GET /posts/author/:authorId - devuelve posts de un author', async () => {
        const resPost = await request(app).post('/posts').send(testPost);
        testPost.id = resPost.body.id;

        const response = await request(app).get(`/posts/author/${testPost.author_id}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0].author_name).toBe(testAuthor.name);
    });

    test('PUT /posts/:id - actualiza un post', async () => {
        const resPost = await request(app).post('/posts').send(testPost);
        testPost.id = resPost.body.id;

        const updatedData = { title: 'Nuevo título', content: 'Nuevo contenido' };
        const response = await request(app).put(`/posts/${testPost.id}`).send(updatedData);

        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(updatedData.title);
    });

    test('DELETE /posts/:id - elimina un post', async () => {
        const resPost = await request(app).post('/posts').send(testPost);
        testPost.id = resPost.body.id;

        const response = await request(app).delete(`/posts/${testPost.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(testPost.id);

        const resGet = await request(app).get(`/posts/${testPost.id}`);
        expect(resGet.statusCode).toBe(404);
    });

});