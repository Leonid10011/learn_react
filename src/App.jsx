import React from "react";
import { useState } from 'react'
import './App.css'
import styled from "styled-components"

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
      <Button id="btn1" name="Click Me" handleClick={onClick}/>
      <hr />
      <Dropdown value={dropdown} onClick={setDropdown}/>
      <hr />
      <Slider></Slider>
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

const Button = ({id, name, handleClick, ...rest}) => {
  return(
    <>
      <button type="button" id={id} onClick={handleClick}>{name}</button>
    </>
  )
}

const RadioButton = ({label, value, onChange}) => {
  return(
    <>
      <input type="radio" value={value} onChange={onChange} />
      {label}
    </>
  );
}

const CheckButton = ({label, value, onChange}) => {
  return(
    <>
      <input type="checkbox" value={value} onChange={onChange}/>
      {label}
    </>
  );
}

const Dropdown = ({value, onClick}) => {
  const handleClick = (event) => {
    onClick(!value);
  }

  return(
    <>
    <button onClick={handleClick}>Dropdown</button>
      {value ? (
      <ul className="menu">
        <li className="menu-item">
          <button>Menu 1</button>
        </li>
        <li className="menu-item">
          <button>Menu 2</button>
        </li>
      </ul>
      ) : null}
      {value ? <div>Is Open</div> : <div>Is Closed</div>}
    </>
  );
}

const StyleSlider = styled.div`
  position: relative;
  border-radius: 3px;
  background: #dddddd;
  height: 15px;
`;

const SliderThumb = styled.div`
  width: 10px;
  height: 25px;
  border-radius: 3px;
  position: relative;
  top: -5px;
  opacity: 0.5;
  background: #823eb7;
  cursor: pointer;
`;

const getPercentage = (current, max) => (100*current) / max;

const getLeft = percentage => `calc(${percentage}% - 5px)`;

const Slider = () => {
  const sliderRef = React.useRef()
  const thumbRef = React.useRef()

  const diff = React.useRef();

  const handleMouseMove = event => {
    let newX = 
      event.clientX -
      diff.current -
      sliderRef.current.getBoundingClientRect().left;

      const end =  sliderRef.current.offsetWidth - thumbRef.current.offsetWidth;

      const start = 0;

      if(newX < start){
        newX = 0;
      }

      if(newX > end){
        newX = end;
      }

      const newPercentage = getPercentage(newX, end);
      thumbRef.current.style.left = getLeft(newPercentage);
  }

  const handleMouseUp = () => {
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("mousemove", handleMouseMove);
  }

  const handleMouseDown = event => {
    diff.current = 
      event.clientX - thumbRef.current.getBoundingClientRect().left;
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  return(
    <>
      <StyleSlider ref={sliderRef}>
        <SliderThumb ref={thumbRef} onMouseDown={handleMouseDown}/>
      </StyleSlider>
    </>
  );
}




export default App
