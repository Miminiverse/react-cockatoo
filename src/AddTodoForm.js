
import React, {useState} from 'react';
import InputWithLabel from './InputWithLabel'

export default function AddTodoForm({ onAddTodo }) {

    const [todoTitle, setTodoTitle] = useState('')

    function handleTitleChange (e){
        const newTodoTitle = e.target.value;
        setTodoTitle(newTodoTitle)
    }

    function handleAddTodo(e) {
        e.preventDefault()
        if (!todoTitle) {
            alert("Please enter a title")
        } else {
            onAddTodo({
                title: todoTitle
            })
        }
        setTodoTitle("")
    }

    return (
        <form id="form" onSubmit={handleAddTodo}>
           <InputWithLabel onChange={handleTitleChange} value={todoTitle} id="title" name="title" title="title" >
                Title: 
            </InputWithLabel>
            <button type="submit">Add</button>
        </form>
    )
}
