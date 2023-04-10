import React from "react";
import axios from "axios";
import './App.css'

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query="

type Story = {
  objectID: string;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
};

type StoriesState = {
  data: Stories,
  isLoading: Boolean,
  isError: Boolean,
}

type StoriesFetchInitAction = {
  type: "STORIES_FETCH_INIT",
}

type StoriesFetchSuccessAction = {
  type :"STORIES_FETCH_SUCCESS";
  payload: Stories;
}

type StoriesFetchFailureAction = {
  type: "STORIES_FETCH_FAILURE";
}

type StoriesRemoveStoryAction = {
  type: "REMOVE_STORY";
  payload: Story;
}

type StoriesAction = 
  StoriesFetchInitAction  
  | StoriesFetchSuccessAction 
  | StoriesFetchFailureAction 
  | StoriesRemoveStoryAction;

type ElementProps = {
  item: Story,
  onRemoveItem: (item: Story) => void,
}
const storiesReducer = (state: StoriesState, action: StoriesAction) => {
  switch(action.type){ 
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (story: Story) => story.objectID !== action.payload.objectID
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

const useStorageState = (
  key: string, 
  initialState: string
  ): [string, (newValue: string) => void] => {
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

  const getHackerStories = React.useCallback(async () => {
    dispatchStories({type: "STORIES_FETCH_INIT"});

    try {
      const result = await axios.get(url)
  
      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits,
      });
    } catch {
        dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [url]);

  React.useEffect(() => {
    getHackerStories();
  }, [getHackerStories]);

  const handleRemoveStory = (item: Story) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  };
  
  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchterm(event.target.value);
  }

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  }

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <SearchForm  
        searchTerm={searchTerm}
        handleSearchInput={handleSearchInput}
        handleSearchSubmit={handleSearchSubmit}
      />
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
      </div>
  );
}

type SearchFormProps = {
  searchTerm: string,
  handleSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  handleSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

const SearchForm: React.FC<SearchFormProps> = ({
  searchTerm,
  handleSearchSubmit,
  handleSearchInput
}) => {
    return(
      <>
        <form onSubmit={handleSearchSubmit}>
          <InputWithLabel 
            id="search" 
            onInputChange = {handleSearchInput} 
            isFocused
            value={searchTerm}
            >
            <strong>Search:</strong>
          </InputWithLabel>
          <button 
            type="submit"
            style={{background: "green", margin: "0px 5px"}} 
            disabled={!searchTerm} 
          >
            Search
          </button>
        </form>
      </>
    );
};

type Stories = Story[];

type ListProps = {
  list: Stories,
  onRemoveItem: (item: Story) => void,
}

const List: React.FC<ListProps> = ({list, onRemoveItem}) => {

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

type InputWithLabelProps = {
  id: string,
  type?: string,
  value: string,
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  isFocused?: Boolean,
  children: React.ReactNode,
}

const InputWithLabel: React.FC<InputWithLabelProps> = ({
  id, 
  type = "text", 
  value, 
  onInputChange, 
  isFocused,
  children,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

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

const Element: React.FC<ElementProps> = ({item, onRemoveItem}) => {
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
