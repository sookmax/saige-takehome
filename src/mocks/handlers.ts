import { http, HttpResponse, PathParams } from 'msw'
import { APIResponse, ToDo, ToDoRequest } from '../types/api'
import { AI_GENERATED_TODO_TITLES } from '@/lib/const'

const apiWrapper = <T>(data: T, code = 200, message = ''): APIResponse<T> => {
  return {
    code,
    message,
    data,
  }
}

const fetchToDos = (): ToDo[] => {
  try {
    return JSON.parse(localStorage.getItem('todos') ?? '[]')
  } catch (error) {
    // clear & set new data
    localStorage.setItem('todos', '[]')
    return []
  }
}

const setToDos = (todos: ToDo[]) => {
  localStorage.setItem('todos', JSON.stringify(todos))
}

const getToDo = (id: number) => {
  const todos = fetchToDos()
  return todos.find((todo) => todo.id === id)
}

const INITIAL_TODOS: ToDo[] = []
for (let i = 0; i < AI_GENERATED_TODO_TITLES.length; i++) {
  INITIAL_TODOS.push({
    id: i,
    text: AI_GENERATED_TODO_TITLES[i],
    deadline:
      i < 10
        ? Date.now() - 86400000 * (i % 5)
        : i < 40
        ? Date.now() + 86400000 * (i % 3)
        : Date.now() + 86400000 * (i % 50),
    done: i % 2 === 0,
  })
}

setToDos(INITIAL_TODOS)

export const handlers = [
  http.get('/api/todos', () => {
    return HttpResponse.json(apiWrapper<ToDo[]>(fetchToDos()))
  }),
  http.post<PathParams, ToDoRequest>('/api/todos', async ({ request }) => {
    const todos: ToDo[] = fetchToDos()
    const payload: ToDoRequest = await request.json()
    const newId = todos.length ? Math.max(...todos.map(({ id }) => id)) + 1 : 1
    const newToDo = {
      id: newId,
      ...payload,
    }
    todos.push(newToDo)
    setToDos(todos)
    return HttpResponse.json(apiWrapper<ToDo>(newToDo))
  }),
  http.get<PathParams<'id'>>('/api/todos/:id', ({ params }) => {
    return HttpResponse.json(
      apiWrapper<ToDo | undefined>(getToDo(Number(params.id)))
    )
  }),
  http.put<PathParams<'id'>, ToDoRequest>(
    '/api/todos/:id',
    async ({ params, request }) => {
      const todos: ToDo[] = fetchToDos()
      const payload: ToDoRequest = await request.json()
      const index = todos.findIndex((todo) => todo.id === Number(params.id))
      if (index < 0) {
        return HttpResponse.json(apiWrapper<void>(undefined, 404, 'Not Found'))
      } else {
        const updatedToDo: ToDo = {
          id: Number(params.id),
          ...payload,
        }
        todos[index] = updatedToDo
        setToDos(todos)
        return HttpResponse.json(apiWrapper<ToDo>(updatedToDo))
      }
    }
  ),
  http.delete<PathParams<'id'>>('/api/todos/:id', async ({ params }) => {
    const todos: ToDo[] = fetchToDos()
    const index = todos.findIndex((todo) => todo.id === Number(params.id))
    if (index < 0) {
      return HttpResponse.json(apiWrapper<void>(undefined, 404, 'Not Found'))
    } else {
      todos.splice(index, 1)
      setToDos(todos)
      return HttpResponse.json(apiWrapper<void>(undefined))
    }
  }),
]
