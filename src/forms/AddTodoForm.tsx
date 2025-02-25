
import React, {ChangeEvent, useState} from 'react';
import { useNavigate } from 'react-router-dom'
import InputWithLabel from './InputWithLabel'
import paths from '@root/paths/paths'
import styles from '@asset/App.module.css'
import {Todo} from '@root/types'


interface AddTodoProps {
    onAddTodo: (todo: Todo) => void
}

export default function AddTodoForm({onAddTodo}: AddTodoProps ): JSX.Element {

    const [todoTitle, setTodoTitle] = useState<string>('')
    const navigate = useNavigate()

    function handleTitleChange (e: ChangeEvent<HTMLInputElement>): void{
        const newTodoTitle: string = e.target.value;
        setTodoTitle(newTodoTitle)
    }

    function handleAddTodo(e: ChangeEvent<HTMLFormElement>): void {
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

