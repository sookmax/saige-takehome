import { TaskFormFields } from '@/components/TaskForm'
import { APIResponse, ToDo } from '@/types/api'

export async function getTodos() {
  const { code, message, data } = (await fetch('/api/todos').then((res) =>
    res.json()
  )) as APIResponse<ToDo[]>
  if (code !== 200) {
    throw new Error(message)
  }

  return data as ToDo[]
}

export async function upsertTodo({ id, text, done, deadline }: TaskFormFields) {
  const mutationType = id !== undefined ? 'update' : 'create'

  const headers = {
    'Content-Type': 'application/json',
  }

  const body = JSON.stringify({
    text,
    done,
    deadline: deadline.getTime(),
  })

  const { code, message, data } = (
    mutationType === 'create'
      ? await fetch('/api/todos', {
          method: 'POST',
          headers,
          body,
        }).then((res) => res.json())
      : await fetch(`/api/todos/${id}`, {
          method: 'PUT',
          headers,
          body,
        }).then((res) => res.json())
  ) as APIResponse<ToDo>

  if (code !== 200) {
    throw new Error(message)
  }
  return data as ToDo
}

export async function deleteTodo(id: number) {
  const { code, message } = (await fetch(`/api/todos/${id}`, {
    method: 'DELETE',
  }).then((res) => res.json())) as APIResponse<void>

  if (code !== 200) {
    throw new Error(message)
  }

  return
}
