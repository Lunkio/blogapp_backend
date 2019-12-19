const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

mongoose.set('useCreateIndex', true)
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useFindAndModify: false })
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
    })

app.use(cors())
app.use(bodyParser.json())

app.use(middleware.tokenExtractor)

app.use(express.static('build'))
app.use('/users', express.static('build'))

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if(process.env.NODE_ENV === 'test') {
    const cypressRouter = require('./controllers/cypress')
    app.use('/api/testing', cypressRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app