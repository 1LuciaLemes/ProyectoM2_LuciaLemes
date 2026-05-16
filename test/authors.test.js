import { describe, test, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
const app = require('../app'); // tu app Express
const pool = require('../db/config'); // conexión a PostgreSQL

// Datos de prueba
let testAuthor = {
  name: 'Test Author',
  email: 'testauthor@example.com',
  bio: 'Bio de prueba'
};

// Limpiar tabla antes de cada test para que sean independientes
beforeEach(async () => {
  await pool.query('DELETE FROM authors');
});

// Cerrar la conexión después de todos los tests
afterAll(async () => {
  await pool.end();
});

describe('Authors API', () => {

  test('POST /authors - debe crear un author con datos válidos', async () => {
    const response = await request(app)
      .post('/authors')
      .send(testAuthor);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(testAuthor.name);
    expect(response.body.email).toBe(testAuthor.email);

    testAuthor.id = response.body.id; // guardamos el id para otros tests
  });

  test('POST /authors - no debe permitir email duplicado', async () => {
    // Creamos el primer author
    await request(app).post('/authors').send(testAuthor);

    // Intentamos crear otro con el mismo email
    const response = await request(app)
      .post('/authors')
      .send(testAuthor);

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('El email ya está registrado');
  });

  test('GET /authors - debe listar todos los authors', async () => {
    const resPost = await request(app).post('/authors').send(testAuthor);
    testAuthor.id = resPost.body.id;

    const response = await request(app).get('/authors');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some(a => a.id === testAuthor.id)).toBe(true);
  });

  test('GET /authors/:id - debe devolver el author específico', async () => {
    const resPost = await request(app).post('/authors').send(testAuthor);
    testAuthor.id = resPost.body.id;

    const response = await request(app).get(`/authors/${testAuthor.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(testAuthor.name);
    expect(response.body.email).toBe(testAuthor.email);
  });

  test('GET /authors/:id - devuelve 404 si no existe', async () => {
    const response = await request(app).get('/authors/99999');
    expect(response.statusCode).toBe(404);
    expect(response.body.error.message).toContain('no encontrado');
  });

  test('PUT /authors/:id - actualiza los datos del author', async () => {
    const resPost = await request(app).post('/authors').send(testAuthor);
    testAuthor.id = resPost.body.id;

    const updatedData = { name: 'Autor Actualizado', email: 'nuevoemail@example.com' };
    const response = await request(app)
      .put(`/authors/${testAuthor.id}`)
      .send(updatedData);

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(updatedData.name);
    expect(response.body.email).toBe(updatedData.email);
  });

  test('PUT /authors/:id - no permite email duplicado en actualización', async () => {
    // Creamos dos authors
    const a1 = await request(app).post('/authors').send({ name:'A1', email:'a1@example.com' });
    const a2 = await request(app).post('/authors').send({ name:'A2', email:'a2@example.com' });

    const response = await request(app)
    .put(`/authors/${a2.body.id}`)
    .send({ name: 'A2', email: 'a1@example.com' });

    expect(response.statusCode).toBe(400); // coincide con tu API
    expect(response.body.error).toContain('El email ya está registrado'); // mensaje exacto
  });

  test('DELETE /authors/:id - elimina un author existente', async () => {
    const resPost = await request(app).post('/authors').send(testAuthor);
    testAuthor.id = resPost.body.id;

    const response = await request(app).delete(`/authors/${testAuthor.id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(testAuthor.id);

    // Verificamos que realmente fue eliminado
    const resGet = await request(app).get(`/authors/${testAuthor.id}`);
    expect(resGet.statusCode).toBe(404);
  });

  test('DELETE /authors/:id - devuelve 404 si no existe', async () => {
    const response = await request(app).delete('/authors/99999');
    expect(response.statusCode).toBe(404);
  });

});