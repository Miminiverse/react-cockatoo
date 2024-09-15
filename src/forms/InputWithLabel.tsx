import React, {useRef, useEffect, InputHTMLAttributes, FC} from 'react';
import styles from '@asset/App.module.css'

interface InputWithLabelProps extends InputHTMLAttributes<HTMLInputElement>{
    id: string;
}

const InputWithLabel: FC<InputWithLabelProps> = ({ id, children,  ...inputProps }) => {


    const inputRef = useRef<HTMLInputElement>(null)

    useEffect (() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
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

export default InputWithLabel