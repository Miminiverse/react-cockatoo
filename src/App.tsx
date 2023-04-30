
import React, { useEffect, useReducer, useState } from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {stateManagementFunction, initialState} from '@components/TodoState'
import TodoList from '@root/pages/TodoList'
import AddTodoForm from "@root/forms/AddTodoForm";
import SpeechText from '@components/SpeechText'
import SpeechTextUpload from '@components/SpeechTextUpload'
import Search from '@root/forms/Search'
import Pagination from '@components/Pagination'
import ThemeToggle   from '@components/ThemeToggle'
import ThemeContext from '@root/context/ThemeContext'
import styles from '@asset/App.module.css'
import {Todo} from '@root/types'
import "@root/index.css"
import paths from '@root/paths'
import TodoItem from '@root/pages/TodoItem';


function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true)
  const [sortTitle, setSortTitle] = useState<boolean>(true)
  const [sortTime, setSortTime] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [todoPerPage] = useState<number>(10)

  function toggleTheme () {
    setIsDarkMode((prevIsDarkMode) => !prevIsDarkMode)
  }
  
  const [state, dispatchTitle] = useReducer(stateManagementFunction, initialState)

  const defaultHeaders = {
    Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
  }


  const url = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/${process.env.REACT_APP_TABLE_NAME}`


  const refreshRecords = () => {
    dispatchTitle({
      type: 'START_LOADING_TITLES'
    })
    fetchData({
      searchText : state.searchText, 
    })
      .then(loadedTodos => {
      dispatchTitle({
        type: 'FINISH_LOADING_TITLES',
        payload: {
          todoList: loadedTodos
        }
      })
    })
  }

  interface TodosResponse {
    records: {
      id: number,
      fields: {
        title: string
      }
      createdTime?: number,
    } []
  }


  const handleResponse = async (response: Response): Promise<Todo[]> => {
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    const data: TodosResponse = await response.json()

    const todos: Todo[] = data.records.map((todo) => {

      return {
        createdTime: todo.createdTime,
        title: todo.fields.title,
        id: todo.id
      }
    })
    return todos
  }

  interface Options {
    searchText?: string
  }

  const fetchData = async (options: Options): Promise<any> => {

    try {
      let params: any = {}
      if (options?.searchText) {
        params = {
          ...params, 
          filterByFormula: `SEARCH('${options.searchText.toLowerCase()}', {title})`,
        };
      }
      
        params = {
          ...params, 
          'sort[0][field]': 'title',
          'sort[0][direction]': 'asc',
        }

      const response = await fetch (url + "?" + new URLSearchParams(params), 
      {
        headers: { ...defaultHeaders },
        method: "GET",
      }
      )
      return handleResponse(response)

    } catch (error) {
      dispatchTitle({
        type: 'ERROR_LOADING_TITLES'
    })
  }
}

  useEffect(() => {
    refreshRecords()
  }, [state.searchText])

  interface AddTodoResponse {
    id: number;
    fields: {
      title: string
    };
    createdTime: number;
  }

  const addTodo = async (newTodo: Todo): Promise<any> => {
    const options = {
      method: 'POST',
      headers: {  
        ...defaultHeaders,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({fields: newTodo})
  }
    try {
      const response = await fetch (url, options)
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
    }

    const data: AddTodoResponse = await response.json()

    if (data) {
      const addTodo = 
      {
       title: data.fields.title,
       id: data.id
     }
     dispatchTitle({
       type: "ADD_TODO",
       payload: {
         newTodo: addTodo 
       }
   })
   alert("Added successfuly")
    }
    } catch (err) {
      dispatchTitle({
        type: 'ERROR_LOADING_TITLES'
    })
    }
  }


  const removeTodo = async (todo: Todo): Promise<any> => {

    const urlDel = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/${process.env.REACT_APP_TABLE_NAME}/${todo.id}`
    const options ={
      method: 'DELETE',
      headers: {
        ...defaultHeaders,
    }
  }  
  try {
    
    const response = await fetch (urlDel, options)
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    dispatchTitle({
      type: "REMOVE_TODO",
      payload: {
        id: todo.id
      }
  })}
  catch (error) {
    dispatchTitle({
      type: 'ERROR_LOADING_TITLES'
  })
  }
}


  const editTodo = (editTodo: Todo) => {
    const urlEdit = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/${process.env.REACT_APP_TABLE_NAME}/${editTodo.id}`
    fetch (urlEdit, {
      method: 'PUT',
      headers: {  
        ...defaultHeaders,
        'Content-Type': 'application/json',
    },
      body: JSON.stringify({
        fields: {
          title: editTodo.title
        }})})
    .then (response => response.json())
    .then (data => { 
      const editTodo = 
       {
        title: data.fields.title,
        id: data.id
      }
      dispatchTitle({
        type: "EDIT_TODO",
        payload: {
          editTodo: editTodo 
        }
    })
    })
  }

  const onSearch = (searchText:string) => {
    dispatchTitle ({
      type: 'SET_SEARCH_TEXT',
      payload: {searchText},
    })
  }


  const toggleSortTitle = () => {
    if (sortTitle) {
      dispatchTitle({
        type: "SORT_TITLES_AZ"
      })
    setSortTitle((prevSortTitle) => !prevSortTitle)
  } else {
    dispatchTitle({
      type: "SORT_TITLES_ZA"
    })
    setSortTitle((prevSortTitle) => !prevSortTitle)

  }
  
}


const toggleSortTime = () => {
  if (sortTime) {
    dispatchTitle({
      type: "SORT_TIME_LATEST"
    })
  setSortTime((prevSortTime) => !prevSortTime)
} else {
  dispatchTitle({
    type: "SORT_TIME"
  })
  setSortTime((prevSortTime) => !prevSortTime)
}

}

  const lastTodoIndex = currentPage * todoPerPage
  const firstTodoIndex = lastTodoIndex - todoPerPage
  const currentTodos = state.todoList.slice(firstTodoIndex,lastTodoIndex)


  return (
    <ThemeContext.Provider value={{isDarkMode, toggleTheme}} >
      <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
    <BrowserRouter>
    <Routes>

      <Route exact path={paths.HOME} 
      element = {
        <div className={styles.body} >
        <div className={styles.wrapHead} >
        <ThemeToggle />
        <p> 📓 TodoList 📓</p>
        </div>
        <header>

        <div className={styles.wrap}>
        <AddTodoForm onAddTodo={addTodo} />
        <Search onSearch={onSearch}/>
        </div>
        <div className={styles.wrapSpeech}>
        <h2>Bored of writing 😶‍🌫️ Speak to me 🤗</h2>
        <SpeechText 
        onAddSpeechTodo={addTodo}
        />
        <br/>
        <br/>
        <h2>Transcription 😶‍🌫️ Translation 🤗</h2>

        <SpeechTextUpload onAddTextTodo={addTodo}/> 
        </div>
        <div>
 
        </div>
        </header>

        <main>
        {state.isLoading ? 
        <p className={styles.loading}> ... Loading ... </p> : 
        <TodoList 
        toggleSortTitle={toggleSortTitle}
        toggleSortTime={toggleSortTime}
        todoList={currentTodos} 
        onRemoveTodo={removeTodo}
        onHandleEdit={editTodo}
        />
        }

        <Pagination 
        totalTodos = {state.todoList.length}
        todoPerPage={todoPerPage}
        setCurrentPage={setCurrentPage}
        />
        </main>
      </div>
      }
      />
      <Route path={paths.NEW_TODO} 
      element={
        <h1>New Todo List</h1>
      }
      />
      <Route path={paths.TODO}
      element={
        <TodoItem
        />
      }
      />

    </Routes>
    </BrowserRouter>
    </div>
    </ThemeContext.Provider>
  );
}

export default App;

