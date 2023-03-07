import React, {useRef, useEffect} from 'react';

export default function InputWithLabel({ id, children,  ...inputProps }) {

    const inputRef = useRef(null)

    useEffect (() => {
        inputRef.current.focus()
    }, [])

    return (
        <>
        <label htmlFor={id}>{children}</label>
        <input id={id} ref={inputRef}  {...inputProps}/>
        </>
    )
}

