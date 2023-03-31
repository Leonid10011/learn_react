import React from "react";
import { useState } from 'react'
import './App.css'

const style = {
  padding: "10px 30px",
  border: "1px solid black",
}

// Custom hook
const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(
    // ?? evaluates "" not to false
    localStorage.getItem(key) ?? initialState
  );

  //Evertime searchTerm changes, trigger the callback
  React.useEffect(() => {
    localStorage.setItem(key, value)
  }, [value, key]);

  return [value, setValue];
}

const App = () => {
  const [searchTerm, setSearchterm] = useStorageState("search", "React");
  const [dropdown, setDropdown] = useState(true);
  
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
    // check if title inlcudes the searchterm
    return (s.filter(s => s.title.toLowerCase().includes(st.trim().toLowerCase())));
  }

  const onClick = () => {
    console.log("CLICK");
  }

  return (
    <div>
      <InputWithLabel 
        id="search" 
        onInputChange = {setSearchterm} 
        isFocused
        text={searchTerm}
      >
        <strong>Search:</strong>
      </InputWithLabel>
      <hr />
      <List a={filterList(stories, searchTerm)}/>
      <hr />
    </div>
  );
}


const List = (props) => {
  return(
    <ul>
      {props.a.map(({objectID, ...item}) => <Element key={objectID} {...item}/>)}
    </ul>
  );
}

const InputWithLabel = ({
  id, 
  type = "text", 
  value, 
  onInputChange, 
  isFocused,
  children,
}) => {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if(isFocused && inputRef.current){
      console.log("FOCUS");
      inputRef.current.focus();
    }
  }, [isFocused]);

  const handleChange = event => {
    // A synthetic event
    onInputChange(event.target.value);
  };

  return(
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input  
        ref={inputRef}
        id={id} 
        type={type} 
        onChange={handleChange} 
        value={value}/>
    </>
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
