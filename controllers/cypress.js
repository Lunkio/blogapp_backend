const cypressRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

cypressRouter.post('/reset', async (req, res) => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    res.status(204).end()
})

module.exports = cypressRouter