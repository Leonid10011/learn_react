import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const list = [
  {
    title: "React",
    url: "https://reactjs.org",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: "Redux",
    url: "https://redux.js.org/",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
  {
    title: "Java",
    url: "www.oracle.com/java",
    author: "James Gosling",
    num_comments: 4,
    points: 9,
    objectID: 2,
  },
]

function App() {
  return (
    <div>
      <Search />
      <hr />
      <List a={list}/>
    </div>
  );
}

function List({a}) {
  return(
    <ul>
      {a.map(i => <Element item={i}/>
      )}
    </ul>
  );
}

function Search() {
  return(
    <div>
      <label htmlFor="search">Search</label>
      <input id="search" type="text" />
    </div>
  );
}

const Element = ({item}) => {
  return (
    <div>
      <li key={item.objectID}> 
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span> {item.author}</span>  
      <span> {item.num_comments}</span>
      <span> {item.points}</span>
      </li>
    </div>
  )
}
export default App
