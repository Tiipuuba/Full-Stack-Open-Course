const assert = require('node:assert')
const { test, after, describe, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)

})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'Testit testeinä',
        author: 'Testi Testiläinen',
        url: 'www.test.com',
        likes: 123
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    
    const contents = blogsAtEnd.map(r => r.title)
    assert(contents.includes('Testit testeinä'))
})

test('id is returned right', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(Object.keys(response.body[0]).includes('id'), true)
})

test('likes is set to 0 if not value is given', async () => {
    const testPost = {
        title: 'Testit nollina',
        author: 'Testi Testiläinen',
        url: 'www.test.com'
        }

    await api
        .post('/api/blogs')
        .send(testPost)
        .expect(201)
        .expect('Content-Type', /application\/json/)
})

describe('posts are made right', () => {

    test('without title rejected', async () => {
        const testWithoutTitle = {
            author: 'Testi Testiläinen',
            url: 'www.test.com',
            likes: 404
        }
        await api
            .post('/api/blogs')
            .send(testWithoutTitle)
            .expect(400)
        
        const blogsAtEnd = await helper.blogsInDB()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        
    })

    test('without url rejected', async () => {
        const testWithoutUrl = {
            title: 'Testit nollina',
            author: 'Testi Testiläinen',
            likes: 404
        }
        await api
            .post('/api/blogs')
            .send(testWithoutUrl)
            .expect(400)
        const blogsAtEnd = await helper.blogsInDB()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
    
    test('likes is set to 0 if not value is given', async () => {
        const testWithoutLikes = {
            title: 'Testit nollina',
            author: 'Testi Testiläinen',
            url: 'www.test.com'
        }
        await api
            .post('/api/blogs')
            .send(testWithoutLikes)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const blogsAtEnd = await helper.blogsInDB()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    })
})

test('deleting blog works'), async () => {
    const blogsAtStart = await helper.blogsInDB()
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
    
    const blogsAtEnd = await helper.blogsInDB()

    const ids = blogsAtEnd.map(b = b.id)
    assert(!ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length -1)
}

test('modification of blogs works'), async () => {
    const blogsAtStart = await helper.blogsInDB()
    const blogToMod = blogsAtStart[0]
    blogToMod.likes = 450
    await api
        .put(`/api/blogs/${blogsAtStart[0].id}`)
        .send(blogToMod)
        .expect(201)

    const blogsAtEnd = await helper.blogsInDB()
    console.log(blogsAtEnd);
    
    assert.deepStrictEqual(blogsAtEnd[0], blogToMod)
}

after(async () => {
  await mongoose.connection.close()
})