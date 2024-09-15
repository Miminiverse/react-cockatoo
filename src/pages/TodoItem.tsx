import React, { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import styles from '@asset/App.module.css'


export default function TodoItem () {
    const {id} = useParams()
    const [todo, setTodo] = useState<any>("")

    const defaultHeaders = {
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
      }

    const todoItem = async (): Promise<any> => {
        const url = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/${process.env.REACT_APP_TABLE_NAME}/${id}`
        const options ={
          method: 'GET',
          headers: {
            ...defaultHeaders,
        }
      }  
      try {
        
        const response = await fetch (url, options)
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }
        const result = await response.json()
        setTodo(result.fields)
        
    }
    catch (error) {
        console.log(error);
    }
    
}

useEffect(() => {
    todoItem()
}, [])



    return (
        <>
        <div className={styles.todoItem}>
            <h2>Task</h2>
        <div className={styles.lists}>
            <div className={styles.list}> 
                <span>{todo.title} </span>          
            </div>
        </div>
        </div>

        </>
    )
}

