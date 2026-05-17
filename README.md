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
## Responsabilidad de cada archivo / carpeta
### Archivos principales

#### server.js

Carga variables de entorno en desarrollo (dotenv) y levanta el servidor con app.listen().
No contiene rutas ni lógica de negocio.

#### app.js

Crea la instancia de Express (createApp()), activa express.json().
Monta las rutas (/authors, /posts, /comments) y registra middlewares de error.
Exporta la app para poder testear con un pool de base de datos falso.

### Rutas (/routes)

#### authors.js

Define el CRUD de autores: GET, POST, PUT, DELETE<br>
Recibe requests y delega la lógica al service correspondiente.

| Endpoint                   | Método | Responsabilidad |
|-----------------------------|--------|----------------|
| /authors                    | GET    | Listar todos los autores. |
| /authors/:id                | GET    | Obtener detalle de un autor. |
| /authors                    | POST   | Crear un nuevo autor. Recibe request, valida parámetros mínimos delega la lógica a `authorsService.js`. |
| /authors/:id                | PUT    | Actualizar un autor existente. Valida parámetros y llama al service. |
| /authors/:id                | DELETE | Eliminar un autor. Valida ID y delega al service. |

#### posts.js

Define el CRUD de posts y consultas por autor.<br>
Maneja requests y delega la lógica a postsService.js.

| Endpoint                   | Método | Responsabilidad |
|-----------------------------|--------|----------------|
| /posts                      | GET    | Listar todos los posts. |
| /posts/:id                  | GET    | Obtener detalle de un post específico. |
| /posts/author/:id           | GET    | Listar posts de un autor determinado. |
| /posts                      | POST   | Crear un nuevo post. Gestiona requests y delega la lógica a `postsService.js`. |
| /posts/:id                  | PUT    | Actualizar un post existente. Valida parámetros y llama al service. |
| /posts/:id                  | DELETE | Eliminar un post. Valida ID y delega al service. |

#### comments.js

Define el CRUD de comentarios y filtros por post o autor.<br>
Delegar la lógica a commentsService.js.

| Endpoint                     | Método | Responsabilidad |
|-------------------------------|--------|----------------|
| /comments                     | GET    | Listar todos los comentarios. |
| /comments/:id                 | GET    | Obtener detalle de un comentario. |
| /comments/post/:id            | GET    | Listar comentarios de un post específico. |
| /comments/author/:id          | GET    | Listar comentarios de un autor específico. |
| /comments                     | POST   | Crear un nuevo comentario. Maneja requests y delega a `commentsService.js`. |
| /comments/:id                 | PUT    | Actualizar un comentario. Valida parámetros y delega al service. |
| /comments/:id                 | DELETE | Eliminar un comentario. Valida ID y delega al service. |

#### authorsService.js

Contiene la lógica de negocio para CRUD de autores: consultas a la base de datos, validaciones complejas y transformaciones de datos.

#### postsService.js

Contiene la lógica de negocio para CRUD de posts y consultas específicas por autor.

#### commentsService.js

Contiene la lógica de negocio para CRUD de comentarios, incluyendo filtros por post o autor.

### Base de datos (/db)

#### config.js

Configura la conexión con PostgreSQL usando pg.Pool.<br>
Exporta el pool de conexión para que los services puedan interactuar con la DB.

#### miniblog_db.sql

Script de creación de la base de datos, tablas (authors, posts, comments) y datos de ejemplo.

### Middlewares (/middlewares)

#### errorHandler.js

Captura errores generados en las rutas o services y envía respuestas HTTP con el código y mensaje correspondiente.

#### validation.js

Contiene funciones de validación para requests: verifica campos obligatorios, formatos correctos, etc.

### Tests (/tests)

authors.test.js, posts.test.js, comments.test.js

Pruebas automáticas de los endpoints usando Vitest + Supertest.
Verifica que las rutas respondan correctamente y que la lógica de negocio funcione como se espera.

### Documentación (/docs)

#### openapi.yaml

Archivo con la documentación completa de la API en formato OpenAPI/Swagger.
### Otros archivos

#### .env.example

Ejemplo de variables de entorno necesarias para correr la API.

#### vitest.config.js

Configuración de Vitest para ejecutar los tests.

#### package.json / package-lock.json

Dependencias y scripts de la aplicación.

#### README.md

Documentación del proyecto y guía de instalación, pruebas y deployment.


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