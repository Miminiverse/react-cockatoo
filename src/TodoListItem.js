import React from 'react';

export default function TodoListItem({ todo }) {
    return (
        <>
            <li> {todo.title}</li>
        </>

    )
}