const pool = require('../db/config');

// GET /comments - Listar todos los comentarios.
async function getAllComments () {
    const result = await pool.query(`
        SELECT c.*, a.name AS author_name, a.email AS author_email, p.title AS post_title
        FROM comments c
        JOIN authors a ON c.author_id = a.id
        JOIN posts p ON c.post_id = p.id
        ORDER BY c.created_at ASC;`);
    return result.rows;
}

// GET /comments/:id - obtener un comentario por su id
async function getCommentById(commentId) {
    const result = await pool.query(
        `SELECT c.*, a.name AS author_name, a.email AS author_email, p.title AS post_title
         FROM comments c
         JOIN authors a ON c.author_id = a.id
         JOIN posts p ON c.post_id = p.id
         WHERE c.id = $1`,
        [commentId]
    );
    return result.rows[0] || null;
}

// GET /comments/post/:id - Listar comentarios de un post
async function getCommentByPostId (postId) {
    const result = await pool.query(
        `SELECT c.*, a.name AS author_name, a.email AS author_email 
        FROM comments c 
        JOIN authors a ON c.author_id = a.id 
        WHERE c.post_id = $1 
        ORDER BY c.created_at ASC`,
        [postId]);
    return result.rows;
}

// GET /comments/author/:id - Listar comentarios de un author
async function getCommentByAuthorId (authorId) {
    const result = await pool.query(
        `SELECT c.*, a.name AS author_name, a.email AS author_email, p.title AS post_title
        FROM comments c
        JOIN authors a ON c.author_id = a.id
        JOIN posts p ON c.post_id = p.id
        WHERE c.author_id = $1
        ORDER BY c.created_at ASC`,
        [authorId]
    )
    return result.rows;
}

// POST /comments - Crear un comentario
async function createComment (post_id, author_id, content) {
    const post = await pool.query('SELECT * FROM posts WHERE id = $1', [post_id]);
    if (post.rows.length === 0) {
        throw new Error ('El post_id no existe.')
    }

    const author = await pool.query ('SELECT * FROM authors WHERE id = $1', [author_id]);
    if (author.rows.length === 0) {
        throw new Error ('El autor_id no existe.')
    }

    const result = await pool.query('INSERT INTO comments (post_id, author_id, content) VALUES ($1, $2, $3) RETURNING *',
        [post_id, author_id, content]
    );
    return result.rows[0];
}

// PUT /comments/:id - Editar un comentario
async function updateComment (commentId, {content}) {
    const existingCommentRes = await pool.query('SELECT * FROM comments WHERE id = $1', [commentId]);
    if (existingCommentRes.rows.length === 0) return null;

    const result = await pool.query(
        'UPDATE comments SET content = $1 WHERE id = $2 RETURNING *',
        [content, commentId]
    )

    return result.rows[0];
}

// DELETE /comments/:id - Borrar un comentario
async function deleteComment (commentId) {
    const existingComment = await pool.query('SELECT * FROM comments WHERE id = $1', [commentId]);
    if (existingComment.rows.length === 0) return null;

    const result = await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);
    return { message: 'Comentario eliminado' };
}

module.exports = {
    getAllComments,
    getCommentById,
    getCommentByPostId,
    getCommentByAuthorId,
    createComment,
    updateComment,
    deleteComment
}