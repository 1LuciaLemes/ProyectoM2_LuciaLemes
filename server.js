const express = require ('express');
const authorsRouter = require('./routes/authors.js');
const postsRouter = require('./routes/posts.js');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/posts', postsRouter);
app.use('/authors', authorsRouter);

app.get('/', (req, res) => {
    res.json ({
        message: 'Blog API',
        endpoints: {
            authors: '/api/authors',
            posts: '/api/posts'
        }
    })
})

app.get('/', (req, res) => {
    res.json({
        message: 'Blog API',
        endpoints: {
            authors: '/authors',
            posts: '/posts',
            postsByAuthor: '/posts/author/:authorId'
        }
    })
});

app.listen(PORT, () => {
    console.log(`Blog API escuchando en http://localhost:${PORT}`);
})