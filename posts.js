const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()
// done
async function addPost(title, content, authorId, images) {
    return await prisma.post.create(
        {
            data: {
                title: title,
                content: content,
                authorId: authorId,
                images: images
            }
        }
    )
}

// done
async function getPosts() {
    let toShare = []
    const posts = await prisma.post.findMany({});
    console.log(posts)
    for (let i = 0; i < posts.length; i++) {
        const { id, authorId, title, content } = posts[i]
        toShare.push({
            id,
            authorId,
            title,
            content
        })
    }
    return toShare
}

// done
async function getPost(id) {
    const post = await prisma.post.findOne({ id: id });
    return post
}

async function deletePost(id) {
    await prisma.post.delete({ id: id })
}

// done
async function updatePost(id, title, content,images) {
    await prisma.post.update({
        where: { id: id },
        data: {
            title: title,
            content: content,
            images: images
        }
    })
}

//comments 
async function getComments(postId) {
    let toShare = []
    const comments = await prisma.comment.findMany({ where: { postId: postId } });

    for (let i = 0; i < comments.length; i++) {
        const { id, authorId, postId, content } = comments[i]
        toShare.push({
            id,
            authorId,
            postId,
            content
        })
    }
    return toShare
}


async function createComment(authorId, postId, content) {
    return await prisma.comment.create({
        data: {
            authorId: authorId,
            postId: postId,
            content: content
        }
    })
}

async function deleteComment(commentId) {
    return await prisma.comment.delete({ id: commentId })
}

async function updateComment(authorId, content) {
    return await prisma.comment.update({
        where: { authorId: authorId },
        data: {
            content: content
        }
    })
}

async function getSubComments(commentId) {
    return await prisma.subComment.findMany({ commentId: commentId })
}

async function addSubComment(commentId, content, authorId) {
    return await prisma.subComment.create({
        data: {
            commentId: commentId,
            authorId: authorId,
            content: content
        }
    })
}

async function removeSubComment(id) { return await prisma.subComment.delete({ where: { id: id } }) }

async function updateSubComment(id, content) {
    return await prisma.subComment.update(
        {
            where: { id: id, content },
            data: {
                content: content
            },
        }
    )
}
module.exports = { addPost, getPost, getPosts, deletePost, updatePost, getComments, createComment, deleteComment, updateComment, getSubComments, addSubComment, removeSubComment, updateSubComment }