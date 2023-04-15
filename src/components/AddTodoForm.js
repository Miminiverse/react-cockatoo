
import React, {useState} from 'react';
import InputWithLabel from './InputWithLabel'
import { useNavigate } from 'react-router-dom'
import paths from '../paths'
import styles from '../static/App.module.css'
import PropTypes from 'prop-types'


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
        <form 
        className={styles.form}
        id="form" 
        onSubmit={handleAddTodo}>
           <InputWithLabel 
           placeholder="Add todo"
           onChange={handleTitleChange} value={todoTitle} id="title" name="title" title="title" >
            </InputWithLabel>
             <button 
             className={styles.buttonAdd}
             type="submit">Add</button> 

        </form>
    )
}

AddTodoForm.propTypes = {
    onAddTodo: PropTypes.func
}
