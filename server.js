const {loadEnvFile} = requiere ('node:process');
const express = requiere ('express');
const authorsRouter = requiere('./routes/authors.js');
const postsRouter = requiere('./routes/posts.js');

loadEnvFile('.env');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json ({
        message: 'Blog API',
        endpoints: {
            authors: '/api/authors',
            posts: '/api/posts'
        }
    })
})

app.use('/api/authors', authorsRouter);
app.use('/api/posts', postsRouter);

app.listen(PORT, () => {
    console.log(`Blog API escuchando en http://localhost:${PORT}`);
})