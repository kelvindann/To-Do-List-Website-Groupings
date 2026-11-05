import { useStore } from 'zustand'
import { createTodoStore } from '../store.js'

const todoStore = createTodoStore()

export default function useTodoStore(selector) {
  return useStore(todoStore, selector)
}
