import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Message {
  id: string
  text: string
  sender: 'user' | 'assistant'
  timestamp: Date
  type: 'text' | 'voice'
}

export const useAppStore = defineStore('app', () => {
  const messages = ref<Message[]>([])
  const isLoading = ref(false)

  const addMessage = (message: Message) => {
    messages.value.push(message)
  }

  const clearMessages = () => {
    messages.value = []
  }

  const initializeApp = () => {
    // Initialize app state
    console.log('App initialized')
  }

  return {
    messages,
    isLoading,
    addMessage,
    clearMessages,
    initializeApp,
  }
})
