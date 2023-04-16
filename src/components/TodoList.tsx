import React from 'react';
import TodoListItem from './TodoListItem';
import styles from '../static/App.module.css'
import {Todo} from '../types'



interface TodoListProps {
    todoList: Todo[];
    onRemoveTodo: (id:number) => void;
    onHandleEdit: (id: number, newTitle: string) => void;
    toggleSortTitle: () => void;
    toggleSortTime: () => void;
}


export default function TodoList({todoList, onRemoveTodo, onHandleEdit, toggleSortTitle, toggleSortTime}: TodoListProps) {
    return (
        <>
            <div className={styles.todoList}>
            <div className={styles.sort}>
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

            <div className={styles.wrapCheckbox}>
            <p>Latest</p>
            <input 
            type="checkbox" 
            id="sortTime"
            className={styles.checkbox} 
            onChange={toggleSortTime}

            />
            <label 
            htmlFor="sortTime" 
            className={styles.label}>
            <i className="fas fa-moon"></i>
            <i className='fas fa-sun'></i>
            <div className={styles.ball} />
            </label>
            </div>
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



