import React, {useRef, useEffect} from 'react';
import styles from '../static/App.module.css'

export default function InputWithLabel({ id, children,  ...inputProps }) {


    const inputRef = useRef(null)

    useEffect (() => {
        inputRef.current.focus()
    }, [])

    return (
        <>
        <div className={styles.wrapper}>
        <label htmlFor={id}>{children}</label>
        <input
        className={styles.input} 
        id={id} 
        ref={inputRef}  {...inputProps}
        />
        </div>
        </>
    )
}
