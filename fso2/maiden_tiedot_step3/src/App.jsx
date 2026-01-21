import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'

const Countries = ({ countries, onClick, getWeather }) => {
  if (countries.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  } else if (countries.length > 1) {
    return (
      <div>
        {countries.map(country => 
          <p key={country.name.common}>{country.name.common} <button type="button" onClick={() => onClick(country.name.common)}>Show</button></p>
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

const Weather = ({ weatherData, countries }) => {
  
  if (weatherData === null || countries.length > 1 || countries.length === 0) {
    return
  }
  
  return (
    <div>
      <h1>Weather in {countries[0].capital}</h1>
      <p>Temperature {(weatherData.main["temp"]-273.15).toFixed(1)} Celsius</p>
      <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0]["icon"]}@2x.png`} alt="" />
      <p>Wind {weatherData.wind["speed"]} m/s</p>
    </div>
  )

  
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [weatherData, setWeatherData] = useState(null)

  const api_key = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data.filter((country) => country.name.common.toLowerCase().includes(filter.toLowerCase())))
      })
    }, [filter])

  useEffect(() => {
    if (countries.length === 1) {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${countries[0].capital}&appid=${api_key}`)
        .then(response => {
          setWeatherData(response.data)
        })
      }
    }, [countries])

  const addFilter = ( event ) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <p>find countries <input value={filter} onChange={addFilter} /></p>
      <Countries countries={countries} onClick={setFilter} />
      <Weather weatherData={weatherData} countries={countries}/>
    </div>
  )

}

export default App