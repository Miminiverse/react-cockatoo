
import { useEffect, useReducer, useState } from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import TodoList from './components/TodoList'
import AddTodoForm from './components/AddTodoForm'
import SpeechText from './components/SpeechText'
import Search from './components/Search'
import Pagination from './components/Pagination'
import ThemeToggle   from './ThemeToggle'
import ThemeContext from './ThemeContext'
import styles from './static/App.module.css'
import "./index.css";
import paths from './paths'


function App() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [sortTitle, setSortTitle] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [todoPerPage] = useState(10)

  function toggleTheme () {
    setIsDarkMode((prevIsDarkMode) => !prevIsDarkMode)
  }
  


  const defaultHeaders = {
    Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
  }
  const stateManagementFunction = (previousState, action) => {
    switch (action.type) {
      case 'START_LOADING_TITLES':
        return {
          ...previousState,
          isLoading: true,
        }
      case 'FINISH_LOADING_TITLES':
        return {
          ...previousState,
          isLoading: false,
          todoList: action.payload.todoList
        }
      case 'SORT_TITLES_AZ':
        return {
            ...previousState,
            isLoading: false,
            todoList: previousState.todoList.sort((a,b)=> a.title.localeCompare(b.title))
          }

      case 'SORT_TITLES_ZA':
        return {
              ...previousState,
              isLoading: false,
              todoList: previousState.todoList.sort((a,b)=> b.title.localeCompare(a.title))
            }          
      case 'SET_SEARCH_TEXT':
        return {
          ...previousState,
          searchText: action.payload.searchText
        }
      case 'ERROR_LOADING_TITLES':
        return {
          ...previousState,
          isLoading: false,
          isError: true,
        }
      case 'ADD_TODO':
        return {
          ...previousState,
          todoList: [...previousState.todoList, action.payload.newTodo]
        }
      case 'EDIT_TODO':
        return {
          ...previousState,
          todoList: 
          previousState.todoList.map((todo) => {
            if (todo.id === action.payload.editTodo.id) {
              todo.title = action.payload.editTodo.title
            }
            return todo
          }) 
        }
      case 'REMOVE_TODO':
        return {
          ...previousState,
          todoList: previousState.todoList.filter((todo) => todo.id !== action.payload.id)
        }
      default:
        throw new Error();
    }
  }

  const initialState = {
    todoList: [],
    isLoading: true,
    isError: false,
    searchText: "",
    sortTitle: false,

  }




  const [state, dispatchTitle] = useReducer(stateManagementFunction, initialState)

  const url = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/${process.env.REACT_APP_TABLE_NAME}`


  const refreshRecords = () => {
    dispatchTitle({
      type: 'START_LOADING_TITLES'
    })
    fetchData({
      searchText : state.searchText, 
    })
      .then(loadedTodos => {
      dispatchTitle({
        type: 'FINISH_LOADING_TITLES',
        payload: {
          todoList: loadedTodos
        }
      })
    })
  }

  console.log(state.todoList);

  const handleResponse = async (response) => {
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    const data = await response.json()
    const todos = data.records.map((todo) => {
      console.log(todo.createdTime);
      return {
        createdTime: todo.createdTime,
        title: todo.fields.title,
        id: todo.id
      }
    })


    return todos
  }


  const fetchData = async options => {

    try {
      let params = {}
      if (options?.searchText) {
        params = {
          ...params, 
          filterByFormula: `SEARCH('${options.searchText.toLowerCase()}', {title})`,
        };
      }



      // if (sortTitle === false) {
      //   params = {
      //     ...params, 
      //     'sort[0][field]': 'title',
      //     'sort[0][direction]': 'asc',
      //   }
      // } else {
      //   params = {
      //     ...params, 
      //     'sort[0][field]': 'title',
      //     'sort[0][direction]': 'desc',
      //   }
      // }
      

      
      const response = await fetch (url + "?" + new URLSearchParams(params), 
      {
        headers: { ...defaultHeaders },
        method: "GET",
      }
      )

      return handleResponse(response)

    } catch (error) {
      dispatchTitle({
        type: 'ERROR_LOADING_TITLES'
    })
  }
}

  useEffect(() => {
    refreshRecords()
  }, [state.searchText])


  const addTodo = (newTodo) => {
    console.log(newTodo);
    fetch (url, {
      method: 'POST',
      headers: {  
        ...defaultHeaders,
        'Content-Type': 'application/json',
        
    },
      body: JSON.stringify({fields: newTodo})
    }
    )
    .then (response => response.json())
    .then (data => { 
      const addTodo = 
       {
        title: data.fields.title,
        id: data.id
      }
      dispatchTitle({
        type: "ADD_TODO",
        payload: {
          newTodo: addTodo 
        }
    })
    })
  }


  const removeTodo = async (todo) => {

    const urlDel = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/${process.env.REACT_APP_TABLE_NAME}/${todo.id}`
    const options ={
      method: 'DELETE',
      headers: {
        ...defaultHeaders,
    }
  }  
  try {
    
    const response = await fetch (urlDel, options)
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    dispatchTitle({
      type: "REMOVE_TODO",
      payload: {
        id: todo.id
      }
  })}
  catch (error) {
    dispatchTitle({
      type: 'ERROR_LOADING_TITLES'
  })
  }
}

  const onSearch = searchText => {
    dispatchTitle ({
      type: 'SET_SEARCH_TEXT',
      payload: {searchText},
    })
  }



  const addSpeechTodo = (newSpeechNote) => {

    fetch (url, {
      method: 'POST',
      headers: {  
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
    },
      body: JSON.stringify({fields: newSpeechNote})
    }
    )
    .then (response => response.json())
    .then(data => {
      const addSpeechNote = 
      {
       title: data.fields.title,
       id: data.id
     }
      dispatchTitle({
        type: "ADD_TODO",
        payload: {
          newTodo: addSpeechNote 
        }
    })
    })
  }


  const editTodo = (editTodo) => {
    const urlEdit = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/${process.env.REACT_APP_TABLE_NAME}/${editTodo.id}`
    fetch (urlEdit, {
      method: 'PUT',
      headers: {  
        ...defaultHeaders,
        'Content-Type': 'application/json',
    },
      body: JSON.stringify({
        fields: {
          title: editTodo.title
        }})})
    .then (response => response.json())
    .then (data => { 
      // refreshRecords()
      const editTodo = 
       {
        title: data.fields.title,
        id: data.id
      }
      dispatchTitle({
        type: "EDIT_TODO",
        payload: {
          editTodo: editTodo 
        }
    })
    })

  }


  const toggleSortTitle = () => {
    if (sortTitle) {
      dispatchTitle({
        type: "SORT_TITLES_AZ"
      })
    setSortTitle((prevSortTitle) => !prevSortTitle)
  } else {
    dispatchTitle({
      type: "SORT_TITLES_ZA"
    })
    setSortTitle((prevSortTitle) => !prevSortTitle)

  }
  
}

  const lastTodoIndex = currentPage * todoPerPage
  const firstTodoIndex = lastTodoIndex - todoPerPage
  const currentTodos = state.todoList.slice(firstTodoIndex,lastTodoIndex)

  console.log(sortTitle);

  

  return (
    <ThemeContext.Provider value={{isDarkMode, toggleTheme}} >
      <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
    <BrowserRouter>
    <Routes>

      <Route exact path={paths.HOME} 
      element = {
        <div className={styles.body} >
        <ThemeToggle />
        <header>
        <h1>Todo List</h1>
        <div className={styles.wrap}>

        <AddTodoForm onAddTodo={addTodo} />
        <Search onSearch={onSearch}/>
        </div>
        <div className={styles.wrapSpeech}>
        <h2>Bored of writing 😶‍🌫️ Speak to me 🤗</h2>
        <SpeechText onAddSpeechTodo={addSpeechTodo}/>
        </div>
        <div>
 
        </div>
        </header>

        <main>
        {state.isLoading ? <p> Loading ... </p> : 
        <TodoList 
        toggleSortTitle={toggleSortTitle}
        todoList={currentTodos} 
        onRemoveTodo={removeTodo}
        onHandleEdit={editTodo}
        />
        }

        <Pagination 
        totalTodos = {state.todoList.length}
        todoPerPage={todoPerPage}
        setCurrentPage={setCurrentPage}
        />
        </main>
      </div>
      }
      />
      <Route path={paths.NEW_TODO} 
      element={
        <h1>New Todo List</h1>
      }
      />

    </Routes>
    </BrowserRouter>
    </div>
    </ThemeContext.Provider>
  );
}

export default App;

