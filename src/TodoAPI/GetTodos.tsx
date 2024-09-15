import React, {useEffect, useState} from 'react';


const GetTodos = () => {
    const [todos, setTodos] = useState([])
    
    useEffect(() => {
        fetchTodos()
    }, [])


    // const fetchTodos = async (): Promise<any> => {
    //     const options = {
    //       method: 'GET',
    //       headers: {  
    //         Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDVjNTUxOWY5NjhjM2VjNjgyYTczNzMiLCJuYW1lIjoicGV0ZXIiLCJpYXQiOjE2ODM4NTM2MDMsImV4cCI6MTY4NjQ0NTYwM30.9dce4zek1YeJB_N72RQvpiov6K75tGn3KJAJwHhwzn0`,
    //         'Content-Type': 'application/json',
    //     },
    //     // body: JSON.stringify({
    //     //     title: "alo9eee",
    //     //     content: "ola9",
    //     // })
    //   }
    //     try {
    //       const response = await fetch ("https://todos-api-miminiverse.onrender.com/api/v1/todos", options)
    
    //     const data = await response.json()
    //     console.log(data);
        
    
    //   } catch (err) {
    //     console.log(err);
        
    //   }
    // }

    const fetchTodos = async () => {
      const url ="127.0.0.1:5051/api/v1/todos"
      try {
  

        const response = await fetch (url, 
        {
          headers: {     
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDY0MmY4Mjc3MTNmNDE3OTcwNWJkODQiLCJuYW1lIjoicGV0ZXIxIiwiaWF0IjoxNjg0Mjg3MzYyLCJleHAiOjE2ODY4NzkzNjJ9.AgIj73_LWCBssakaund-p96pPvY5DAt9Hz_5q9gFonA`, },
          method: "GET",
        }
        )
        const data = response.json()
        console.log(response);
        
  
      } catch (error) {
        console.log(error);
        
    }
  }


    return (
    <>

    </>
    )
}

export default GetTodos


