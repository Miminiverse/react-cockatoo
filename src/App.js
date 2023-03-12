
import React, { useEffect, useState } from 'react';
import TodoList from './TodoList'
import AddTodoForm from './AddTodoForm'

import {
  BrowserRouter, Routes, Route
} from "react-router-dom";

function App() {

  const [todoList, setTodoList] = useState ([])
  const [isLoading, setIsLoading] = useState (true)
  const url = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/${process.env.REACT_APP_TABLE_NAME}`

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
      setTodoList(todos)
      setIsLoading(false)

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
      setTodoList((prevList) => [...prevList, addTodo])
    })
    }


  const removeTodo = async (todo) => {

    const urlDel = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/${process.env.REACT_APP_TABLE_NAME}/` + todo.id
    const options ={
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
    }
  }  
    const response = await fetch (urlDel, options)
    setTodoList((prevList) => prevList.filter((item) => item.id !== todo.id))
  }

  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/" 
      element = {
        <div style={{ textAlign: 'center' }}>
        <h1>Todo List</h1>
        <AddTodoForm onAddTodo={addTodo} />
        {isLoading ? <p> Loading ... </p> : 
        <TodoList todoList={todoList} onRemoveTodo={removeTodo}/>
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

