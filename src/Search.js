
import React, {useState} from 'react';
import InputWithLabel from './InputWithLabel'
import styles from './static/App.module.css'
import { ReactComponent as SearchLogo } from './static/search.svg';

export default function Search({onSearch }) {

    const [timer, setTimer] = useState(null)


    function onChange (e){
        if (timer) {
            clearTimeout(timer)
            setTimer(null)
        }

        setTimer(setTimeout(() => {
            onSearch(e.target.value)
        }, 1000))

    }

    return (
        <>
        <form className={styles.form}>
           <InputWithLabel 
           onChange={onChange}  
           id="search" 
           name="search" 
           title="search"
           placeholder="Search"
            >
            </InputWithLabel>

        </form>

        </>
    )
}
