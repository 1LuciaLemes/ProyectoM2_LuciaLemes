const { validateComment } = require('../middlewares/validation.js');
const commentsService = require('../services/commentsService.js');
const express = require('express');
const router = express.Router();

// GET /comments - listar todos los comentarios
router.get('/', async (req, res, next) => {
    try {
        const comments = await commentsService.getAllComments();
        res.json(comments);
    } catch (error) {
        next(error);
    }
});

// GET /comments/:id - obtener un comentario por su id
router.get('/:id', async (req, res, next) => {
    try {
        const comment = await commentsService.getCommentById(req.params.id);
        if (!comment) {
            return res.status(404).json({ error: { message: 'Comentario no encontrado', code: 'NOT_FOUND' } });
        }
        res.json(comment);
    } catch (error) {
        next(error);
    }
});

// GET /comments/post/:id - listar comentarios de un post
router.get('/post/:id', async (req, res, next) => {
    try {
        const comments = await commentsService.getCommentByPostId(req.params.id);
        res.json(comments);
    } catch (error) {
        next(error);
    }
});

// GET /comments/author/:id - listar comentarios de un author
router.get('/author/:id', async (req, res, next) => {
    try {
        const comments = await commentsService.getCommentByAuthorId(req.params.id);
        res.json(comments);
    } catch (error) {
        next(error);
    }
});

// POST /comments - crear un comentario
router.post('/', validateComment, async (req, res, next) => {
    try {
        const newComment = await commentsService.createComment(
            req.body.post_id,
            req.body.author_id,
            req.body.content
        );
        res.status(201).json(newComment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /comments/:id - actualizar un comentario
router.put('/:id', validateComment, async (req, res, next) => {
    try {
        const updatedComment = await commentsService.updateComment(req.params.id, { content: req.body.content });
        if (!updatedComment) {
            return res.status(404).json({ error: { message: 'Comentario no encontrado', code: 'NOT_FOUND' } });
        }
        res.json(updatedComment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /comments/:id - eliminar un comentario
router.delete('/:id', async (req, res, next) => {
    try {
        const deletedComment = await commentsService.deleteComment(req.params.id);
        if (!deletedComment) {
            return res.status(404).json({ error: { message: 'Comentario no encontrado', code: 'NOT_FOUND' } });
        }
        res.json({ message: 'Comentario eliminado' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;