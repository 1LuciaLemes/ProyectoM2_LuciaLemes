# Proyecto Integrador M2 - Backend

## Índice
- [Descripción](#descripción)
- [Requisitos](#requisitos)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Responsabilidad de cada archivo / carpeta](#responsabilidad-de-cada-archivo--carpeta)
- [Validaciones del API](#validaciones-del-api)
- [Tests del API](#tests-del-api)
- [Setup / Instalación](#setup--instalación)
- [Deployment y Documentación](#deployment-y-documentación)
- [Uso de IA](#uso-de-ia)


## Descripción
### Qué hace la API:
Este proyecto es una **API REST** desarrollada en **Node.js + Express**, conectada a **PostgreSQL**, que permite gestionar **authors**, **posts** y **comments**.

El objetivo es practicar la creación de **endpoints CRUD**, validaciones, manejo de errores, tests automatizados y documentación **OpenAPI**.

La API permite:

- **Gestionar autores:** crear, listar, actualizar y eliminar.
- **Gestionar posts:** crear, listar, actualizar y eliminar, incluyendo posts por autor.
- **Gestionar comentarios:** crear, listar, actualizar y eliminar, incluyendo comentarios por post y por autor.

---
[⬆ Volver al índice](#índice)
## Requisitos

- **Node.js** >= 18  
- **PostgreSQL** >= 14  
- **npm**
- [Opcional] **Railway CLI** para deployment  

[⬆ Volver al índice](#índice)

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
│ ├─ openapi.yaml
│ └─ USE_IA.md
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


[⬆ Volver al índice](#índice)
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

A continuación se describen las validaciones aplicadas a los distintos endpoints:

| Función             | Campos Verificados                          | Reglas                                                                                         | Método Aplicable |
|--------------------|--------------------------------------------|------------------------------------------------------------------------------------------------|----------------|
| `validateAuthor`    | `name`, `email`                             | - `name`: obligatorio, debe ser texto, no vacío<br>- `email`: obligatorio, debe ser texto con formato válido | POST/PUT       |
| `validatePost`      | `title`, `content`, `author_id`             | - `title`: obligatorio, debe ser texto, no vacío<br>- `content`: obligatorio, debe ser texto, no vacío<br>- `author_id`: obligatorio en POST, debe ser número | POST/PUT       |
| `validateComment`   | `post_id`, `author_id`, `content`           | - `post_id`: obligatorio en POST, debe ser número<br>- `author_id`: obligatorio en POST, debe ser número<br>- `content`: obligatorio, debe ser texto, no vacío | POST/PUT       |

#### Explicación de la tabla:
- Función → Nombre de la función de validación que exportas.
- Campos Verificados → Qué propiedades del req.body se revisan.
- Reglas → Requisitos específicos que debe cumplir cada campo.
- Método Aplicable → Si la validación aplica a POST, PUT, o ambos.


### Tests del API

#### Authors API

Esta sección resume los tests implementados para la gestión de autores en la API.

| Endpoint / Función       | Qué prueba / Descripción                                                                 |
|--------------------------|-----------------------------------------------------------------------------------------|
| `POST /authors`          | - Crea un autor con datos válidos (`name`, `email`, `bio`) y devuelve un `id`. <br> - No permite crear un autor con un email que ya existe. |
| `GET /authors`           | Lista todos los autores registrados.                                                    |
| `GET /authors/:id`       | - Obtiene un autor específico por su `id`. <br> - Devuelve 404 si el autor no existe. |
| `PUT /authors/:id`       | - Actualiza los datos de un autor existente y refleja los cambios correctamente. <br> - No permite actualizar usando un email que ya pertenece a otro autor. |
| `DELETE /authors/:id`    | - Elimina un autor existente y confirma que ya no se puede acceder a él. <br> - Devuelve 404 si se intenta eliminar un autor que no existe. |

#### Posts API

| Endpoint / Función             | Qué prueba / Descripción                                                                 |
|--------------------------------|-----------------------------------------------------------------------------------------|
| `POST /posts`                  | Crear post válido con `title`, `content` y `author_id`.                                  |
| `GET /posts`                   | Lista todos los posts.                                                                   |
| `GET /posts/:id`               | - Obtener un post específico por `id`. <br> - Devuelve 404 si el post no existe.        |
| `GET /posts/author/:authorId` | Devuelve todos los posts de un autor específico.                                         |
| `PUT /posts/:id`               | Actualiza el `title` y `content` de un post existente.                                   |
| `DELETE /posts/:id`            | Elimina un post y confirma que ya no existe.                                             |

#### Comments API

| Endpoint / Función             | Qué prueba / Descripción                                                                 |
|--------------------------------|-----------------------------------------------------------------------------------------|
| `POST /comments`               | - Crear comentario válido con `content`, `post_id` y `author_id`. <br> - No permite crear comentario sin `content`. |
| `GET /comments`                | Lista todos los comentarios.                                                            |
| `GET /comments/:id`            | - Obtener un comentario específico por `id`. <br> - Devuelve 404 si el comentario no existe. |
| `PUT /comments/:id`            | Actualiza el `content` de un comentario existente.                                       |
| `DELETE /comments/:id`         | Elimina un comentario y confirma que ya no existe.                                       |

### Documentación (/docs)

#### USE_IA.md

Archivo con la documentación completa de cómo se utilizó la IA para el avance y construcción de este proyecto.

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


[⬆ Volver al índice](#índice)

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
1. Instalar Vitest (si aún no está instalado):
```bash
npm install --save-dev vitest
```
2. Ejecutar los test:
```bash
npm test
```


[⬆ Volver al índice](#índice)
## Deployment y Documentación

### Documentación interactiva con Swagger

Esta API incluye documentación generada con **OpenAPI/Swagger**, que permite:
- Explorar los endpoints disponibles
- Ver los parámetros de entrada y salida
- Probar requests directamente desde el navegador

### Probar Swagger localmente
1. Instala las dependencias:
```bash
npm install
```

### Desplegar la API en Railway

1. Crear un proyecto en [Railway](https://railway.app/).  
2. Conectar tu repositorio de GitHub.  
3. Configurar variables de entorno en Railway:

```env
PORT=3000
DATABASE_URL_PUBLIC=<URL_DE_TU_BASE_DE_DATOS_POSTGRESQL>
```

*Nota: DATABASE_URL_PUBLIC es la URL pública de tu base de datos PostgreSQL en Railway. Se usa para que la API pueda conectarse desde cualquier lugar.*

4. Conectar la base de datos y agregar datos iniciales:

En tu terminal (Git Bash, por ejemplo), ejecuta:
```
psql <DATABASE_URL_PUBLIC>
```

Luego, dentro de PostgreSQL, ejecuta el script de creación de tablas y datos de ejemplo:
```
\i db/miniblog_db.sql
```

Esto creará las tablas authors, posts y comments, y cargará los datos iniciales para probar la API.

5. Railway detectará automáticamente que tu proyecto es Node.js y levantará la app.
6. Verifica los logs en Railway para confirmar que la API se está ejecutando correctamente.

### URL pública

**Public URL / Swagger:** [Acceder a la API](https://proyectom2lucialemes-production.up.railway.app/docs/#/)<br>
Desde esta URL podrás usar Swagger para explorar los endpoints y probar requests directamente.

## Uso de IA

Para ver cómo se utilizó la inteligencia artificial durante el desarrollo, revisa [Uso de IA para el proyecto](docs/USE_IA.md#inicio)

[⬆ Volver al índice](#índice)