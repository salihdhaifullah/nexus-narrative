import { Props } from '..'

interface Person {
  name: string
  age: number
}

function App(props: Props<Person>) {
  return (
    <div>
      <h1 className='text-4xl'>home page</h1>
      <code>{JSON.stringify(props)}</code>
    </div>
  )
}

export default App
