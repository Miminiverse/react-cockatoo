import React, {useRef, useEffect} from 'react';
import styles from '../static/App.module.css'
import PropTypes from 'prop-types'


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
        ref={inputRef}  {...inputProps}/>
        </div>
        </>
    )
}

InputWithLabel.propTypes = {
    id: PropTypes.string,
    children: PropTypes.string,
    todoTitle: PropTypes.string,
    name: PropTypes.string,
    title: PropTypes.string,
    placeholder: PropTypes.string,
    handleTitleChange: PropTypes.func, 
}
