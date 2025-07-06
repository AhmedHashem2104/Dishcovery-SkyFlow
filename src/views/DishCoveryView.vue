<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useDishcoveryStore } from '@/stores/dishcovery'
import ChatInterface from '@/components/ChatInterface.vue'
import OrderTracking from '@/components/OrderTracking.vue'
import { ArrowLeft, Utensils, Clock } from 'lucide-vue-next'

const router = useRouter()
const appStore = useAppStore()
const dishcoveryStore = useDishcoveryStore()

const activeTab = ref('chat')

const currentOrder = computed(() => dishcoveryStore.currentOrder)
const orderHistory = computed(() => dishcoveryStore.orderHistory)

onMounted(() => {
  // Add welcome message if no messages exist
  if (appStore.messages.length === 0) {
    appStore.addMessage({
      id: Date.now().toString(),
      text: "Hi! I'm your Dishcovery assistant. I can help you order food for groups, track deliveries, and find great restaurants. What would you like to eat today?",
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

    if (message.toLowerCase().includes('jollof') || message.toLowerCase().includes('rice')) {
      response =
        'Great choice! I found several restaurants serving jollof rice. Lagos Kitchen has excellent reviews and can deliver by 7 PM. Would you like me to place an order for jollof rice and 3 Coke bottles for your group?'

      // Create a sample order
      dishcoveryStore.createOrder({
        id: Date.now().toString(),
        restaurant: 'Lagos Kitchen',
        items: [
          { name: 'Jollof Rice', quantity: 1, price: 2500 },
          { name: 'Coca Cola', quantity: 3, price: 500 },
        ],
        total: 4000,
        deliveryTime: '7:00 PM',
        status: 'pending',
      })
    } else if (message.toLowerCase().includes('confirm') || message.toLowerCase().includes('yes')) {
      response =
        "Perfect! I've placed your order with Lagos Kitchen. Order #DH001 for jollof rice and 3 Coke bottles. Total: ₦4,000. Estimated delivery: 7:00 PM. You can track your order in the tracking tab."

      if (currentOrder.value) {
        dishcoveryStore.updateOrderStatus(currentOrder.value.id, 'confirmed')
      }
    } else if (message.toLowerCase().includes('track')) {
      response =
        "Let me check your order status... Your order #DH001 is being prepared at Lagos Kitchen. Estimated delivery time is 7:00 PM. I'll notify you when it's out for delivery!"
    } else {
      response =
        "I can help you with food orders, restaurant recommendations, and delivery tracking. Try saying something like 'I want pizza for 4 people' or 'Track my order'."
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
            <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Utensils class="w-5 h-5 text-orange-600" />
            </div>
            <h1 class="text-xl font-bold text-gray-900">Dishcovery</h1>
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
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            Chat & Order
          </button>
          <button
            @click="activeTab = 'tracking'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'tracking'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            Order Tracking
          </button>
        </nav>
      </div>
    </div>

    <!-- Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Chat Tab -->
      <div v-if="activeTab === 'chat'" class="space-y-6">
        <!-- Current Order Summary -->
        <div v-if="currentOrder" class="bg-white rounded-xl shadow-sm border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Current Order</h3>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Utensils class="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ currentOrder.restaurant }}</p>
                <p class="text-sm text-gray-500">Order #{{ currentOrder.id.slice(-6) }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold text-gray-900">₦{{ currentOrder.total.toLocaleString() }}</p>
              <div class="flex items-center text-sm text-gray-500">
                <Clock class="w-4 h-4 mr-1" />
                {{ currentOrder.deliveryTime }}
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Interface -->
        <ChatInterface
          :messages="appStore.messages"
          @send-message="handleSendMessage"
          placeholder="Ask me to order food, track delivery, or find restaurants..."
          assistant-name="Dishcovery Assistant"
        />
      </div>

      <!-- Tracking Tab -->
      <div v-if="activeTab === 'tracking'">
        <OrderTracking :current-order="currentOrder" :order-history="orderHistory" />
      </div>
    </main>
  </div>
</template>
