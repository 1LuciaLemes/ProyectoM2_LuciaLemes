const {validateAuthor} = require('../middlewares/validation.js');
const authorsService = require('../services/authorsService.js');
const express = require('express');
const router = express.Router();

// GET /authors - listar usuarios
router.get('/', async (req, res, next) => {
    try {
        const authors = await authorsService.getAllAuthors();
        res.json(authors);
    } catch (error) {
        next(error);
    }
});

// GET /authors/:id - detalle de usuario
router.get('/:id', async (req, res, next) => {
    try {
        const author = await authorsService.getAuthorById(req.params.id);
        if (!author) {
            return res.status(404).json({ error: { message: 'Autor no encontrado', code:'NOT_FOUND' } });
        }
        res.json(author);
    } catch (error) {
        next(error);
    }
})

// POST /authors - crear usuario
router.post('/', validateAuthor, async (req, res, next) => {
    try {
        const newAuthor = await authorsService.createAuthor(req.body);
        res.status(201).json(newAuthor);
    } catch (error) {
        next(error);
    }
})

// PUT /authors/:id - actualizar usuario
router.put('/:id', validateAuthor, async (req, res, next) => {
    try {
        const updateAuthor = await authorsService.updateAuthor(req.params.id, req.body);
        if (!updateAuthor) {
            return res.status(404).json({error: {message:'Autor no encontrado', code:'NOT_FOUND'}});
        }
        res.json(updateAuthor);
    } catch (error) {
        next(error);
    }
})

// DELETE /authors/:id - eliminar usuario
router.delete('/:id', async (req, res, next) => {
    try {
        const deletedAuthor = await authorsService.deleteAuthor(req.params.id);
        if (!deletedAuthor) {
            return res.status(404).json({error: {message:'Autor no encontrado', code:'NOT_FOUND'}});
        }
        res.json(deletedAuthor);
    } catch (error) {
        next(error);
    }
})

module.exports = router;