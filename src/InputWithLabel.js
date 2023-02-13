import React, {useRef, useEffect} from 'react';
export default function InputWithLabel({onChange, todoTitle, label}) {

    const inputRef = useRef()

    useEffect (() => {
        inputRef.current.focus()
    })

    return (
        <>
        <label htmlFor='todoTitle'>{label}</label>
        <input id="todoTitle" name="title" onChange={onChange} value={todoTitle} ref={inputRef}/>
        </>
    )
}

