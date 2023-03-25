
import React, {useState} from 'react';
import InputWithLabel from './InputWithLabel'

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
        <form>
           <InputWithLabel onChange={onChange}  id="search" name="search" title="search" >
                Search: 
            </InputWithLabel>
        </form>
    )
}
