<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { Mic, MessageCircle, Utensils, Plane, User, QrCode } from 'lucide-vue-next'

const router = useRouter()
const appStore = useAppStore()
const isListening = ref(false)

const startVoiceInput = () => {
  isListening.value = true
  // Simulate voice input
  setTimeout(() => {
    isListening.value = false
    appStore.addMessage({
      id: Date.now().toString(),
      text: 'I want to order jollof rice and 3 Coke bottles for 7 PM',
      sender: 'user',
      timestamp: new Date(),
      type: 'voice',
    })
    router.push('/dishcovery')
  }, 2000)
}

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-2">
            <div
              class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
            >
              <span class="text-white font-bold text-sm">DS</span>
            </div>
            <h1 class="text-xl font-bold text-gray-900">Dishcovery × SkyFlow</h1>
          </div>
          <button @click="navigateTo('/profile')" class="p-2 rounded-full hover:bg-gray-100">
            <User class="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Your AI-Powered Assistant</h2>
        <p class="text-lg text-gray-600 mb-8">
          Order food, book flights, and manage your travel - all with voice commands
        </p>

        <!-- Voice Input Button -->
        <div class="mb-8">
          <button
            @click="startVoiceInput"
            :class="[
              'relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300',
              isListening
                ? 'bg-red-500 shadow-lg scale-110 animate-pulse'
                : 'bg-blue-500 hover:bg-blue-600 shadow-md hover:scale-105',
            ]"
          >
            <Mic class="w-8 h-8 text-white" />
            <div
              v-if="isListening"
              class="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"
            ></div>
          </button>
          <p class="mt-3 text-sm text-gray-600">
            {{ isListening ? 'Listening...' : 'Tap to speak' }}
          </p>
        </div>
      </div>

      <!-- Service Cards -->
      <div class="grid md:grid-cols-2 gap-8 mb-12">
        <!-- Dishcovery Card -->
        <div
          @click="navigateTo('/dishcovery')"
          class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
        >
          <div class="p-8">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Utensils class="w-6 h-6 text-orange-600" />
              </div>
              <h3 class="text-2xl font-bold text-gray-900 ml-4">Dishcovery</h3>
            </div>
            <p class="text-gray-600 mb-6">
              Order group meals, track deliveries, and discover new restaurants with AI
              recommendations
            </p>
            <div class="space-y-3">
              <div class="flex items-center text-sm text-gray-500">
                <div class="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                Voice-powered ordering
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <div class="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                Real-time tracking
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <div class="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                Group meal coordination
              </div>
            </div>
          </div>
        </div>

        <!-- SkyFlow Card -->
        <div
          @click="navigateTo('/skyflow')"
          class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
        >
          <div class="p-8">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Plane class="w-6 h-6 text-blue-600" />
              </div>
              <h3 class="text-2xl font-bold text-gray-900 ml-4">SkyFlow</h3>
            </div>
            <p class="text-gray-600 mb-6">
              Plan multi-stop trips, get visa warnings, and chat with airline agents in real-time
            </p>
            <div class="space-y-3">
              <div class="flex items-center text-sm text-gray-500">
                <div class="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                Multi-stop trip planning
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <div class="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                Predictive fee warnings
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <div class="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                Live agent chat
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <h3 class="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            @click="navigateTo('/dishcovery')"
            class="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <MessageCircle class="w-8 h-8 text-orange-500 mb-2" />
            <span class="text-sm font-medium text-gray-700">Order Food</span>
          </button>
          <button
            @click="navigateTo('/skyflow')"
            class="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Plane class="w-8 h-8 text-blue-500 mb-2" />
            <span class="text-sm font-medium text-gray-700">Book Flight</span>
          </button>
          <button
            @click="navigateTo('/qr-scanner')"
            class="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <QrCode class="w-8 h-8 text-purple-500 mb-2" />
            <span class="text-sm font-medium text-gray-700">QR Review</span>
          </button>
          <button
            @click="navigateTo('/profile')"
            class="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <User class="w-8 h-8 text-green-500 mb-2" />
            <span class="text-sm font-medium text-gray-700">Profile</span>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
