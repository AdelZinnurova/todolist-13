import { createSlice, nanoid } from "@reduxjs/toolkit"

const initialState: Todolist[] = []

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState,
  reducers: (create) => ({
    deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state.splice(index, 1)
      }
    }),

    changeTodolistTitleAC: create.reducer<{ id: string; title: string }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state[index].title = action.payload.title
      }
    }),

    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),

    createTodolistAC: create.preparedReducer(
      (title: string) => {
        return { payload: { title, id: nanoid() } }
      },
      (state, action) => {
        const newTodolist: Todolist = {
          id: action.payload.id,
          title: action.payload.title,
          filter: "all",
        }
        state.push(newTodolist)
      },
    ),
  }),
})

export const todolistsReducer = todolistsSlice.reducer
export const { deleteTodolistAC, changeTodolistTitleAC, changeTodolistFilterAC, createTodolistAC } =
  todolistsSlice.actions

export type Todolist = {
  id: string
  title: string
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
