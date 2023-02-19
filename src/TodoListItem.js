import React from 'react';

export default function TodoListItem({id, todo}) {
    return (
        <>
            <li key={id}> {todo.title}</li>
        </>

    )
}