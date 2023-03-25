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
  // Test Event Bubbeling
  const handelOuterClick = () => {
    alert("Outer Click");
  }

  const handleInnerClick = () => {
    alert("Inner Click");
  }

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

  return (
    <div>
      <Welcome/>
      <div style={style} onClick={handelOuterClick}>
        <div style={style} onClick={handleInnerClick}>
          CLick Me ( Test Bubbeling)
        </div>
      </div>

      <Search />
      <hr />
      <List a={stories}/>
    </div>
  );
}

const Welcome = ({ title }) => {
  title = title || "Earth";
  
  return (
    <div>
      <Title title={`Welcome to ${title}`}/>
    </div>
  );
};

const Title = ({title}) => {
  return (
    <h1>{title}</h1>
  );
};

const List = (props) => {
  console.log("List");
  return(
    <ul>
      {props.a.map(i => <Element key={i.objectID} item={i}/>)}
    </ul>
  );
}

const Search = () => {
  const [text, setText] = React.useState("");
  console.log("Search");
  const handleChange = event => {
    // A synthetic event
    console.log(event);
    setText(event.target.value);
    console.log(text);
  };

  return(
    <div>
      <label htmlFor="search">Search</label>
      <input id="search" type="text" onChange={handleChange} />
    </div>
  );
}

const Element = (props) => {
  console.log("Element");
  return (
    <div>
      <li key={props.item.objectID}> 
      <span>
        <a href={props.item.url}>{props.item.title}</a>
      </span>
      <span> {props.item.author}</span>  
      <span> {props.item.num_comments}</span>
      <span> {props.item.points}</span>
      </li>
    </div>
  )
}


export default App
