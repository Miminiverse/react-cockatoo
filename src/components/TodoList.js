import React from 'react';
import TodoListItem from './TodoListItem';
import styles from '../static/App.module.css'

export default function TodoList({todoList, onRemoveTodo}) {
    return (
        <>
            <div className={styles.todoList}>
                <h2>Task</h2>
                { todoList ? todoList.map((todo) => (
                        <TodoListItem
                            key={todo.id}
                            todo={todo} 
                            onRemoveTodo = {onRemoveTodo}
                            />
                    )) : null }
            </div>
        </>
    )
}

