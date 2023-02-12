
import React, {useState} from 'react';


export default function AddTodoForm({ onAddTodo }) {

    const [todoTitle, setTodoTitle] = useState('')

    function handleTitleChange (e){
        const newTodoTitle = e.target.value;
        setTodoTitle(newTodoTitle)
    }

    function handleAddTodo(e) {
        e.preventDefault()
        onAddTodo({
            title: todoTitle,
            id: Date.now()
        })
        setTodoTitle("")
    }

    return (
        <form id="form" onSubmit={handleAddTodo}>
            <label htmlFor='todoTitle'>Title</label>
            <input id="todoTitle" name="title" onChange={handleTitleChange} value={todoTitle}
 />
            <button type="submit">Add</button>
        </form>
    )
}
