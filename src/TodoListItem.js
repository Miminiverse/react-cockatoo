import React from 'react';
import styles from './static/App.module.css'


export default function TodoListItem({todo, onRemoveTodo}) {

    return (
        <>
        <div className={styles.lists}>
            <div className={styles.list}> 
                <span>{todo.title} </span>
            <button
            className={styles.buttonRemove}
             type="button"
             onClick={() => 
             onRemoveTodo(todo)
            }
                >Remove
            </button>
            </div>
        </div>
        </>
    )
}