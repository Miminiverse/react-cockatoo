
import React, {ChangeEvent, useState} from 'react';
import InputWithLabel from '@root/forms/InputWithLabel'
import styles from '@asset/App.module.css'


interface SearchProps {
    onSearch: (searchTerm: string) => void
}

export default function Search({onSearch} : SearchProps) {

    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)


    function onChange (e: ChangeEvent<HTMLInputElement>){
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
