const { parse } = require('dotenv');

function validateAuthor(req, res, next) {
    const {name, email} = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({error: 'El nombre del autor es necesario, debe ser texto y no debe ser vacío.'})
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
        return res.status(400).json({error: 'El email del autor es necesario, debe ser texto y debe tener un formato válido.'})
    }
    next ();
}

function validatePost (req, res, next) {
    const { title, content, author_id } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'El título del post es necesario, debe ser texto y no debe ser vacío.' });
    }

    if (!content || typeof content !== 'string' || content.trim() === '') {
        return res.status(400).json({ error: 'El contenido del post es necesario, debe ser texto y no debe ser vacío.' });
    }

    // author_id solo obligatorio para POST
    if (req.method === 'POST') {
        const parsedAuthorId = parseInt(author_id, 10);
        if (isNaN(parsedAuthorId)) {
            return res.status(400).json({ error: 'author_id es obligatorio y debe ser un número.' });
        }
    }

    next();
}

function validateComment (req, res, next) {
    const { post_id, author_id, content } = req.body;

    // Para POST, post_id y author_id son obligatorios
    if (req.method === 'POST') {
        const parsedPostId = parseInt(post_id, 10);
        const parsedAuthorId = parseInt(author_id, 10);

        if (isNaN(parsedPostId)) {
            return res.status(400).json({ error: 'post_id es obligatorio y debe ser un número.' });
        }

        if (isNaN(parsedAuthorId)) {
            return res.status(400).json({ error: 'author_id es obligatorio y debe ser un número.' });
        }
    }

    // Para POST y PUT, content siempre debe existir y no estar vacío
    if (!content || typeof content !== 'string' || content.trim() === '') {
        return res.status(400).json({ error: 'El contenido del comentario es obligatorio y no puede estar vacío.' });
    }

    next();
}

module.exports = {
    validateAuthor,
    validatePost,
    validateComment
};