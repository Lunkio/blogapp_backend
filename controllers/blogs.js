const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs.map(blog => blog.toJSON()))
})
  
blogsRouter.post('/', async (request, response, next) => {
    const body = request.body
    if (body.title === undefined || body.url === undefined) {
        return response.status(400).json({ error: 'title and/or url missing' })
    }

    try {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!request.token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        const user = await User.findById(decodedToken.id)

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: user._id,
            comments: body.comments
        })

        if (!blog.likes) {
            blog.likes = 0
        }

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.json(savedBlog.toJSON())

    } catch(exception) {
        next(exception)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        const blog = await Blog.findById(request.params.id)

        const decodedToken = jwt.verify(request.token, process.env.SECRET)

        const user = await User.findById(decodedToken.id)

        if (blog.user.toString() === user.id.toString()) {
            await Blog.findByIdAndRemove(request.params.id)
            response.status(204).end()
        } else {
            return response.status(401).json({ error: 'only the user who added the blog can delete it' })
        }
    } catch (exception) {
        next(exception)
    }    
})

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body
    
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        comments: body.comments
    }

    try {
        const modifiedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
            .populate('user', { username: 1, name: 1 })
        response.json(modifiedBlog.toJSON())
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.post('/:id/comments', async (request, response) => {
    const { comment } = request.body
  
    const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
  
    if (!blog.comments) {
        blog.comments = []
    }
  
    blog.comments = blog.comments.concat(comment)
  
    await blog.save()
  
    response.json(blog.toJSON())
  })

module.exports = blogsRouter