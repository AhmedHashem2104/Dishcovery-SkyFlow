<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from 'vue'
import { Send, Mic, Paperclip } from 'lucide-vue-next'

interface Message {
  id: string
  text: string
  sender: 'user' | 'assistant'
  timestamp: Date
  type: 'text' | 'voice'
}

interface Props {
  messages: Message[]
  placeholder?: string
  assistantName?: string
}

interface Emits {
  (e: 'send-message', message: string, type: 'text' | 'voice'): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Type your message...',
  assistantName: 'AI Assistant',
})

const emit = defineEmits<Emits>()

const messageInput = ref('')
const messagesContainer = ref<HTMLElement>()
const isListening = ref(false)

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const sendMessage = () => {
  if (messageInput.value.trim()) {
    emit('send-message', messageInput.value.trim(), 'text')
    messageInput.value = ''
    scrollToBottom()
  }
}

const startVoiceInput = () => {
  isListening.value = true
  // Simulate voice input
  setTimeout(() => {
    isListening.value = false
    const voiceMessage = 'Book me a flight to London next week with less than 1 layover under $500'
    emit('send-message', voiceMessage, 'voice')
    scrollToBottom()
  }, 2000)
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

watch(
  () => props.messages.length,
  () => {
    scrollToBottom()
  },
)

onMounted(() => {
  scrollToBottom()
})
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border flex flex-col h-[600px]">
    <!-- Chat Header -->
    <div class="p-4 border-b">
      <div class="flex items-center space-x-3">
        <div
          class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
        >
          <span class="text-white text-sm font-bold">AI</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-900">{{ assistantName }}</h3>
          <p class="text-xs text-green-600">● Online</p>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="['flex', message.sender === 'user' ? 'justify-end' : 'justify-start']"
      >
        <div
          :class="[
            'max-w-xs lg:max-w-md px-4 py-2 rounded-2xl',
            message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900',
          ]"
        >
          <div class="flex items-center space-x-2 mb-1" v-if="message.type === 'voice'">
            <Mic class="w-3 h-3 opacity-70" />
            <span class="text-xs opacity-70">Voice message</span>
          </div>
          <p class="text-sm">{{ message.text }}</p>
          <p
            :class="['text-xs mt-1', message.sender === 'user' ? 'text-blue-100' : 'text-gray-500']"
          >
            {{ formatTime(message.timestamp) }}
          </p>
        </div>
      </div>

      <!-- Listening indicator -->
      <div v-if="isListening" class="flex justify-start">
        <div class="bg-red-100 text-red-800 px-4 py-2 rounded-2xl max-w-xs">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span class="text-sm">Listening...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="p-4 border-t">
      <div class="flex items-center space-x-2">
        <button class="p-2 text-gray-500 hover:text-gray-700 transition-colors">
          <Paperclip class="w-5 h-5" />
        </button>

        <div class="flex-1 relative">
          <input
            v-model="messageInput"
            @keypress.enter="sendMessage"
            type="text"
            :placeholder="placeholder"
            class="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          @click="startVoiceInput"
          :class="[
            'p-2 rounded-full transition-colors',
            isListening
              ? 'bg-red-500 text-white animate-pulse'
              : 'text-gray-500 hover:text-gray-700',
          ]"
        >
          <Mic class="w-5 h-5" />
        </button>

        <button
          @click="sendMessage"
          :disabled="!messageInput.trim()"
          :class="[
            'p-2 rounded-full transition-colors',
            messageInput.trim()
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed',
          ]"
        >
          <Send class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>
