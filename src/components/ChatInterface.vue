<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from 'vue'
import { Send, Mic, Paperclip, Sparkles, Bot, User } from 'lucide-vue-next'

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
const isTyping = ref(false)

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
    isTyping.value = true
    setTimeout(() => {
      isTyping.value = false
    }, 2000)
    scrollToBottom()
  }
}

const startVoiceInput = () => {
  isListening.value = true
  setTimeout(() => {
    isListening.value = false
    const voiceMessage = 'Book me a flight to London next week with less than 1 layover under $500'
    emit('send-message', voiceMessage, 'voice')
    isTyping.value = true
    setTimeout(() => {
      isTyping.value = false
    }, 2000)
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
  <div
    class="glass rounded-3xl shadow-xl border border-white/20 flex flex-col h-[700px] overflow-hidden"
  >
    <!-- Chat Header -->
    <div class="p-6 border-b border-white/10">
      <div class="flex items-center space-x-4">
        <div class="relative">
          <div
            class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
          >
            <Bot class="w-6 h-6 text-white" />
          </div>
          <div
            class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"
          ></div>
        </div>
        <div>
          <h3 class="font-bold text-slate-900 text-lg">{{ assistantName }}</h3>
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p class="text-sm text-green-600 font-medium">Online & Ready</p>
          </div>
        </div>
        <div class="ml-auto">
          <Sparkles class="w-5 h-5 text-slate-400" />
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-6">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="['flex', message.sender === 'user' ? 'justify-end' : 'justify-start']"
      >
        <div
          :class="['max-w-xs lg:max-w-md group', message.sender === 'user' ? 'order-2' : 'order-1']"
        >
          <!-- Avatar -->
          <div
            :class="[
              'flex items-end space-x-3',
              message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : '',
            ]"
          >
            <div
              :class="[
                'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md',
                message.sender === 'user'
                  ? 'bg-gradient-to-br from-slate-600 to-slate-800'
                  : 'bg-gradient-to-br from-blue-500 to-purple-600',
              ]"
            >
              <User v-if="message.sender === 'user'" class="w-4 h-4 text-white" />
              <Bot v-else class="w-4 h-4 text-white" />
            </div>

            <!-- Message Bubble -->
            <div
              :class="[
                'px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:shadow-xl',
                message.sender === 'user'
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                  : 'glass border border-white/20 text-slate-800',
              ]"
            >
              <div
                v-if="message.type === 'voice'"
                class="flex items-center space-x-2 mb-2 opacity-80"
              >
                <Mic class="w-3 h-3" />
                <span class="text-xs font-medium">Voice message</span>
              </div>
              <p class="text-sm leading-relaxed">{{ message.text }}</p>
              <p
                :class="[
                  'text-xs mt-2 opacity-70',
                  message.sender === 'user' ? 'text-blue-100' : 'text-slate-500',
                ]"
              >
                {{ formatTime(message.timestamp) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Typing indicator -->
      <div v-if="isTyping" class="flex justify-start">
        <div class="flex items-end space-x-3">
          <div
            class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md"
          >
            <Bot class="w-4 h-4 text-white" />
          </div>
          <div class="glass border border-white/20 px-4 py-3 rounded-2xl max-w-xs">
            <div class="flex items-center space-x-2">
              <div class="flex space-x-1">
                <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div
                  class="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style="animation-delay: 0.1s"
                ></div>
                <div
                  class="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style="animation-delay: 0.2s"
                ></div>
              </div>
              <span class="text-sm text-slate-600">AI is thinking...</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Listening indicator -->
      <div v-if="isListening" class="flex justify-end">
        <div class="flex items-end space-x-3 flex-row-reverse space-x-reverse">
          <div
            class="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center shadow-md"
          >
            <User class="w-4 h-4 text-white" />
          </div>
          <div
            class="bg-gradient-to-br from-red-500 to-pink-600 text-white px-4 py-3 rounded-2xl max-w-xs shadow-lg"
          >
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-red-200 rounded-full animate-pulse"></div>
              <span class="text-sm font-medium">Listening...</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="p-6 border-t border-white/10">
      <div class="flex items-center space-x-3">
        <button
          class="p-3 text-slate-500 hover:text-slate-700 hover:bg-white/50 rounded-xl transition-all duration-300"
        >
          <Paperclip class="w-5 h-5" />
        </button>

        <div class="flex-1 relative">
          <input
            v-model="messageInput"
            @keypress.enter="sendMessage"
            type="text"
            :placeholder="placeholder"
            class="w-full px-4 py-3 bg-white/50 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/80 transition-all duration-300 placeholder-slate-400"
          />
        </div>

        <button
          @click="startVoiceInput"
          :class="[
            'p-3 rounded-xl transition-all duration-300 shadow-lg',
            isListening
              ? 'bg-gradient-to-br from-red-500 to-pink-600 text-white animate-pulse shadow-red-500/25'
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/50',
          ]"
        >
          <Mic class="w-5 h-5" />
        </button>

        <button
          @click="sendMessage"
          :disabled="!messageInput.trim()"
          :class="[
            'p-3 rounded-xl transition-all duration-300 shadow-lg',
            messageInput.trim()
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:shadow-blue-500/25 transform hover:scale-105'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed',
          ]"
        >
          <Send class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>
