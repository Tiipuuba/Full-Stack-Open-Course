const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    response.json(blog)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    if (Object.keys(body).includes('title') === false || Object.keys(body).includes('url') === false) {
        return response.status(400).end()
    }

    const blog = new Blog ({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    })
    
    if (Object.keys(body).includes('likes') === false) {
        blog.likes = 0
    }

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})


blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body)
    response.status(201).json(updatedBlog)
})

module.exports = blogsRouter