
import React, { useEffect, useState, useReducer } from 'react';
import TodoList from './TodoList'
import AddTodoForm from './AddTodoForm'
import "./App.css";
import {v4 as uuidv4} from 'uuid';

  const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

function App() {
const [isListening, setIsListening] = useState(false)
const [note, setNote] = useState(null)
const [savedNotes, setSavedNotes] = useState([])

const initialState = {
  todoList: [],
  isLoading: true,
  isError: false,
}

const todoListReducer = (previousState, action) => {


  switch (action.type){

    case "INITIAL_LOADING_TODO_LIST":
      return {
        ...previousState,
      }
    case 'SUCCESS_LOADING_TODO_LIST':
      return {
        ...previousState, 
        isLoading: false,
        todoList: action.payload.todoList
      };
    case 'ERROR_LOADING_TODO_LIST':
      return {
        ...previousState,
        isLoading: false,
        isError: true,
      };
    case 'ADD_TODO':
      return {
        todoList: [...previousState.todoList, action.payload.newTodo]
      }

  };

}

const [ state, dispatchTodoList] = useReducer(todoListReducer, initialState)
const [todoList, setTodoList] = useState ([])
const [isLoading, setIsLoading] = useState (true)
const url = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/${process.env.REACT_APP_TABLE_NAME}`


useEffect(() => {
  handleListen()
}, [isListening])

const handleListen = () => {
  if (isListening) {
    mic.start()
    mic.onend = () => {
      console.log('continue..')
      mic.start()
    }
  } else {
    mic.stop()
    mic.onend = () => {
      console.log('Stopped Mic on Click')
    }
  }
  mic.onstart = () => {
    console.log('Mics on')
  }

  mic.onresult = event => {
    const transcript = Array.from(event.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('')
    // console.log(transcript)
    // setNote(transcript)
    setTodoList(transcript)
    mic.onerror = event => {
      console.log(event.error)
    }
  }
}

console.log(todoList)

// const handleSaveNote = () => {
//   setSavedNotes([...savedNotes, note])
//   setNote('')
// }



  const fetchData = async () => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
      }
    }

    dispatchTodoList({
      type: 'INITIAL_LOADING_TODO_LIST',
    })


    try {
      const response = await fetch (url, options)
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      const data = await response.json()
      const todos = data.records.map((todo) => {
        return {
          title: todo.fields.title,
          id: todo.id
        }
      })

      dispatchTodoList({
        type: 'SUCCESS_LOADING_TODO_LIST',
        payload: {
          todoList: todos
        }
      })



    } catch (error) {
      dispatchTodoList({
        type: 'ERROR_LOADING_TODO_LIST',
      })
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const addTodo = (newTodo) => {
    fetch (url, {
      method: 'POST',
      headers: {  
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
    },
      body: JSON.stringify({fields: newTodo})
    }
    )
    .then (response => response.json())
    .then (data => { 
      const addTodo = 
       {
        title: data.fields.title,
        id: data.id
      }
      dispatchTodoList ({
        type: 'ADD_TODO',
        payload: {
          newTodo: addTodo
        }
      })
    })
    }

    function handleSaveNote (newNote) {
      fetch (url, {
        method: 'POST',
        headers: {  
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
      },
        body: JSON.stringify({fields: {
          title: todoList,
        }})
      }
      )
      .then (response => response.json())
      .then (data => { 
        console.log(data)
        const newNote = 
         {
          title: data.fields.title,
          id: data.id
        }
        dispatchTodoList ({
          type: 'ADD_TODO',
          payload: {
            newTodo: newNote
          }
        })
      })

    }


  const removeTodo = async (todo) => {
    const urlDel = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/${process.env.REACT_APP_TABLE_NAME}/` + todo.id
    const options ={
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
    }
  }  
    const response = await fetch (urlDel, options)
  }

  return (
    <>

    <div style={{ textAlign: 'center' }}>
      <h1>Todo List</h1>
      <AddTodoForm onAddTodo={addTodo} />
      <div className="box">
          {isListening ? <span>🎙️</span> : <span>🛑🎙️</span>}
          <button onClick={handleSaveNote} disabled={!todoList}>
            Save Note
          </button>
          <button onClick={() => setIsListening(prevState => !prevState)}>
            Start/Stop
          </button>
          <p>{todoList}</p>
        </div>
      {state.isLoading ? <p> Loading ... </p> : 
      <TodoList todoList={state.todoList} onRemoveTodo={removeTodo}/>
      }
          {savedNotes.map(n => (
            <p key={n}>{n}</p>
          ))}
    </div>

    </>

  )
          }



export default App;

