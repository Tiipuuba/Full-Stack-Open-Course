require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const Contact = require('./models/contact')

const app = express()
app.use(express.static('dist'))

morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')  
})

morgan.token('data', function getData(req) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(express.json())

app.get('/info', (request, response) => {
    return response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
    Contact.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/persons/:id', function (request, response) {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        return response.json(person)
    } else {
        return response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const person = request.body

    if (person.name === undefined || person.number === undefined) {
        return response.status(400).json({ error: 'missing name or number' })
    }

    let exists = false

    {persons.map(p =>
        p.name === person.name
        ? exists = true
        : null
    )}
  
    if (exists === true) {
        return response.status(400).json({
            error: 'name must be unique'
        })
        }

    const id = Math.floor(Math.random() * 10000)
    person.id = String(id)

    persons = persons.concat(person)

    return response.json(person)
  
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter((person => person.id !== id))

    return response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})