<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import {
  Mic,
  MessageCircle,
  Utensils,
  Plane,
  User,
  QrCode,
  Sparkles,
  Zap,
  Globe,
  Star,
} from 'lucide-vue-next'

const router = useRouter()
const appStore = useAppStore()
const isListening = ref(false)

const startVoiceInput = () => {
  isListening.value = true
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

const features = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Instant responses powered by advanced AI' },
  { icon: Globe, title: 'Global Reach', desc: 'Order food and book flights worldwide' },
  {
    icon: Star,
    title: 'Smart Recommendations',
    desc: 'Personalized suggestions based on your preferences',
  },
]
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden"
  >
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl float"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl float"
        style="animation-delay: -3s"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl float"
        style="animation-delay: -1.5s"
      ></div>
    </div>

    <!-- Header -->
    <header class="glass sticky top-0 z-50 border-b border-white/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-3">
            <div class="relative">
              <div
                class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <Sparkles class="w-5 h-5 text-white" />
              </div>
              <div
                class="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"
              ></div>
            </div>
            <div>
              <h1 class="text-xl font-bold gradient-text">Dishcovery × SkyFlow</h1>
              <p class="text-xs text-slate-500">AI-Powered Assistant</p>
            </div>
          </div>
          <button
            @click="navigateTo('/profile')"
            class="p-2.5 rounded-xl hover:bg-white/50 transition-all duration-300 group"
          >
            <User class="w-5 h-5 text-slate-600 group-hover:text-slate-800" />
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <div
          class="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-sm font-medium text-slate-700 mb-6"
        >
          <Sparkles class="w-4 h-4 mr-2" />
          Powered by Advanced AI
        </div>

        <h2 class="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Your AI-Powered
          <span class="gradient-text block">Assistant</span>
        </h2>

        <p class="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Order food, book flights, and manage your travel - all with natural voice commands and
          intelligent conversations
        </p>

        <!-- Voice Input Button -->
        <div class="mb-16">
          <div class="relative inline-block">
            <button
              @click="startVoiceInput"
              :class="[
                'relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 transform',
                isListening
                  ? 'bg-gradient-to-br from-red-500 to-pink-600 shadow-2xl scale-110 pulse-glow'
                  : 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl hover:shadow-2xl hover:scale-105',
              ]"
            >
              <Mic class="w-8 h-8 text-white" />

              <!-- Listening rings -->
              <div v-if="isListening" class="absolute inset-0">
                <div
                  class="absolute inset-0 rounded-full border-4 border-red-300 animate-ping opacity-75"
                ></div>
                <div
                  class="absolute inset-2 rounded-full border-2 border-red-200 animate-ping opacity-50"
                  style="animation-delay: 0.5s"
                ></div>
              </div>
            </button>

            <!-- Floating particles -->
            <div v-if="!isListening" class="absolute inset-0 pointer-events-none">
              <div
                class="absolute -top-2 -right-2 w-2 h-2 bg-blue-400 rounded-full animate-bounce opacity-60"
              ></div>
              <div
                class="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce opacity-60"
                style="animation-delay: 0.3s"
              ></div>
              <div
                class="absolute top-0 -left-4 w-1 h-1 bg-indigo-400 rounded-full animate-bounce opacity-60"
                style="animation-delay: 0.6s"
              ></div>
            </div>
          </div>

          <p class="mt-6 text-lg font-medium text-slate-700">
            {{ isListening ? 'Listening...' : 'Tap to speak' }}
          </p>
          <p class="text-sm text-slate-500 mt-2">
            {{
              isListening
                ? 'Say something like "Order jollof rice for 4 people"'
                : 'Try: "Book me a flight to London"'
            }}
          </p>
        </div>
      </div>

      <!-- Features -->
      <div class="grid md:grid-cols-3 gap-8 mb-16">
        <div
          v-for="(feature, index) in features"
          :key="feature.title"
          class="text-center group"
          :style="{ animationDelay: `${index * 0.2}s` }"
        >
          <div
            class="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
          >
            <component :is="feature.icon" class="w-8 h-8 text-slate-600" />
          </div>
          <h3 class="text-lg font-semibold text-slate-900 mb-2">{{ feature.title }}</h3>
          <p class="text-slate-600">{{ feature.desc }}</p>
        </div>
      </div>

      <!-- Service Cards -->
      <div class="grid md:grid-cols-2 gap-8 mb-16">
        <!-- Dishcovery Card -->
        <div @click="navigateTo('/dishcovery')" class="group cursor-pointer">
          <div
            class="glass rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20"
          >
            <div class="flex items-center mb-6">
              <div
                class="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
              >
                <Utensils class="w-7 h-7 text-white" />
              </div>
              <div class="ml-4">
                <h3 class="text-2xl font-bold text-slate-900">Dishcovery</h3>
                <p class="text-sm text-slate-500">Food & Dining AI</p>
              </div>
            </div>

            <p class="text-slate-600 mb-6 leading-relaxed">
              Order group meals, track deliveries, and discover new restaurants with AI
              recommendations tailored to your taste
            </p>

            <div class="space-y-3">
              <div class="flex items-center text-sm text-slate-600">
                <div
                  class="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mr-3"
                ></div>
                Voice-powered ordering system
              </div>
              <div class="flex items-center text-sm text-slate-600">
                <div
                  class="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full mr-3"
                ></div>
                Real-time delivery tracking
              </div>
              <div class="flex items-center text-sm text-slate-600">
                <div
                  class="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mr-3"
                ></div>
                Smart group meal coordination
              </div>
            </div>

            <div
              class="mt-6 flex items-center text-orange-600 font-medium group-hover:text-orange-700"
            >
              <span>Explore Dishcovery</span>
              <svg
                class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- SkyFlow Card -->
        <div @click="navigateTo('/skyflow')" class="group cursor-pointer">
          <div
            class="glass rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20"
          >
            <div class="flex items-center mb-6">
              <div
                class="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
              >
                <Plane class="w-7 h-7 text-white" />
              </div>
              <div class="ml-4">
                <h3 class="text-2xl font-bold text-slate-900">SkyFlow</h3>
                <p class="text-sm text-slate-500">Travel & Flight AI</p>
              </div>
            </div>

            <p class="text-slate-600 mb-6 leading-relaxed">
              Plan multi-stop trips, get visa warnings, and chat with airline agents in real-time
              for seamless travel
            </p>

            <div class="space-y-3">
              <div class="flex items-center text-sm text-slate-600">
                <div
                  class="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full mr-3"
                ></div>
                Intelligent multi-stop planning
              </div>
              <div class="flex items-center text-sm text-slate-600">
                <div
                  class="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mr-3"
                ></div>
                Predictive visa & fee warnings
              </div>
              <div class="flex items-center text-sm text-slate-600">
                <div
                  class="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mr-3"
                ></div>
                Live airline agent chat
              </div>
            </div>

            <div class="mt-6 flex items-center text-blue-600 font-medium group-hover:text-blue-700">
              <span>Explore SkyFlow</span>
              <svg
                class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="glass rounded-3xl p-8 border border-white/20">
        <h3 class="text-2xl font-bold text-slate-900 mb-8 text-center">Quick Actions</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <button
            @click="navigateTo('/dishcovery')"
            class="group flex flex-col items-center p-6 rounded-2xl hover:bg-white/50 transition-all duration-300 transform hover:scale-105"
          >
            <div
              class="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg"
            >
              <MessageCircle class="w-6 h-6 text-white" />
            </div>
            <span class="text-sm font-semibold text-slate-700 group-hover:text-slate-900"
              >Order Food</span
            >
          </button>

          <button
            @click="navigateTo('/skyflow')"
            class="group flex flex-col items-center p-6 rounded-2xl hover:bg-white/50 transition-all duration-300 transform hover:scale-105"
          >
            <div
              class="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg"
            >
              <Plane class="w-6 h-6 text-white" />
            </div>
            <span class="text-sm font-semibold text-slate-700 group-hover:text-slate-900"
              >Book Flight</span
            >
          </button>

          <button
            @click="navigateTo('/qr-scanner')"
            class="group flex flex-col items-center p-6 rounded-2xl hover:bg-white/50 transition-all duration-300 transform hover:scale-105"
          >
            <div
              class="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg"
            >
              <QrCode class="w-6 h-6 text-white" />
            </div>
            <span class="text-sm font-semibold text-slate-700 group-hover:text-slate-900"
              >QR Review</span
            >
          </button>

          <button
            @click="navigateTo('/profile')"
            class="group flex flex-col items-center p-6 rounded-2xl hover:bg-white/50 transition-all duration-300 transform hover:scale-105"
          >
            <div
              class="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg"
            >
              <User class="w-6 h-6 text-white" />
            </div>
            <span class="text-sm font-semibold text-slate-700 group-hover:text-slate-900"
              >Profile</span
            >
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
