import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'

const Countries = ({ countries }) => {
  console.log(countries);
  

  if (countries.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  } else if (countries.length > 1) {
    return (
      <div>
        {countries.map(country =>
          <p>{country.name.common}</p>
        )}
      </div>
    )
  } else if (countries.length === 1){
    return (
      <div>
        <h1>{countries[0].name.common}</h1>
        <p>Capital {countries[0].capital}</p>
        <h1>Languages</h1>
        <ul>
          {Object.entries(countries[0].languages).map(([code, name]) => (
            <li key={code}>{name}</li>
          ))}
        </ul>
        <img src={countries[0].flags.png}  />
      </div>
    )
  }
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data.filter((country) => country.name.common.toLowerCase().includes(filter.toLowerCase())))
      })
  }, [filter])

  const addFilter = ( event ) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <p>find countries <input value={filter} onChange={addFilter}/></p>
      <Countries countries={countries} />
    </div>
  )

}

export default App