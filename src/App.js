
import React, { useEffect, useState } from 'react';
import TodoList from './TodoList'
import AddTodoForm from './AddTodoForm'
import TodoListItem from './TodoListItem';


function App() {

  const [todoList, setTodoList] = useState ([])
  const [isLoading, setIsLoading] = useState (true)

  const fetchData = async () => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
      }
    }
    const url = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/${process.env.REACT_APP_TABLE_NAME}`
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
      console.log(todos)
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
    setTodoList((prevList) => [...prevList, newTodo]);
  };


  function removeTodo (todo) {
    setTodoList((newArray) => newArray.filter((list) => todo.id !== list.id))
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Todo List</h1>
      <AddTodoForm onAddTodo={addTodo} />
      {isLoading ? <p> Loading ... </p> : 
      <TodoList todoList={todoList} onRemoveTodo={removeTodo}/>
      }
    </div>
  );
}

export default App;

