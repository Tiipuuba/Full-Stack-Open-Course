import courses from './components/courses'

const Course = ({ courses }) => {
  return (
    <div>
      <h1>Web development curriculum</h1>
      {courses.map(course =>
      <div key={course.id}>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
      )}
    </div>
  )
}

const Header = ({ name }) => <h2>{name}</h2>

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part =>
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      )}
    </div>
  )
}

const Part = ({ name, exercises }) => <p>{name} {exercises}</p>

const Total = ({ parts }) => {
  const total = parts.reduce((s, p) =>
    s + p.exercises, 0
  );

  return <h3>total of {total} exercises</h3>
}

const App = () => {
  console.log(courses)
  return (
    <div>
      <Course courses={courses} />
    </div>
  )
}

export default App