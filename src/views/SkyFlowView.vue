<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useSkyFlowStore } from '@/stores/skyflow'
import ChatInterface from '@/components/ChatInterface.vue'
import TripPlanning from '@/components/TripPlanning.vue'
import {
  ArrowLeft,
  Plane,
  AlertTriangle,
  Clock,
  Sparkles,
  MessageSquare,
  MapPin,
} from 'lucide-vue-next'

const router = useRouter()
const appStore = useAppStore()
const skyflowStore = useSkyFlowStore()

const activeTab = ref('chat')

const currentTrip = computed(() => skyflowStore.currentTrip)
const tripHistory = computed(() => skyflowStore.tripHistory)

onMounted(() => {
  if (appStore.messages.length === 0) {
    appStore.addMessage({
      id: Date.now().toString(),
      text: "Welcome to SkyFlow! I'm your travel assistant. I can help you plan multi-stop trips, book flights and hotels, and provide visa warnings. Where would you like to go?",
      sender: 'assistant',
      timestamp: new Date(),
      type: 'text',
    })
  }
})

const handleSendMessage = (message: string, type: 'text' | 'voice' = 'text') => {
  appStore.addMessage({
    id: Date.now().toString(),
    text: message,
    sender: 'user',
    timestamp: new Date(),
    type,
  })

  setTimeout(() => {
    let response = ''

    if (message.toLowerCase().includes('london') || message.toLowerCase().includes('europe')) {
      response =
        "Great! I found flights to London starting from $450. For a 3-stop European trip, I recommend London → Paris → Amsterdam. ⚠️ Visa Alert: You'll need a UK visa and Schengen visa. Would you like me to show you the complete itinerary with hotels?"

      skyflowStore.createTrip({
        id: Date.now().toString(),
        destination: 'London, Paris, Amsterdam',
        departureDate: '2024-07-15',
        returnDate: '2024-07-25',
        stops: [
          { city: 'London', country: 'UK', duration: 4 },
          { city: 'Paris', country: 'France', duration: 3 },
          { city: 'Amsterdam', country: 'Netherlands', duration: 3 },
        ],
        totalCost: 1250,
        status: 'planning',
        visaRequired: ['UK Visa', 'Schengen Visa'],
      })
    } else if (
      message.toLowerCase().includes('book') ||
      message.toLowerCase().includes('confirm')
    ) {
      response =
        "Perfect! I'm booking your European adventure. Trip #SF001: London → Paris → Amsterdam (10 days). Total cost: $1,250. I've also set up visa reminders and will monitor flight prices for any changes. Check the trip planning tab for details!"

      if (currentTrip.value) {
        skyflowStore.updateTripStatus(currentTrip.value.id, 'booked')
      }
    } else if (message.toLowerCase().includes('visa')) {
      response =
        "Based on your trip to Europe, you'll need: 1) UK Visa (£95, 15 days processing) 2) Schengen Visa (€80, 10 days processing). I recommend applying for the UK visa first. Would you like me to guide you through the application process?"
    } else if (
      message.toLowerCase().includes('cancel') ||
      message.toLowerCase().includes('flight')
    ) {
      response =
        "⚠️ Flight Alert: Your London flight LH441 has been delayed by 2 hours due to weather. I've automatically rebooked your connecting flight and notified the hotel. No additional charges. Your new arrival time is 8:30 PM."
    } else {
      response =
        "I can help you plan trips, book flights and hotels, provide visa information, and handle travel disruptions. Try saying 'Plan a trip to Tokyo' or 'Do I need a visa for Thailand?'"
    }

    appStore.addMessage({
      id: Date.now().toString(),
      text: response,
      sender: 'assistant',
      timestamp: new Date(),
      type: 'text',
    })
  }, 1000)
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden"
  >
    <!-- Animated background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl float"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl float"
        style="animation-delay: -3s"
      ></div>
    </div>

    <!-- Header -->
    <header class="glass sticky top-0 z-50 border-b border-white/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center h-16">
          <button
            @click="router.push('/')"
            class="p-2.5 rounded-xl hover:bg-white/50 transition-all duration-300 mr-4 group"
          >
            <ArrowLeft class="w-5 h-5 text-slate-600 group-hover:text-slate-800" />
          </button>
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Plane class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-slate-900">SkyFlow</h1>
              <p class="text-xs text-slate-500">Travel & Flight AI</p>
            </div>
          </div>
          <div class="ml-auto">
            <Sparkles class="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>
    </header>

    <!-- Tabs -->
    <div class="glass border-b border-white/10 sticky top-16 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex space-x-8">
          <button
            @click="activeTab = 'chat'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 flex items-center space-x-2',
              activeTab === 'chat'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
            ]"
          >
            <MessageSquare class="w-4 h-4" />
            <span>Chat & Plan</span>
          </button>
          <button
            @click="activeTab = 'trips'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 flex items-center space-x-2',
              activeTab === 'trips'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
            ]"
          >
            <MapPin class="w-4 h-4" />
            <span>Trip Planning</span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <!-- Chat Tab -->
      <div v-if="activeTab === 'chat'" class="space-y-8">
        <!-- Current Trip Summary -->
        <div v-if="currentTrip" class="glass rounded-3xl shadow-xl border border-white/20 p-8">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <h3 class="text-xl font-bold text-slate-900">Current Trip</h3>
          </div>

          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-4">
              <div
                class="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Plane class="w-8 h-8 text-white" />
              </div>
              <div>
                <p class="font-bold text-slate-900 text-lg">{{ currentTrip.destination }}</p>
                <p class="text-sm text-slate-500">Trip #{{ currentTrip.id.slice(-6) }}</p>
                <div class="flex items-center mt-1">
                  <div class="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                  <span class="text-xs text-blue-600 font-medium capitalize">{{
                    currentTrip.status
                  }}</span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-slate-900 text-xl">
                ${{ currentTrip.totalCost.toLocaleString() }}
              </p>
              <div class="flex items-center text-sm text-slate-500 mt-1">
                <Clock class="w-4 h-4 mr-1" />
                {{ currentTrip.departureDate }}
              </div>
            </div>
          </div>

          <!-- Visa Warnings -->
          <div
            v-if="currentTrip.visaRequired && currentTrip.visaRequired.length > 0"
            class="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200/50"
          >
            <div class="flex items-center mb-2">
              <AlertTriangle class="w-5 h-5 text-yellow-600 mr-2" />
              <span class="text-sm font-bold text-yellow-800">Visa Requirements</span>
            </div>
            <p class="text-sm text-yellow-700">
              {{ currentTrip.visaRequired.join(', ') }}
            </p>
          </div>
        </div>

        <!-- Chat Interface -->
        <ChatInterface
          :messages="appStore.messages"
          @send-message="handleSendMessage"
          placeholder="Plan a trip, book flights, or ask about visa requirements..."
          assistant-name="SkyFlow Assistant"
        />
      </div>

      <!-- Trip Planning Tab -->
      <div v-if="activeTab === 'trips'">
        <TripPlanning :current-trip="currentTrip" :trip-history="tripHistory" />
      </div>
    </main>
  </div>
</template>
