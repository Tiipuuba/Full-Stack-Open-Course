require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const Contact = require('./models/contact')

const app = express()

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

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/info', (request, response) => {
    Contact.find({}).then(contacts => {
        return response.send(`<p>Phonebook has info for ${contacts.length} people</p><p>${Date()}</p>`)
    })
    
})

app.get('/api/contacts', (request, response) => {
    Contact.find({}).then(contacts => {
        response.json(contacts)
    })
})

app.get('/api/contacts/:id', (request, response, next) => {
    Contact.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.post('/api/contacts', (request, response) => {
    if (request.body.name === undefined || request.body.number === undefined) {
        return response.status(400).json({ error: 'missing name or number' })
    }
    const contact = new Contact({
        name: request.body.name,
        number: request.body.number
    })

    contact.save().then(result => {
        response.json(result)
    })
})

app.put('/api/contacts/:id', (request, response, next) => {
    const { name, number } = request.body

    Contact.findById(request.params.id)
        .then(contact => {
            if (!contact) {
                return response.status(404).end()
            }

            contact.name = name
            contact.number = number

            return contact.save().then((updatedContact) => {
                response.json(updatedContact)
            })
        })
        .catch(error => next(error))
})

app.delete('/api/contacts/:id', (request, response, next) => {
    Contact.findByIdAndDelete(request.params.id)
        .then (result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})