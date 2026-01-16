import { useState } from 'react'

const Names = ({ persons, filter }) => {

  const matchNames = persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))
  
  return (
    <div>
      {matchNames.map(person => 
      <p key={person.name}>{person.name}</p>
      )}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const filterNames = ( event ) => {
    setFilter(event.target.value)
  }

  const handleNameChange = ( event ) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = ( event ) => {
    setNewNumber(event.target.value)
  }

  const addPerson = ( event ) => {3,

    event.preventDefault()

    const exists = persons.some((person) => person.name === newName)

    if (exists === true) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    
    const nameObject = {
      name: newName,
      number: newNumber
    }

    setPersons(persons.concat(nameObject))
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>filter shown with <input value={filter} onChange={filterNames} /></div>
      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Names persons={persons} filter={filter}/>
    </div>
  )

}

export default App