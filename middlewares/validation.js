import { parse } from "dotenv";

export function validateAuthor(req, res, next) {
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

export function validatePost (req, res, next) {
    const {title, content, author_id} = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({error: 'El título del post es necesario, debe ser texto y no debe ser vacío.'})
    }

    if (!content || typeof content !== 'string' || content.trim() === '') {
        return res.status(400).json({error: 'El contenido del post es necesario, debe ser texto y no debe ser vacío.'})
    }

    const parsedAuthorId = parseInt(author_id,10);
    if (!parsedAuthorId || typeof parsedAuthorId !== 'number') {
        return res.status(400).json({ error: 'author_id es obligatorio y debe ser un número.' });
    }
    next();
}