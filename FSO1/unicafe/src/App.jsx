import { useState } from 'react'

const Button = ({good, neutral, bad}) => {
  return (
    <>
      <button onClick={good} >good</button>
      <button onClick={neutral} >neutral</button>
      <button onClick={bad} >bad</button>
    </>
  )
}

const Statistics = ({good, neutral, bad}) => {
  if (good === 0 && neutral === 0 && bad === 0) {
    return <p>No feedback given</p>
  }
  return (
    <table>
      <tbody>
          <StatisticsLine text="good" value={good}/>
          <StatisticsLine text="neutral" value={neutral}/>
          <StatisticsLine text="bad" value={bad}/>
          <StatisticsLine text="average" value={(good - bad)/(good + bad + neutral)}/>
          <StatisticsLine text="positive" value={(good)/(good + bad + neutral)}/>
      </tbody>
    </table>
  )
}

const StatisticsLine = ({text, value}) => {
  let posvalue = value

  if (text === "positive") {
    if (value === 1) {
        posvalue = "100%"
    } else if (value <= 0) {
      posvalue = "0%"
    } else {
        posvalue = value * 100 + "%"
    }
  }
  
  return (
    <tr>
      <td>{text}</td>
      <td>{posvalue}</td>
    </tr>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button good={() => setGood(good + 1)} neutral={() => setNeutral(neutral + 1)} bad={() => setBad(bad + 1)}  />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App