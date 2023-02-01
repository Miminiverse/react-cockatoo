
import React from 'react';

export default function AddTodoForm({ onAddTodo }) {

    function handleAddTodo(e) {
        e.preventDefault()
        const todoTitle = e.target.title.value
        onAddTodo(todoTitle)
        e.target.title.value = " "
        console.log(todoTitle)
    }

    return (
        <form onSubmit={handleAddTodo}>
            <label htmlFor='todoTitle'>Title</label>
            <input id="todoTitle" name="title" />
            <button type="submit">Add</button>
        </form>
    )
}