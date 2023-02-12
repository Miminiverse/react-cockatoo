import React from 'react';
import TodoListItem from './TodoListItem';


export default function TodoList({todoList}) {
    return (
        <>
            <ul >
                { todoList ? todoList.map((todo) => (
                        <TodoListItem
                            key={todo.id}
                            todo={todo} />
                    )) : null }
            </ul>
        </>
    )
}

