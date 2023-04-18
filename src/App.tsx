
import React, { useEffect, useReducer, useState } from 'react';
import {BrowserRouter, Routes, Route,RouteProps} from "react-router-dom";
import TodoList from './components/TodoList'
import AddTodoForm from './components/AddTodoForm'
import SpeechText from './components/SpeechText'
import SpeechTextUpload from './components/SpeechTextUpload'
import Search from './components/Search'
import Pagination from './components/Pagination'
import ThemeToggle   from './ThemeToggle'
import ThemeContext from './ThemeContext'
import styles from './static/App.module.css'
import {Todo} from './types'
import "./index.css";
import paths from './paths'


function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true)
  const [sortTitle, setSortTitle] = useState<boolean>(true)
  const [sortTime, setSortTime] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [todoPerPage] = useState<number>(10)

  function toggleTheme () {
    setIsDarkMode((prevIsDarkMode) => !prevIsDarkMode)
  }
  

  const defaultHeaders = {
    Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
  }

interface State {
  todoList: Todo[];
  isLoading: boolean;
  isError: boolean;
  searchText: string;
  sortTitle: boolean;
}

type Action = 
  | { type: 'START_LOADING_TITLES'}
  | { type: 'FINISH_LOADING_TITLES'; payload: { todoList: Todo[]}}
  | { type: 'SORT_TITLES_AZ'}
  | { type: 'SORT_TITLES_ZA'}
  | { type: 'SORT_TIME'}
  | { type: 'SORT_TIME_LATEST'}
  | { type: 'SET_SEARCH_TEXT'; payload: {searchText: string}}
  | { type: 'ERROR_LOADING_TITLES'}
  | { type: 'ADD_TODO'; payload:  {newTodo: Todo}}
  | { type: 'EDIT_TODO'; payload: { editTodo: Todo}}
  | { type: 'REMOVE_TODO'; payload: {id: number}}


  const stateManagementFunction = (previousState: State, action: Action): State => {
    switch (action.type) {
      case 'START_LOADING_TITLES':
        return {
          ...previousState,
          isLoading: true,
        }
      case 'FINISH_LOADING_TITLES':
        return {
          ...previousState,
          isLoading: false,
          todoList: action.payload.todoList
        }
      case 'SORT_TITLES_AZ':
        return {
            ...previousState,
            isLoading: false,
            todoList: previousState.todoList.sort((a,b)=> a.title.localeCompare(b.title))
          }

      case 'SORT_TITLES_ZA':
        return {
              ...previousState,
              isLoading: false,
              todoList: previousState.todoList.sort((a,b)=> b.title.localeCompare(a.title))
            }  
      case 'SORT_TIME':
        return {
              ...previousState,
              isLoading: false,
              todoList: previousState.todoList.sort((a,b)=> {
                if (a.createdTime && b.createdTime) {
                  if (a.createdTime < b.createdTime) {
                    return -1;
                  } else if ( a.createdTime > b.createdTime) {
                    return 1;
                  } else {
                    return 0
                  }
                }
                return 0
              })
            }                
      case 'SORT_TIME_LATEST':
        return {
          ...previousState,
          isLoading: false,
          todoList: previousState.todoList.sort((a,b)=> {
            if (a.createdTime && b.createdTime) {
              if (b.createdTime < a.createdTime) {
                return -1;
              } else if ( b.createdTime > a.createdTime) {
                return 1;
              } else {
                return 0
              }
            }
            return 0
          })
        }      
      case 'SET_SEARCH_TEXT':
        return {
          ...previousState,
          searchText: action.payload.searchText
        }
      case 'ERROR_LOADING_TITLES':
        return {
          ...previousState,
          isLoading: false,
          isError: true,
        }
      case 'ADD_TODO':
        return {
          ...previousState,
          todoList: [...previousState.todoList, action.payload.newTodo]
        }
      case 'EDIT_TODO':
        return {
          ...previousState,
          todoList: 
          previousState.todoList.map((todo) => {
            if (todo.id === action.payload.editTodo.id) {
              todo.title = action.payload.editTodo.title
            }
            return todo
          }) 
        }
      case 'REMOVE_TODO':
        return {
          ...previousState,
          todoList: previousState.todoList.filter((todo) => todo.id !== action.payload.id)
        }
      default:
        throw new Error();
    }
  }

  const initialState = {
    todoList: [],
    isLoading: true,
    isError: false,
    searchText: "",
    sortTitle: false,

  }

  const [state, dispatchTitle] = useReducer(stateManagementFunction, initialState)

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

      // if (sortTitle === false) {
      //   params = {
      //     ...params, 
      //     'sort[0][field]': 'title',
      //     'sort[0][direction]': 'asc',
      //   }
      // } else {
      //   params = {
      //     ...params, 
      //     'sort[0][field]': 'title',
      //     'sort[0][direction]': 'desc',
      //   }
      // }
      
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
    console.log(data);
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



  const onSearch = (searchText:string) => {
    dispatchTitle ({
      type: 'SET_SEARCH_TEXT',
      payload: {searchText},
    })
  }



  const addSpeechTodo = (newSpeechNote: Todo) => {

    fetch (url, {
      method: 'POST',
      headers: {  
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
    },
      body: JSON.stringify({fields: newSpeechNote})
    }
    )
    .then (response => response.json())
    .then(data => {
      const addSpeechNote = 
      {
       title: data.fields.title,
       id: data.id
     }
      dispatchTitle({
        type: "ADD_TODO",
        payload: {
          newTodo: addSpeechNote 
        }
    })
    })
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
        <ThemeToggle />
        <header>
        <h1>Todo List</h1>
        <div className={styles.wrap}>

        <AddTodoForm onAddTodo={addTodo} />
        <Search onSearch={onSearch}/>
        </div>
        <div className={styles.wrapSpeech}>
        <h2>Bored of writing 😶‍🌫️ Speak to me 🤗</h2>
        <SpeechText onAddSpeechTodo={addSpeechTodo}/>
        <SpeechTextUpload /> 
        </div>
        <div>
 
        </div>
        </header>

        <main>
        {state.isLoading ? <p> Loading ... </p> : 
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

    </Routes>
    </BrowserRouter>
    </div>
    </ThemeContext.Provider>
  );
}

export default App;

