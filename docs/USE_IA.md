<a name="inicio"></a>

[⬆ Volver al README principal](../README.md)
# Uso de IA para el desarrollo del proyecto

En este documento se describe cómo se utilizó la inteligencia artificial para asistir en el desarrollo y avance de este proyecto. La IA se utilizó como herramienta de apoyo, pero **toda la implementación final fue revisada y adaptada manualmente** por el desarrollador.

## Índice

1. [Resumen rápido de prompts y resultados](#resumen-rápido-de-prompts-y-resultados)
2. [Generación de tests para la API](#1-generación-de-tests-para-la-api)
3. [Generación de CRUDs genéricos](#2-generación-de-cruds-genéricos)
4. [Generación de planilla OpenAPI/Swagger](#3-generación-de-planilla-openapiswagger)
5. [Estructura del README](#4-estructura-del-readme)

## Resumen rápido de prompts y resultados

| Objetivo | Prompt proporcionado | Resultado de la IA |
|-----------|------------------|-----------------|
| Tests CRUD | [Ver prompt](#1-generación-de-tests-para-la-api) | Ejemplo completo de tests con Vitest y Supertest |
| CRUD genérico | [Ver prompt](#2-generación-de-cruds-genéricos) | Código de endpoints CRUD genéricos |
| OpenAPI | [Ver prompt](#3-generación-de-planilla-openapiswagger) | Plantilla OpenAPI 3.x con explicación de cada campo |
| README | [Ver prompt](#4-estructura-del-readme) | Estructura completa del README lista para completar |

---

[⬆ Volver al índice](#índice)

## 1. Generación de tests para la API

Para aprender a escribir tests y tener ejemplos claros, se le pidió a la IA actuar como un **tutor experto en testing de APIs con Node.js**, con el siguiente prompt:
```
Actúa como un tutor experto en testing de APIs con Node.js. 
Quiero que me enseñes desde cero cómo escribir tests para mis rutas usando Vitest y Supertest, considerando que ya cuento con datos existentes en la base de datos, pon además comentarios señalando conceptos importantes de lógica. Requisitos: 
1. Quiero un solo describe por tipo de endpoint: GET (todos), GET/:id, POST, PUT, DELETE. 
2. Para cada endpoint, explica: - Qué revisar: status codes, formato de la respuesta, propiedades esperadas. - Casos de prueba a cubrir: éxito, errores (404, 400, etc.), validación de datos. - Qué datos enviar en la request y qué validar en la respuesta. 
3. Los tests deben ser **independientes y reproducibles**, sin depender de datos externos o del orden de ejecución. 
4. Genera un ejemplo completo de código listo para copiar y ejecutar, usando: - describe e it de Vitest - Supertest para hacer las requests - Comentarios explicativos sobre cada línea y la lógica detrás de cada decisión 
5. La estructura del test debe ser clara, profesional y organizada, con un solo describe por endpoint.
```



**Ejemplo de respuesta generada por la IA:**

```js
// tests/users.test.js

// Importamos dependencias
import request from 'supertest'; // Para simular HTTP requests a nuestra API
import { describe, it, expect, beforeEach } from 'vitest'; // Vitest para organizar tests
import app from '../src/app'; // Importa tu app de Express o Fastify

// Mock de datos iniciales para asegurar tests reproducibles
// No dependemos de datos externos ni del orden de ejecución
const initialUsers = [
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'bob@example.com' },
];

// Esta función reinicia la base de datos antes de cada test
// Asegura independencia y reproducibilidad
async function resetDatabase() {
  // Suponemos que tienes un modelo User con métodos estáticos
  // Aquí borramos todo y volvemos a insertar los datos iniciales
  await User.deleteMany({});
  await User.insertMany(initialUsers);
}

// =====================================
// TESTS PARA ENDPOINTS DE USERS
// =====================================

// --------------------
// GET /users -> Obtener todos los usuarios
// --------------------
describe('GET /users', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it('debe devolver todos los usuarios con status 200', async () => {
    const res = await request(app).get('/users');

    // Validaciones importantes
    expect(res.status).toBe(200); // Status code correcto
    expect(Array.isArray(res.body)).toBe(true); // Debe ser un array
    expect(res.body.length).toBe(initialUsers.length); // Debe coincidir con la cantidad inicial

    // Validamos propiedades de cada usuario
    res.body.forEach(user => {
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('id'); // Suponemos que tu modelo genera un id
    });
  });
});

// --------------------
// GET /users/:id -> Obtener un usuario por ID
// --------------------
describe('GET /users/:id', () => {
  let userId;

  beforeEach(async () => {
    await resetDatabase();
    const users = await User.find({});
    userId = users[0]._id.toString(); // Tomamos un ID válido para los tests
  });

  it('debe devolver un usuario válido con status 200', async () => {
    const res = await request(app).get(`/users/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', userId);
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('email');
  });

  it('debe devolver 404 si el usuario no existe', async () => {
    const fakeId = '64b7f99f2f1b2c0012345678';
    const res = await request(app).get(`/users/${fakeId}`);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
```
*Nota: Se resumió la respuesta dada por la IA, ya que de esta misma forma se manejaban los otros endpoints.
> **Nota adicional:** El objetivo de este uso de la IA no fue generar tests específicos para `authors` o `posts`, sino aprender un patrón **genérico** de testing de endpoints CRUD. Al revisar este ejemplo, se deben tener en cuenta aspectos fundamentales a testear:
> 
> - Status codes correctos (200, 201, 404, 400, 500, etc.).
> - Formato y propiedades esperadas de la respuesta (arrays, objetos, campos obligatorios).
> - Validación de datos enviados en la request (tipos, campos obligatorios).
> - Independencia de los tests: cada test debe poder ejecutarse solo, sin depender del orden o de datos externos.
> - Casos de éxito y error para cada tipo de endpoint (GET, POST, PUT, DELETE).*

[⬆ Volver al índice](#índice)

---

## 2. Generación de CRUDs genéricos

Se utilizó la IA para obtener **ejemplos de código genéricos para los endpoints CRUD**, que luego fueron adaptados a las tablas reales (`authors`, `posts`, `comments`). El prompt que se utilizó:

```
Genera un ejemplo completo de un router de Express para Node.js que implemente CRUD completo (GET todos, GET por ID, POST, PUT, DELETE) usando PostgreSQL con pg.Pool.

Cada endpoint debe incluir manejo de errores y status codes correctos.
Agrega comentarios explicativos sobre cada línea.
No incluyas datos concretos, deja nombres de tabla y campos genéricos.
```

**Respuesta generada por la IA:**

```js
// =====================
// GET todos los registros
// =====================
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM nombre_tabla'); // cambiar nombre_tabla
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener registros' });
  }
});

// =====================
// GET por ID
// =====================
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM nombre_tabla WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener registro' });
  }
});

// =====================
// POST: crear nuevo registro
// =====================
router.post('/', async (req, res) => {
  const { campo1, campo2 } = req.body; // cambiar nombres de campos
  try {
    const result = await pool.query(
	'INSERT INTO nombre_tabla (campo1, campo2) VALUES ($1,$2)
	RETURNING *', [campo1, campo2]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear registro' });
  }
});

// =====================
// PUT: actualizar registro por ID
// =====================
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { campo1, campo2 } = req.body; // cambiar nombres de campos
  try {
    const result = await pool.query(
      'UPDATE nombre_tabla SET campo1 = $1, campo2 = $2 WHERE id = $3 RETURNING *',
      [campo1, campo2, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar registro' });
  }
});

// =====================
// DELETE: eliminar registro por ID
// =====================
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM nombre_tabla WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json({ message: 'Registro eliminado', registro: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar registro' });
  }
});
```

[⬆ Volver al índice](#índice)

## 3. Generación de planilla OpenAPI/Swagger

Promp utilizado:
```
Necesito una guía rápida y genérica de OpenAPI en formato YAML. Quiero que me muestres la estructura completa de un archivo OpenAPI 3.x, explicando qué va en cada sección (por ejemplo: openapi, info, servers, tags, paths, components, security).

- Que sea genérico, sin endpoints específicos.
- Que incluya ejemplos de cada campo para entender su propósito.
- Que muestre cómo definir schemas, parameters y responses de forma reutilizable.
- Que indique cuáles campos son obligatorios y cuáles opcionales.
- Que sea fácil de copiar como plantilla para luego completarla con mis propios endpoints.
```

**Respuesta de la IA:**
```YAML
openapi: 3.0.3          # Versión de OpenAPI
info:
  title: "API de ejemplo"     # Título de la API
  version: "1.0.0"           # Versión
  description: "Breve descripción de la API"
servers:
  - url: "http://localhost:3000"  # URL base del servidor
    description: "Servidor local de desarrollo"
paths: #Todos los endpoints
  /ejemplo:
    get:
      summary: "Ejemplo de GET"
      description: "Descripción del endpoint GET"
      responses:
        '200':
          description: "Respuesta exitosa"
components:
  schemas:
    Ejemplo:
      type: object
      properties:
        id:
          type: integer
          description: "Identificador único"
        nombre:
          type: string
          description: "Nombre de ejemplo"
```
**Notas de la guía:**

- openapi → versión de OpenAPI (obligatorio)
- info → título, versión y descripción de la API (obligatorio)
- servers → URLs donde la API está disponible (opcional, pero recomendado)
- paths → endpoints de la API con métodos HTTP y descripciones (obligatorio)
- components → definición de objetos reutilizables, como schemas, parameters y responses (opcional, pero útil)


[⬆ Volver al índice](#índice)

## 4. Estructura del README
Promp proporcionado para tener una guía de cómo realizar el readme:
```
Tengo la siguiente consigna y quiero organizar la estructura del README.md para completar con la documentación necesaria. Debes crear una API REST sencilla en Node.js + Express que gestione usuarios y posts (modelo tipo JSONPlaceholder). Usar PostgreSQL para persistencia, implementar operaciones CRUD básicas, pruebas unitarias, documentación OpenAPI y desplegar la aplicación (Railway). El objetivo es practicar conexión Express–Postgres, SQL CRUD, validación y testing sin modelos demasiado complejos.
```

La IA generó una estructura completa del README que incluía:
```
1. Índice de contenidos.
2. Descripción y objetivos generales de la API.
3. Requisitos para ejecutar la aplicación.
4. Estructura de carpetas y archivos.
5. Responsabilidad de cada archivo/carpeta (resumen).
6. Validaciones generales y tests de la API.
7. Pasos de instalación y setup.
8. Deployment y documentación interactiva.
```

Esta base permitió completar el README con los detalles específicos del proyecto, manteniendo un formato claro y profesional.

[⬆ Volver al índice](#índice)

[⬆ Volver al README principal](../README.md)