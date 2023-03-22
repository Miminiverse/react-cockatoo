
import React, { useEffect, useReducer } from 'react';
import TodoList from './TodoList'
import AddTodoForm from './AddTodoForm'
import {
  BrowserRouter, Routes, Route
} from "react-router-dom";

import paths from './paths'

function App() {
  const defaultHeaders = {
    Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
  }
  const stateManagementFunction = (previousState, action) => {
    switch (action.type) {
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

  const fetchData = async options => {

    try {
    //   let params = {}

    //   if 

      const response = await fetch (url + '?' + newURLSearchParams(params), 
      {
        headers: { ...defaultHeaders },
        method: "GET",
      }
      )
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
      dispatchTitle({
        type: 'FINISH_LOADING_TITLES',
        payload: {
          todoList: todos,
        }
      })

    } catch (error) {
      dispatchTitle({
        type: 'ERROR_LOADING_TITLES'
    })
  }
}

  useEffect(() => {
    fetchData()
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


  return (
    <BrowserRouter>
    <Routes>
      <Route exact path={paths.HOME} 
      element = {
        <div style={{ textAlign: 'center' }}>
        <h1>Todo List</h1>
        <AddTodoForm onAddTodo={addTodo} />
        {state.isLoading ? <p> Loading ... </p> : 
        <TodoList todoList={state.todoList} onRemoveTodo={removeTodo}/>
        }
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
  );
}

export default App;

