
import React, { useEffect, useReducer, useState } from 'react';
import TodoList from './components/TodoList'
import AddTodoForm from './components/AddTodoForm'
import SpeechText from './components/SpeechText'
import Search from './components/Search'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import styles from './static/App.module.css'
import "./index.css";
import paths from './paths'
import ThemeToggle   from './ThemeToggle'
import {ThemeContext}  from './ThemeContext'


function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)

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
    searchText: ""
  }

  const [state, dispatchTitle] = useReducer(stateManagementFunction, initialState)

  const url = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/${process.env.REACT_APP_TABLE_NAME}`

  const refreshRecords = () => {
    dispatchTitle({
      type: 'START_LOADING_TITLES'
    })
    fetchData({searchText : state.searchText}).then(loadedTodos => {
      dispatchTitle({
        type: 'FINISH_LOADING_TITLES',
        payload: {
          todoList: loadedTodos
        }
      })
    })
  }

  const handleResponse = async (response) => {
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    const data = await response.json()
    const todos = data.records.map((todo) => {
      return {
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
          'sort[0][field]': 'title',
          'sort[0][direction]': 'desc',
        };
      }

      
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
    console.log(newSpeechNote)
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
        </header>

        <main>
        {state.isLoading ? <p> Loading ... </p> : 
        <TodoList todoList={state.todoList} onRemoveTodo={removeTodo}/>
        }
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

