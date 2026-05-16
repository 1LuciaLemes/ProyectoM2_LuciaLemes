import { describe, test, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
const app = require('../app');
const pool = require('../db/config');

// Datos de prueba
let testAuthor = { name: 'Test Author', email: 'author@test.com', bio: 'Bio prueba' };
let testPost = { title: 'Test Post', content: 'Contenido prueba' };
let testComment = { content: 'Comentario de prueba' };

// Limpiar tablas antes de cada test
beforeEach(async () => {
  await pool.query('DELETE FROM comments');
  await pool.query('DELETE FROM posts');
  await pool.query('DELETE FROM authors');
});

// Cerrar conexión después de todos los tests
afterAll(async () => {
  await pool.end();
});

describe('Comments API', () => {

  // Crear author y post antes de tests de comments
  beforeEach(async () => {
    const authorRes = await pool.query(
      'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *',
      [testAuthor.name, testAuthor.email, testAuthor.bio]
    );
    testAuthor.id = authorRes.rows[0].id;

    const postRes = await pool.query(
      'INSERT INTO posts (title, content, author_id) VALUES ($1, $2, $3) RETURNING *',
      [testPost.title, testPost.content, testAuthor.id]
    );
    testPost.id = postRes.rows[0].id;
  });

  test('POST /comments - crea un comentario válido', async () => {
    const response = await request(app)
      .post('/comments')
      .send({ content: testComment.content, post_id: testPost.id, author_id: testAuthor.id });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.content).toBe(testComment.content);
    testComment.id = response.body.id; // guardar id para tests siguientes
  });

  test('POST /comments - falla si content está vacío', async () => {
    const response = await request(app)
      .post('/comments')
      .send({ content: '', post_id: testPost.id, author_id: testAuthor.id });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toContain('contenido'); // según tu mensaje de validation
  });

  test('GET /comments - lista todos los comentarios', async () => {
    await request(app).post('/comments').send({ content: testComment.content, post_id: testPost.id, author_id: testAuthor.id });
    const response = await request(app).get('/comments');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some(c => c.content === testComment.content)).toBe(true);
  });

  test('GET /comments/:id - devuelve un comentario específico', async () => {
    const resPost = await request(app).post('/comments').send({ content: testComment.content, post_id: testPost.id, author_id: testAuthor.id });
    testComment.id = resPost.body.id;

    const response = await request(app).get(`/comments/${testComment.id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.content).toBe(testComment.content);
  });

  test('GET /comments/:id - 404 si no existe', async () => {
    const response = await request(app).get('/comments/99999');
    expect(response.statusCode).toBe(404);
  });

  test('PUT /comments/:id - actualiza un comentario', async () => {
    const resPost = await request(app).post('/comments').send({ content: testComment.content, post_id: testPost.id, author_id: testAuthor.id });
    testComment.id = resPost.body.id;

    const updated = { content: 'Comentario actualizado' };
    const response = await request(app).put(`/comments/${testComment.id}`).send(updated);

    expect(response.statusCode).toBe(200);
    expect(response.body.content).toBe(updated.content);
  });

  test('DELETE /comments/:id - elimina un comentario', async () => {
    const resPost = await request(app).post('/comments').send({ content: testComment.content, post_id: testPost.id, author_id: testAuthor.id });
    testComment.id = resPost.body.id;

    const response = await request(app).delete(`/comments/${testComment.id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toContain('eliminado');

    // Verificar que realmente se borró
    const resGet = await request(app).get(`/comments/${testComment.id}`);
    expect(resGet.statusCode).toBe(404);
  });

});