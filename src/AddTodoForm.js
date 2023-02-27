
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
        onAddTodo({
            title: todoTitle,
            id: Date.now()
        })
        setTodoTitle("")
    }

    return (
        <form id="form" onSubmit={handleAddTodo}>
           <InputWithLabel onChange={handleTitleChange} todoTitle={todoTitle} >
                Title: 
            </InputWithLabel>
            <button type="submit">Add</button>
        </form>
    )
}
