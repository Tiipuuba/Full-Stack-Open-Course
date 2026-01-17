import { useState } from 'react'
import { useEffect } from 'react'
import contactService from './services/contacts.js'

const Filter = ({ value, onChange }) => {
  return <div>filter shown with <input value={value} onChange={onChange} /></div>
}

const PersonForm = ({ onSubmit, nameValue, numberValue, onChangeName, onChangeNumber }) => {

  return (
    <form onSubmit={onSubmit}>
      <div>name: <input value={nameValue} onChange={onChangeName} /></div>
      <div>number: <input value={numberValue} onChange={onChangeNumber} /></div>
      <div><button type="submit">add</button></div>
    </form>
  )

}

const Persons = ({ persons, filter, onClick }) => {

  const matchNames = persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))
  
  return (
    <div>
      {matchNames.map(person => 
      <p key={person.name}>{person.name} <button  onClick={() => onClick(person.id)}>delete</button></p>
      )}
    </div>
  )

}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    getContacts()
  }, [])

  const getContacts = () => {
    contactService
      .getAll()
      .then(response => {
        setPersons(response)
      })
  }

  const filterNames = ( event ) => {
    setFilter(event.target.value)
  }

  const handleNameChange = ( event ) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = ( event ) => {
    setNewNumber(event.target.value)
  }

  const addPerson = ( event ) => {

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

    contactService
      .create(nameObject)
      .then(response => {
        setPersons(persons.concat(response))
        setNewName('')
        setNewNumber('')
      })
  }

  const removeContact = (id) => {

    const findPerson = persons.find(person => person.id === id)
    
    const confirmRemoval = confirm(`Delete ${findPerson.name}?`)
    if (confirmRemoval === true) {
      contactService
        .remove(id)
        .then(getContacts())
    }

  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} onChange={filterNames} />
      <h2>add a new</h2>
      <PersonForm 
        onSubmit={addPerson}
        nameValue={newName}
        numberValue={newNumber}
        onChangeName={handleNameChange}
        onChangeNumber={handleNumberChange}
        />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} onClick={removeContact}/>
    </div>
  )

}

export default App