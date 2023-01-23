import React from 'react';

export default function AddTodoForm() {
    return (
        <form>
            <label htmlFor='todoTitle'>Title</label>
            <input id="todoTitle" />
            <button type="submit">Add</button>
        </form>
    )
}