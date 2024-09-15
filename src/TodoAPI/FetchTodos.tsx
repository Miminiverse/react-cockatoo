import React, { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import styles from '@asset/App.module.css'


export default function FetchTodos () {

    // const [todo, setTodo] = useState<any>("")

    const defaultHeaders = {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDY0MmY4Mjc3MTNmNDE3OTcwNWJkODQiLCJuYW1lIjoicGV0ZXIxIiwiaWF0IjoxNjg0Mjg3MzYyLCJleHAiOjE2ODY4NzkzNjJ9.AgIj73_LWCBssakaund-p96pPvY5DAt9Hz_5q9gFonA`,
      }

    const fetchItem = async (): Promise<any> => {
        const url = 'http://127.0.0.1:5051/api/v1/todos'
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
        console.log(result);
        
    
    }
    catch (error) {
        console.log(error);
    }
    
}

useEffect(() => {
    fetchItem()
}, [])



    return (
        <>
        <div className={styles.todoItem}>
            <h2>Task</h2>
        </div>

        </>
    )
}

