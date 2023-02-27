
import React, { useEffect, useState } from 'react';
import TodoList from './TodoList'
import AddTodoForm from './AddTodoForm'

function useSemiPersistentState () {
  const [todoList, setTodoList] = useState (JSON.parse(localStorage.getItem("savedTodoList")) || [])

  useEffect (() => {
    localStorage.setItem("savedTodoList", JSON.stringify(todoList))
  }, [todoList])

  return [todoList, setTodoList]
}

function App() {
  const [todoList, setTodoList] = useSemiPersistentState()


  function addTodo (newTodo) {
    setTodoList((prevList) => [...prevList, newTodo])
  }


  function removeTodo (todo) {
    const newArray = todoList.filter((list) => todo.id !== list.id )
    setTodoList(newArray)
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Todo List</h1>
      <AddTodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onRemoveTodo={removeTodo}/>
    </div>
  );
}

export default App;


