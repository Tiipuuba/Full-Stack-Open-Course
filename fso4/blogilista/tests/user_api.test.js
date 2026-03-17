const assert = require('node:assert')
const { test, after, describe, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
})

test('users are returned as json', async () => {
    await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('a valid user can be added', async () => {
    const newUser = {
        username: 'Testix',
        name: 'Testi Testiläinen',
        password: 'Jotain'
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDB()
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1)
    
    const contents = usersAtEnd.map(r => r.username)
    assert(contents.includes('Testix'))
})

describe('users are made right', () => {

    test('without username rejected', async () => {
        const testWithoutTitle = {
            name: 'Testi Testiläinen',
            password: 'Jotain'
        }
        await api
            .post('/api/users')
            .send(testWithoutTitle)
            .expect(400)
        const usersAtEnd = await helper.usersInDB()
        assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
        
    })

    test('without password rejected', async () => {
        const testWithoutPassword = {
            username: 'Testix',
            name: 'Testi Testiläinen'
        }
        await api
            .post('/api/users')
            .send(testWithoutPassword)
            .expect(400)
        const usersAtEnd = await helper.usersInDB()
        assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
    })

    test('too short password rejected', async () => {
        const testWithoutPassword = {
            username: 'Testix',
            name: 'Testi Testiläinen',
            password: 'ly'
        }
        await api
            .post('/api/users')
            .send(testWithoutPassword)
            .expect(400)
        const usersAtEnd = await helper.usersInDB()
        assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
    })

    test('too short username rejected', async () => {
        const testWithoutPassword = {
            username: 'Te',
            name: 'Testi Testiläinen',
            password: 'lyllylly'
        }
        await api
            .post('/api/users')
            .send(testWithoutPassword)
            .expect(400)
        const usersAtEnd = await helper.usersInDB()
        assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
    })
})

after(async () => {
  await mongoose.connection.close()
})