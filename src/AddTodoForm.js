
import React, {useState} from 'react';
import InputWithLabel from './InputWithLabel'
import { useNavigate } from 'react-router-dom'
import paths from './paths'


export default function AddTodoForm({ onAddTodo }) {

    const [todoTitle, setTodoTitle] = useState('')
    const navigate = useNavigate()

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
        navigate(paths.HOME)
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
