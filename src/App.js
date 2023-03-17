
import React, { useEffect, useState, useReducer } from 'react';
import TodoList from './TodoList'
import AddTodoForm from './AddTodoForm'

import {
  BrowserRouter, Routes, Route
} from "react-router-dom";

function App() {

  const stateManagementFunction = (previousState, action) => {
    switch (action.type) {
      case 'FINISH_LOADING_TITLES':
        return {
          ...previousState,
          isLoading: false,
          todoList: action.payload.todoList
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
          todoList: [...previousState.todoList, action.payload.todo]

        }
    }
  }

  const initialState = {
    todoList: [],
    isLoading: true,
    isError: false
  }

  const [state, dispatchTitle] = useReducer(stateManagementFunction, initialState)

  const [todoList, setTodoList] = useState ([])

  const url = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/${process.env.REACT_APP_TABLE_NAME}?sort%5B0%5D%5Bfield%5D=title&sort%5B0%5D%5Bdirection%5D=desc`



  const fetchData = async () => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
      }
    }

    try {
      const response = await fetch (url, options)
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
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const addTodo = (newTodo) => {
    fetch (url, {
      method: 'POST',
      headers: {  
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
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
          todoList: 
        }
    })
    }


  const removeTodo = async (todo) => {

    const urlDel = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/${process.env.REACT_APP_TABLE_NAME}/${todo.id}`
    const options ={
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
    }
  }  
  try {
    
    const response = await fetch (urlDel, options)
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    setTodoList((prevList) => prevList.filter((item) => item.id !== todo.id))
  }
  catch (error) {
    console.log(error)
  }
}


  

  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/" 
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
      <Route path="/new" element={
        <h1>New Todo List</h1>
      }
      />
    </Routes>
    </BrowserRouter>
  );
}

export default App;

