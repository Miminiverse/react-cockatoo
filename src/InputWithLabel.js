import React, {useRef, useEffect} from 'react';

export default function InputWithLabel({onChange, todoTitle, label, children}) {

    const inputRef = useRef()

    useEffect (() => {
        inputRef.current.focus()
    }, [])

    return (
        <>
        <label htmlFor='todoTitle'>{children}</label>
        <input id="todoTitle" name="title" onChange={onChange} value={todoTitle} ref={inputRef} />
        </>
    )
}

