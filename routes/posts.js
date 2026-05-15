const {validatePost} = require('../middlewares/validation.js');
const postService = require('../services/postsService.js');
const express = require('express');
const router = express.Router();

// GET /posts - listar posts
router.get('/', async (req, res, next) =>{
    try {
        const post = await postService.getAllPosts();
        res.json(post);
    } catch (error) {
        next(error);
    }
})

// GET /posts/:id - detalle post
router.get('/:id', async (req, res, next) => {
    try {
        const posts = await postService.getPostById(req.params.id);
        if (!posts) {
           return res.status(404).json({error: {message:'Post no encontrado', code: 'NOT_FOUND'}});
        }
        res.json(posts);
    } catch (error) {
        next(error);
    }
})

// GET /posts/author/:authorId - posts con detalle de su author
router.get('/author/:authorId', async (req, res, next) => {
    try {
        const { authorId } = req.params;
        console.log('AuthorId recibido:', authorId); // <--- Esto confirma que entra aquí
        const posts = await postService.getPostsByAuthorId(authorId);
        if (!posts || posts.length === 0) {
            return res.status(404).json({error: {message:'El autor no tiene posts', code:'NOT_FOUND'}});
        }
        res.json(posts)
    } catch (error) {
        next(error);
    }
})

// POST /posts - crear post
router.post('/', validatePost, async (req, res, next) => {
    try {
        const newPost = await postService.createPost(req.body);
        res.status(201).json(newPost);
    } catch (error) {
        next(error);
    }
})

// PUT /posts/:id - actualizar post
router.put('/:id', validatePost, async (req, res, next) => {
    try {
        const updatePost = await postService.updatePost(req.params.id, req.body);
        if (!updatePost) {
            return res.status(404).json({error: {message:'Post no encontrado', code:'NOT_FOUND'}});
        }
        res.json(updatePost);
    } catch (error) {
        next(error);
    }
})

// DELETE /posts/:id - eliminar post
router.delete('/:id', async (req, res, next) => {
    try {
        const deletedPost = await postService.deletePost(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({error: {message:'Post no encontrado', code:'NOT_FOUND'}});
        }
        res.json(deletedPost);
    } catch (error) {
        next(error);
    }
})

module.exports =router;