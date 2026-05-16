const pool = require('../db/config.js');

// GET /authors - listar usuarios
async function getAllAuthors () {
    const result = await pool.query('SELECT * FROM authors');
    return result.rows;
}

// GET /authors/:id - detalle de usuario
async function getAuthorById (id) {
    const result = await pool.query('SELECT * FROM authors WHERE id = $1', [id]);
     return result.rows[0];
}

// POST /authors - crear usuario
async function createAuthor ({name, email, bio}){
    //email unico
    const existing = await pool.query('SELECT * FROM authors WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
        throw new Error('El email ya está registrado');
    }
    const result = await pool.query(
        'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *',
        [name, email, bio]
    );
    return result.rows[0]
}

// PUT /authors/:id - actualizar usuario
async function updateAuthor (id, {name, email, bio}) {
    // obtengo el autor existente para comparar
    const existingAuthorRes = await pool.query('SELECT * FROM authors WHERE id = $1', [id]);
    if (existingAuthorRes.rows.length === 0) {
        throw new Error('El autor no existe');
    }
    const existingAuthor = existingAuthorRes.rows[0];

    // uso los valores nuevos o, si no vienen, los que ya tenia
    const newName = name || existingAuthor.name;
    const newEmail = email || existingAuthor.email;
    const newBio = bio || existingAuthor.bio;

    // este if se activa solo si se envía un email nuevo y diferente al actual
    // en ese caso verifico que el nuevo email no esté registrado por otro autor
    // AND id != $2 → excluye al autor que estamos actualizando, para que no se compare consigo mismo
    if (email && email !== existingAuthor.email) {
        const emailCheck = await pool.query(
            'SELECT * FROM authors WHERE email = $1 AND id != $2',
            [email, id]
        );
        if (emailCheck.rows.length > 0) {
            throw new Error('El email ya está registrado');
        }
    }

    // Hago la actualización
    const result = await pool.query(
        'UPDATE authors SET name = $1, email = $2, bio = $3 WHERE id = $4 RETURNING *',
        [newName, newEmail, newBio, id]
    );

    return result.rows[0];
}

// DELETE /authors/:id - eliminar usuario
async function deleteAuthor (id) {
    const result = await pool.query(
        'DELETE FROM authors WHERE id = $1 RETURNING *',
        [id]
    );
    return result.rows[0];
}

// Exportar todas las funciones
module.exports = {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor
};