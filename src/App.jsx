import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


function App() {
  const title = "React";
  const welcome = {
    title: "React",
    greeting: "Hey"
  }

  function getTitle(title){
    return title;
  }

  const myList = [1,"8",2,3,4];

  return (
    <div>
      <h1>Hello World</h1>
      <ul>
        {myList.map(i => <li> {i} </li>)}
      </ul> 
      <label htmlFor="search">Search</label>
      <input id="search" type="text" />
    </div>
  )
}

export default App
