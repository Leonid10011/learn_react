import React from "react";
import './App.css'

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query="

const setStories_ = "SET_STORIES";
const removeStory_ = "REMOVE_STORY"
// Custom hook
const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(
    // ?? evaluates "" not to false
    localStorage.getItem(key) ?? initialState
  )

  //Evertime searchTerm changes, trigger the callback
  React.useEffect(() => {
    localStorage.setItem(key, value)
  }, [value, key]);

  return [value, setValue];
}

const App = () => {
  const [searchTerm, setSearchterm] = useStorageState("search", "React");
   
  const getHackerStories = React.useCallback(() => {
    dispatchStories({type: "STORIES_FETCH_INIT"});
    if(searchTerm === "") return;

    window.fetch(`${API_ENDPOINT}${searchTerm}`)
      .then(response => response.json())
      .then(result => {
        dispatchStories({
          type: "STORIES_FETCH_SUCCESS",
          payload: result.hits,
        });
      })
      .catch(() => {
        dispatchStories({type: "STORIES_FETCH_FAILURE"});
      });
  }, [searchTerm]);

  const storiesReducer = (state, action) => {
    switch(action.type){
      case "REMOVE_STORY":
        return {
          ...state,
          data: state.data.filter(
            (story) => story.objectID !== action.payload
          ),
          }
      case "STORIES_FETCH_INIT":
          return {
            ...state,
            isLoading:true,
            isError:false,
          };
      case "STORIES_FETCH_SUCCESS":
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        };
      case "STORIES_FETCH_FAILURE":
        return {
          ...state,
          isLoading: false,
          isError: true,
        };
      default:
        throw new Error();
    }
  };

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    {data: [], isLoading: false, isError: false}
  );  


  React.useEffect(() => {
    getHackerStories();
  }, [getHackerStories]);

  const deleteStoryByKey = (key) => {
    dispatchStories({
      type: removeStory_,
      payload: key,
    });
  };

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
      { stories.isError && <p> Something went wrong ... </p>}
      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : 
      <List 
        a={stories.data} 
        liftObjectID={deleteStoryByKey}
        />
      }
      <hr />
    </div>
  );
}


const List = (props) => {
  const handleListDelete = (key) => {
    props.liftObjectID(key);
  }

  return(
    <ul>
      {props.a.map(({objectID, ...item}) => <Element key={objectID} dataKey={objectID} onDelete={handleListDelete} {...item}/>)}
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

const Element = ({dataKey, onDelete, title, url, author, num_comments, points}) => {

  return (
    <div>
      <li style={{border: "3px solid black", borderRadius: "2px", margin: "5px", padding: "2px"}}> 
      <span>
        <a href={url}>{title}</a>
      </span>
      <span> {author}</span>  
      <span> {num_comments}</span>
      <span> {points}</span>
      <span>
        <button 
          style={{background: "red", margin: "0px 5px"}}
          onClick={onDelete.bind(null, dataKey)}
          >
            Delete
        </button>
      </span>
      </li>
    </div>
  )
}



export default App
