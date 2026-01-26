const express = require('express')
const app = express()

app.use(express.json())

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456"
  },
    {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
    {
    id: "3",
    name: "Dan Abravmov",
    number: "12-43-234234"
  },
    {
    id: "4",
    name: "Mary Poppendieck",
    number: "0502671224"
  },

]

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
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

  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})