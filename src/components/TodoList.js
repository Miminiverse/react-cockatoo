import React from 'react';
import TodoListItem from './TodoListItem';
import styles from '../static/App.module.css'
import PropTypes from 'prop-types'

export default function TodoList({todoList, onRemoveTodo, onHandleEdit, toggleSortTitle}) {
    return (
        <>
            <div className={styles.todoList}>
            <div className={styles.wrapCheckbox}>
            <p>A-Z</p>
            <input 
            type="checkbox" 
            id="sort"
            className={styles.checkbox} 
            onChange={toggleSortTitle}

            />
            <label 
            htmlFor="sort" 
            className={styles.label}>
            <i className="fas fa-moon"></i>
            <i className='fas fa-sun'></i>
            <div className={styles.ball} />
            </label>
            </div>

                <h2>Task</h2>
                { todoList ? todoList.map((todo) => (
                        <TodoListItem
                            key={todo.id}
                            todo={todo} 
                            onRemoveTodo = {onRemoveTodo}
                            onHandleEdit={onHandleEdit}
                            />
                    )) : null }
            </div>
        </>
    )
}

TodoList.propTypes = {
    todoList: PropTypes.array,
    onRemoveTodo: PropTypes.func,
    onHandleEdit: PropTypes.func,
}


