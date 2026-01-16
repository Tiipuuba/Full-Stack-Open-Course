import { useState } from 'react'

const Names = ({ persons }) => {
  return (
    <div>
      {persons.map(person => 
      <p key={person.name}>{person.name}</p>
      )}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const handleNameChange = ( event ) => {
    console.log(event.target.value);
    setNewName(event.target.value)
  }

  const addName = (event) => {

    event.preventDefault()

    const exists = persons.some((person) => person.name === newName)

    if (exists === true) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    
    const nameObject = {
      name: newName,
    }

    setPersons(persons.concat(nameObject))
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Names persons={persons} />
    </div>
  )

}

export default App