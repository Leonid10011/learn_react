import React from "react";
import axios from "axios";
import './App.css'

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query="

const storiesReducer = (state, action) => {
  switch(action.type){
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (story) => story.objectID !== action.payload.objectID
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
  const [searchTerm, setSearchterm] = useStorageState(
    "search",
     "React"
  );
  
  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  );

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    {data: [], isLoading: false, isError: false}
  );  

  const getHackerStories = React.useCallback(() => {
    dispatchStories({type: "STORIES_FETCH_INIT"});

    axios
      .get(url)
      .then(result => {
        dispatchStories({
          type: "STORIES_FETCH_SUCCESS",
          payload: result.data.hits,
        });
      })
      .catch(() => {
        dispatchStories({type: "STORIES_FETCH_FAILURE"});
      });
  }, [url]);

  React.useEffect(() => {
    getHackerStories();
  }, [getHackerStories]);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  };
  
  const handleSearchInput = event => {
    setSearchterm(event.target.value);
  }

  const handelSubmitTerm = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`)
  }

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel 
        id="search" 
        onInputChange = {handleSearchInput} 
        isFocused
        value={searchTerm}
      >
        <strong>Search:</strong>
      </InputWithLabel>
      <button 
        type="button"
        style={{background: "green", margin: "0px 5px"}} 
        disabled={!searchTerm} 
        onClick={handelSubmitTerm}
      >
        Search
      </button>
      <hr />
      { stories.isError && <p> Something went wrong ... </p>}
      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : 
      <List 
        list={stories.data} 
        onRemoveItem={handleRemoveStory}
        />
      }
      <hr />
    </div>
  );
}


const List = ({list, onRemoveItem}) => {

  return(
    <ul>
      {list.map((item) => 
        <Element 
          key={item.objectID} 
          onRemoveItem={onRemoveItem} 
          item={item}
        />
        )}
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
      inputRef.current.focus();
    }
  }, [isFocused]);

  return(
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input  
        ref={inputRef}
        id={id} 
        type={type} 
        onChange={onInputChange} 
        value={value}/>
    </>
  );
}

const Element = ({item, onRemoveItem}) => {

  return (
    <div>
      <li style={{border: "3px solid black", borderRadius: "2px", margin: "5px", padding: "2px"}}> 
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span> {item.author}</span>  
      <span> {item.num_comments}</span>
      <span> {item.points}</span>
      <span>
        <button 
          style={{background: "red", margin: "0px 5px"}}
          onClick={() => {onRemoveItem(item)}}
          >
            Delete
        </button>
      </span>
      </li>
    </div>
  )
}

export default App
