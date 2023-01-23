import React from 'react';

const todoList = [
    {
        title: 'Water plants',
        id: 0,
        isComplete: false,
    },
    {
        title: 'Buy milk',
        id: 1,
        isComplete: false,
    },
    {
        title: 'Check calendar',
        id: 2,
        isComplete: false,
    },
    {
        title: 'Finish homework++',
        id: 3,
        isComplete: false,
    },
    {
        title: 'See friends',
        id: 4,
        isComplete: false,
    },
    {
        title: 'Fix bike',
        id: 5,
        isComplete: false,
    },


];

export default function TodoList() {
    return (
        <ul>
            {todoList.map((list) =>
                <li key={list.id}> {list.title}</li>
            )}
        </ul>
    )
}