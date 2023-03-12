import React from 'react';

export default function TodoListItem({todo, onRemoveTodo}) {

    return (
        <>
        <p>
            <li> {todo.title} 
            &nbsp;
            <button type="button" onClick={() => 
                onRemoveTodo(todo)
            }
                >Remove
            </button>
            </li>
        </p>
        </>
    )
}