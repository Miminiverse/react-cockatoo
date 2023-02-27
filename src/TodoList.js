import React from 'react';
import TodoListItem from './TodoListItem';


export default function TodoList({todoList, onRemoveTodo}) {
    return (
        <>
            <ul >
                { todoList ? todoList.map((todo) => (
                        <TodoListItem
                            key={todo.id}
                            todo={todo} 
                            onRemoveTodo = {onRemoveTodo}
                            />
                    )) : null }
            </ul>
        </>
    )
}

