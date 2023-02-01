
import React, {useState} from 'react';
import { v4 as uuidv4} from 'uuid'

export default function AddTodoForm({ onAddTodo }) {

    const [todoTitle, setTodoTitle] = useState('')

    function handleTitleChange (e){
        const newTodoTitle = e.target.value
        setTodoTitle(newTodoTitle)
    }

    function handleAddTodo(e) {
        e.preventDefault()
        onAddTodo({
            title: todoTitle,
            id: uuidv4()
        })
        setTodoTitle("")
    }

    return (
        <form onSubmit={handleAddTodo}>
            <label htmlFor='todoTitle'>Title</label>
            <input id="todoTitle" name="title" value={todoTitle}
            onChange={handleTitleChange} />
            <button type="submit">Add</button>
        </form>
    )
}