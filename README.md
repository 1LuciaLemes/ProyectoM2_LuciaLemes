# Proyecto Integrador M2 - Backend

## Descripción
### Qué hace la API:
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
- **npm**
- [Opcional] **Railway CLI** para deployment  

---

## Estructura del proyecto
``` 
/ProyectoM2_LuciaLemes
│
├─ /routes
│ ├─ authors.js
│ ├─ posts.js
│ └─ comments.js
│
├─ /services
│ ├─ authorsService.js
│ ├─ postsService.js
│ └─ commentsService.js
│
├─ /db
│ ├─ config.js
│ └─ miniblog_db.sql
│
├─ /middlewares
│ ├─ errorHandler.js
│ └─ validation.js
│
├─ /tests
│ ├─ authors.test.js
│ ├─ posts.test.js
│ └─ comments.test.js
│
├─ /docs
│ └─ openapi.yaml
│
├─ app.js
├─ server.js
├─ README.md
├─ .gitignore
├─ .env.example
├─ vitest.config.js
├─ package.json
└─ package-lock.json
```
## Endpoints / API

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

## Setup / Instalación

- ### Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_REPO>
```

- ### Configurar variables de entorno

Crear un archivo `.env` siguiendo el ejemplo `.env.example`.

## Probar la API localmente con datos de ejemplo
### 1. Instalar dependencias
```bash
npm install
```
Esto descargará todas las librerías necesarias en la carpeta node_modules.

### 2. Configurar base de datos

- #### Crear base de datos en PostgreSQL.

```
psql -U postgres
```
Te pedirá tu contraseña. Luego, dentro de PostgreSQL, crea la base de datos:

```
CREATE DATABASE miniblog;
\q
```
- #### Crea tablas y datos de ejemplo:
Ejecuta el script SQL que ya tienes en tu proyecto (db/miniblog_db.sql):
```bash
psql -U postgres -d miniblog -f db/miniblog_db.sql
```
Esto creará las tablas (authors, posts, comments) y cargará los datos de ejemplo.

- #### Iniciar el servidor Node.js
``` 
node server.js 
```

Si todo está bien, verás un mensaje indicando que la API está corriendo, por ejemplo en:
```
http://localhost:3000
```

### 3. Probar endpoints con Thunder Client / Postman
- URL base: `http://localhost:3000`
- Ejemplos:
  - GET `/authors` → lista todos los autores
  - GET `/posts/author/1` → posts del autor Ana García
  - POST `/comments` → crear un nuevo comentario usando un `author_id` y `post_id` existentes:
    ```json
    {
      "post_id": 1,
      "author_id": 3,
      "content": "¡Excelente post, gracias por compartir!"
    }
    ```

### 4. Ejecutar tests automáticos
En la terminal coloca el siguiente código para ejecutar los test:
```bash
npm test
```

## Deployment y Documentación

Para desplegar la API en Railway y acceder a la documentación interactiva:
1. Crear un proyecto en Railway.
2. Conectar tu repositorio de GitHub.
3. Configurar variables de entorno (iguales a las de tu archivo .env local)


**Public URL / Documentación interactiva:** [Acceder a la API](https://proyectom2lucialemes-production.up.railway.app/docs/#/)<br>
Desde la URL pública, podrás probar los endpoints directamente en Swagger UI y explorar toda la documentación OpenAPI.