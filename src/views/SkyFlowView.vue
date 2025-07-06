<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useSkyFlowStore } from '@/stores/skyflow'
import ChatInterface from '@/components/ChatInterface.vue'
import TripPlanning from '@/components/TripPlanning.vue'
import { ArrowLeft, Plane, AlertTriangle, Clock } from 'lucide-vue-next'

const router = useRouter()
const appStore = useAppStore()
const skyflowStore = useSkyFlowStore()

const activeTab = ref('chat')

const currentTrip = computed(() => skyflowStore.currentTrip)
const tripHistory = computed(() => skyflowStore.tripHistory)

onMounted(() => {
  // Add welcome message if no messages exist for SkyFlow
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

  // Simulate AI response
  setTimeout(() => {
    let response = ''

    if (message.toLowerCase().includes('london') || message.toLowerCase().includes('europe')) {
      response =
        "Great! I found flights to London starting from $450. For a 3-stop European trip, I recommend London → Paris → Amsterdam. ⚠️ Visa Alert: You'll need a UK visa and Schengen visa. Would you like me to show you the complete itinerary with hotels?"

      // Create a sample trip
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
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center h-16">
          <button @click="router.push('/')" class="p-2 rounded-full hover:bg-gray-100 mr-4">
            <ArrowLeft class="w-6 h-6 text-gray-600" />
          </button>
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plane class="w-5 h-5 text-blue-600" />
            </div>
            <h1 class="text-xl font-bold text-gray-900">SkyFlow</h1>
          </div>
        </div>
      </div>
    </header>

    <!-- Tabs -->
    <div class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex space-x-8">
          <button
            @click="activeTab = 'chat'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'chat'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            Chat & Plan
          </button>
          <button
            @click="activeTab = 'trips'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'trips'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            Trip Planning
          </button>
        </nav>
      </div>
    </div>

    <!-- Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Chat Tab -->
      <div v-if="activeTab === 'chat'" class="space-y-6">
        <!-- Current Trip Summary -->
        <div v-if="currentTrip" class="bg-white rounded-xl shadow-sm border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Current Trip</h3>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Plane class="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ currentTrip.destination }}</p>
                <p class="text-sm text-gray-500">Trip #{{ currentTrip.id.slice(-6) }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold text-gray-900">
                ${{ currentTrip.totalCost.toLocaleString() }}
              </p>
              <div class="flex items-center text-sm text-gray-500">
                <Clock class="w-4 h-4 mr-1" />
                {{ currentTrip.departureDate }}
              </div>
            </div>
          </div>

          <!-- Visa Warnings -->
          <div
            v-if="currentTrip.visaRequired && currentTrip.visaRequired.length > 0"
            class="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
          >
            <div class="flex items-center">
              <AlertTriangle class="w-5 h-5 text-yellow-600 mr-2" />
              <span class="text-sm font-medium text-yellow-800">Visa Required:</span>
            </div>
            <p class="text-sm text-yellow-700 mt-1">
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
