import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"

const initialState: DomainTodolist[] = []

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

    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),

    createTodolistAC: create.preparedReducer(
      (title: string) => {
        const payload: DomainTodolist = {
          title,
          id: nanoid(),
          filter: "all",
          order: 0,
          addedDate: "",
        }
        return { payload }
      },
      (state, action) => {
        state.push(action.payload)
      },
    ),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolistsTC.fulfilled, (_state, action) => {
        return action.payload.todolists.map((tl) => ({ ...tl, filter: "all" }))
      })
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state[index].title = action.payload.title
        }
      })
  },
})

export const fetchTodolistsTC = createAsyncThunk(`${todolistsSlice.name}/fetchTodolistsTC`, async (_arg, thunkAPI) => {
  const { rejectWithValue } = thunkAPI
  try {
    // 2
    const res = await todolistsApi.getTodolists()
    // 5
    return { todolists: res.data }
  } catch (err) {
    return rejectWithValue(err)
  }
})

export const changeTodolistTitleTC = createAsyncThunk(
  `${todolistsSlice.name}/changeTodolistTitleTC`,
  async (
    arg: {
      id: string
      title: string
    },
    thunkAPI,
  ) => {
    const { rejectWithValue } = thunkAPI
    try {
      await todolistsApi.changeTodolistTitle(arg)
      return arg
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)

export const todolistsReducer = todolistsSlice.reducer
export const { deleteTodolistAC, changeTodolistFilterAC, createTodolistAC } = todolistsSlice.actions

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
