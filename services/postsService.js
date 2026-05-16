const pool  = require('../db/config.js');

// GET /posts - listar posts
async function getAllPosts () {
    const result = await pool.query('SELECT * FROM posts');
    return result.rows;
}

// GET /posts/:id - detalle post
async function getPostById (id) {
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    return result.rows[0];
}

// GET /posts/author/:authorId - posts con detalle de su author
async function getPostsByAuthorId (authorId) {
    const result = await pool.query(
    'SELECT p.*, a.name AS author_name, a.email AS author_email FROM posts p JOIN authors a ON p.author_id = a.id WHERE p.author_id = $1',
    [authorId]
);
    return result.rows;
} 

// POST /posts - crear post
async function createPost ({title, content, author_id}) {
    //verifico que author id exista
    const author = await pool.query('SELECT * FROM authors WHERE id = $1', [author_id]);
    if (author.rows.length === 0) {
        throw new Error('El author_id no existe');
    }

    const result = await pool.query(
        'INSERT INTO posts (title, content, author_id) VALUES ($1, $2, $3) RETURNING *',
        [title, content, author_id]
    );
    return result.rows[0];
}

// PUT /posts/:id - actualizar post
async function updatePost (id, {title, content}) {
    //obtengo el post existente para comparar
    const existingPostRes = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (existingPostRes.rows.length === 0) {
        throw new Error('El post no existe');
    }
    const existingPost = existingPostRes.rows[0];

    //uso los valores nuevos o los que ya tenia
    const newTitle = title || existingPost.title;
    const newContent = content || existingPost.content;
    const newAuthorId = existingPost.author_id;

    const result = await pool.query (
        'UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *',
        [newTitle, newContent, id]
    )
    return result.rows[0];
}

// DELETE /posts/:id - eliminar post
async function deletePost (id) {
    const existingPostRes = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (existingPostRes.rows.length === 0) {
        throw new Error('El post no existe');
    }
    const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
}

module.exports = {
    getAllPosts,
    getPostById,
    getPostsByAuthorId,
    createPost,
    updatePost,
    deletePost
}