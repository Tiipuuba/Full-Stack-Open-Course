import { useState } from 'react'
import { useEffect } from 'react'
import contactService from './services/contacts.js'
import Notification from './services/notification.jsx'

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
      <p key={person.name}>{person.name} <button  onClick={() => onClick(person.id, person.name)}>delete</button></p>
      )}
    </div>
  )

}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState('')

  useEffect(() => {
    getContacts()
  }, [])

  const doNotification = (props) => {

    setNotificationMessage(props)
    setTimeout(() => {
      setNotificationMessage('')
      setNotificationType('')
    }, 5000)    
  }

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

    const findPerson = persons.find(person => person.name === newName)

    if ( findPerson !== undefined) {
      const confirmChange = confirm(`${findPerson.name} is already added to phonebook, replace the old number with a new one?`)

      if (confirmChange === true) {
        const updatedContactInfo = {
          id: findPerson.id,
          name: findPerson.name,
          number: newNumber
        }
        contactService
          .update(findPerson.id, updatedContactInfo)
          .then(response => {
            setNewName('')
            setNewNumber('')
          })
        setNotificationType('success')
        doNotification(`Replaced ${findPerson.name}'s number`)
        getContacts()
        return
      } else { return }
    }

    
    const nameObject = {
      name: newName,
      number: newNumber
    }
    setNotificationType('success')
    doNotification(`Added ${newName}`)
    contactService
      .create(nameObject)
      .then(response => {
        setPersons(persons.concat(response))
        setNewName('')
        setNewNumber('')
      })
    getContacts()
  }

  const removeContact = (id, name) => {
    
    const confirmRemoval = confirm(`Delete ${name}?`)
    if (confirmRemoval === true) {
      contactService
        .remove(id)
        .then(response => {
          setNotificationType('success')
          doNotification(`Removed ${name}`)
          getContacts()
        })
        .catch(error => {
          setNotificationType('error')
          doNotification(`Information of ${name} has already been removed from server`)
        })
    }

  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} onChange={filterNames} />
      <h2>add a new</h2>
      <Notification message={notificationMessage} type={notificationType}/>
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