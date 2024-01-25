const express = require('express');
const auth = require('./auth');
const posts = require('./posts');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();

// Middleware for parsing JSON in the request body
app.use(express.json());

app.use("/posts", (req, res, next) => {
    const authHeader = req.header('authorization');
    console.log(authHeader);
    if (authHeader == null) return res.sendStatus(401);

    jwt.verify(authHeader, Buffer.from(process.env.JWT_SECRET_KEY), (err, user) => {
        console.log(err);

        if (err) return res.sendStatus(403);

        req.user = user; 

        next();
    });
})

app.use("/comments", (req, res, next) => {
    const authHeader = req.header('authorization');
    console.log(authHeader);
    if (authHeader == null) return res.sendStatus(401);

    jwt.verify(authHeader, process.env.JWT_SECRET_KEY, (err, user) => {
        console.log(err);

        if (err) return res.sendStatus(403);

        req.user = user;

        next();
    },);
},)


// authentication apis
app.post("/signUp", async (req, res) => {
    console.log(req.body);
    const { name, password, email, bio } = req.body;

    try {
        const token = await auth.signUp(name, email, password, bio);
        res.json({ token });
    } catch (error) {
        console.error("Error during signUp:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

app.post("/signIn", async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    try {
        const token = await auth.signIn(email, password);
        console.log(token);
        res.json({ token });
    } catch (error) {
        console.error("Error during signIn:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

//posts handling 
app.get('/posts/getAll', async (req, res) => {
    console.log(await posts.getPosts())
    res.json(await posts.getPosts())
})

app.get("/posts/getOne", async (req, res) => {
    res.json(await posts.getPost(req.query.id))
})

app.post("/posts/create", async (req, res) => {
    res.json(await posts.addPost(req.body.title, req.body.authorId, req.body.images))
})

app.patch("/pIosts/edit", async (req, res) => {
    res.json(await posts.updatePost(req.query.id, req.body.title, req.body.content, req.body.images))
});

app.delete("/posts/delete", async (req, res) => {
    res.json(await posts.deletePost(req.query.id))
});


// handle comments
app.post("/comments/create", async (req, res) => {
    res.json(await posts.createComment(req.body.authorId, req.body.postId, req.body.content))
})

app.delete("/comments/delete", async (req, res) => {
    res.json(await posts.deleteComment(req.query.commentId))
})

app.patch("/comments/edit", async (req, res) => {
    res.json(await posts.updateComment(req.query.authorId, req.body.content))
})

app.get("/comments/getAll", async (req, res) => {
    res.json(await posts.getComments(req.query.postId))
})

app.get("/comments/subcomm/get", async (req, res) => {
    res.json(await posts.getSubComments(req.query.commentId))
})

app.post("/comments/subcomm/create", async (req, res) => {
    res.json(await posts.addSubComment(req.query.commentId, req.body.content, req.body.authorId))
})

app.patch("/comments/subcomm/edit", async (req, res) => {
    res.json(await posts.updateSubComment(req.query.commentId, req.body.content))
})

app.delete("/comments/subcomm/delete", async (req, res) => {
    res.json(await posts.removeSubComment(req.query.commentId, req.query.subCommentId))
})

// finish 
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

