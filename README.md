# Proyecto Integrador M2 - Backend

## Descripción

Este proyecto es una **API REST** desarrollada en **Node.js + Express**, conectada a **PostgreSQL**, que permite gestionar **authors**, **posts** y **comments**.

El objetivo es practicar la creación de **endpoints CRUD**, validaciones, manejo de errores, tests automatizados y documentación **OpenAPI**.

La API permite:

- **Gestionar autores:** crear, listar, actualizar y eliminar.
- **Gestionar posts:** crear, listar, actualizar y eliminar, incluyendo posts por autor.
- **Gestionar comentarios:** crear, listar, actualizar y eliminar, incluyendo comentarios por post y por autor.

---

## Requisitos

- **Node.js** >= 18  
- **PostgreSQL** >= 14  
- **npm** o **yarn**  
- [Opcional] **Railway CLI** para deployment  

---

## Setup Local

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_REPO>
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar base de datos
Crear base de datos en PostgreSQL.<br>
Ejecutar el script de setup (db/miniblog_db.sql):<br>
```bash
psql -U <usuario> -d <nombre_db> -f db/miniblog_db.sql
```
Verificar que las tablas authors, posts y comments se crearon correctamente.<br>

### 4. Configurar variables de entorno

Crear un archivo .env siguiendo el ejemplo .env.example:<br>
```bash
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=mi_contraseña
DB_NAME=miniblog
DB_PORT=5432
PORT=3000
```
Ejecutar la aplicación
```bash
npm start
```
La API estará disponible en http://localhost:3000.

## Endpoints

La API cuenta con los siguientes endpoints:
### Authors

| Método | Ruta           | Descripción                 |
|--------|----------------|----------------------------|
| GET    | /authors       | Listar todos los autores   |
| GET    | /authors/:id   | Obtener detalle de un autor|
| POST   | /authors       | Crear un nuevo autor       |
| PUT    | /authors/:id   | Actualizar un autor        |
| DELETE | /authors/:id   | Eliminar un autor          |

### Posts

| Método | Ruta               | Descripción                     |
|--------|------------------|---------------------------------|
| GET    | /posts            | Listar todos los posts          |
| GET    | /posts/:id        | Obtener detalle de un post      |
| GET    | /posts/author/:id | Listar posts de un autor        |
| POST   | /posts            | Crear un nuevo post             |
| PUT    | /posts/:id        | Actualizar un post existente    |
| DELETE | /posts/:id        | Eliminar un post                |

### Comments

| Método | Ruta                 | Descripción                     |
|--------|--------------------|---------------------------------|
| GET    | /comments           | Listar todos los comentarios    |
| GET    | /comments/:id       | Obtener detalle de un comentario|
| GET    | /comments/post/:id  | Listar comentarios de un post   |
| GET    | /comments/author/:id| Listar comentarios de un autor  |
| POST   | /comments           | Crear un nuevo comentario       |
| PUT    | /comments/:id       | Actualizar un comentario        |
| DELETE | /comments/:id       | Eliminar un comentario          |

### Tests
Se utilizan Vitest y Supertest para pruebas de endpoints.<br>
Ejecutar tests:
```bash
npm test
```
Se recomienda correrlos después de crear la base de datos y poblarla con datos de ejemplo.

## Documentación OpenAPI

La documentación completa está disponible en openapi.yaml.<br>
Se puede visualizar con Swagger UI siguiendo estos pasos:<br>

- Instalar Swagger UI localmente o usar Swagger Editor Online.
- Cargar el archivo openapi.yaml.
- Probar los endpoints directamente desde la interfaz.
- Deployment en Railway
- Crear un proyecto en Railway.
- Conectar tu repositorio de GitHub.
- Configurar variables de entorno en Railway (igual que tu .env local).
- Ejecutar el deploy.


El proyecto proporcionará:<br>
- Internal URL: usada por servicios internos.<br>
- Public URL: URL pública para consumir la API.