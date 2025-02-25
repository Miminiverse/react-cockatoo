import {Todo} from '@root/types'

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
    | { type: 'REMOVE_TODO'; payload: {id: number | undefined}}
  
  

export const stateManagementFunction = (previousState: State, action: Action): State => {
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

export const initialState = {
    todoList: [],
    isLoading: true,
    isError: false,
    searchText: "",
    sortTitle: false,

  }