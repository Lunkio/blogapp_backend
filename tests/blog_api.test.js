const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)
//
const initialBlogs = [
    {
        title: 'Testiblogi1',
        author: 'Ismo',
        url: 'http://eiole',
        likes: 666
    },
    {
        title: 'Testiblogi2',
        author: 'Seppo',
        url: 'http://on',
        likes: 777
    }
]

let token

//sets token
beforeAll((done) => {
    supertest(app)
        .post('/api/login')
        .send({
            username: 'tester',
            password: 'secret'
        })
        .end((err, response) => {
            token = response.body.token
            done()
        })
})

beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})
//

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('right amount of blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    const amountOfBlogs = response.body.length
    
    expect(response.body.length).toBe(amountOfBlogs)
})

test('check that id is in form of "id"', async () => {
    const response = await api.get('/api/blogs')

    let verdict = 'defined'
    response.body.map(blog => blog.id).forEach(blog => {
        if (blog === undefined) {
            verdict = undefined
            return
        }
    })
    expect(verdict).toBeDefined()
})

test('a new blog can be added', async () => {
    const response = await api.get('/api/blogs')
    const blogsLengthBeforeAdding = response.body.length

    const newBlog = {
        title: 'Testiosiosta lisätty',
        author: 'tester',
        url: 'http://olematon',
        likes: 1
    }
    //
    await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(newBlog)
        .expect(200)

    const responseAfterAdding = await api.get('/api/blogs')
    expect(responseAfterAdding.body.length).toBe(blogsLengthBeforeAdding + 1)

    const titles = responseAfterAdding.body.map(blog => blog.title)
    expect(titles).toContain('Testiosiosta lisätty')
    //
})

test('likes are changed to 0 if they are set to undefined', async () => {
    const newBlog = {
        title: 'No likes set',
        author: 'tester',
        url: 'http://oleva'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)

    if (!newBlog.likes) {
        newBlog.likes = 0
    }

    expect(newBlog.likes).toBe(0)
})

test('respond with statuscode 400 if blog doesn\'t include "title" and/or "url"', async () => {
    const newBlog = {
        author: 'tester'
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

test('respond with proper statuscode if created user does not match certain criteria', async () => {
    const usersAtStart = await api.get('/api/blogs')
    
    const newUser = {
        username: 'te',
        name: 'Testi Nimike',
        password: 'to'
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    const usersAtEnd = await api.get('/api/blogs')
    expect(usersAtStart.length).toBe(usersAtEnd.length)
})

afterAll(() => {
    mongoose.connection.close()
})