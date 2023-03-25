import React from "react";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const style = {
  padding: "10px 30px",
  border: "1px solid black",
}

const App = () => {
  console.log("App");

  const [searchTerm, setSearchterm] = React.useState("React");

  const stories = [
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

  const filterList = (s,st) => {
    /**
     * s := list of objects (stories)
     * st := searchTerm
     */
    console.log("filterList");
    // check if title inlcudes the searchterm
    return (s.filter(s => s.title.toLowerCase().includes(st.trim().toLowerCase())));
  }

  return (
    <div>
      <Search callbackFunction = {setSearchterm} text={searchTerm}/>
      <hr />
      <List a={filterList(stories, searchTerm)}/>
    </div>
  );
}

const List = (props) => {
  console.log("List");
  return(
    <ul>
      {props.a.map(({objectID, ...item}) => <Element key={objectID} {...item}/>)}
    </ul>
  );
}

const Search = ({callbackFunction, text}) => {

  const handleChange = event => {
    // A synthetic event
    callbackFunction(event.target.value);
    
  };


  console.log("Search");
  return(
    <div>
      <label htmlFor="search">Search</label>
      <input id="search" type="text" onChange={handleChange} value={text}/>
      <p>
        Searching for <strong>{text}</strong>.
      </p>
    </div>
  );
}

const Element = ({title, url, author, num_comments, points}) => {
  console.log("Element");
  return (
    <div>
      <li> 
      <span>
        <a href={url}>{title}</a>
      </span>
      <span> {author}</span>  
      <span> {num_comments}</span>
      <span> {points}</span>
      </li>
    </div>
  )
}


export default App
