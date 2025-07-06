<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useDishcoveryStore } from '@/stores/dishcovery'
import ChatInterface from '@/components/ChatInterface.vue'
import OrderTracking from '@/components/OrderTracking.vue'
import { ArrowLeft, Utensils, Clock, Sparkles, MessageSquare, Package } from 'lucide-vue-next'

const router = useRouter()
const appStore = useAppStore()
const dishcoveryStore = useDishcoveryStore()

const activeTab = ref('chat')

const currentOrder = computed(() => dishcoveryStore.currentOrder)
const orderHistory = computed(() => dishcoveryStore.orderHistory)

onMounted(() => {
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

  setTimeout(() => {
    let response = ''

    if (message.toLowerCase().includes('jollof') || message.toLowerCase().includes('rice')) {
      response =
        'Great choice! I found several restaurants serving jollof rice. Lagos Kitchen has excellent reviews and can deliver by 7 PM. Would you like me to place an order for jollof rice and 3 Coke bottles for your group?'

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
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 relative overflow-hidden"
  >
    <!-- Animated background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-red-600/20 rounded-full blur-3xl float"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-orange-600/20 rounded-full blur-3xl float"
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
              class="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Utensils class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-slate-900">Dishcovery</h1>
              <p class="text-xs text-slate-500">Food & Dining AI</p>
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
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
            ]"
          >
            <MessageSquare class="w-4 h-4" />
            <span>Chat & Order</span>
          </button>
          <button
            @click="activeTab = 'tracking'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 flex items-center space-x-2',
              activeTab === 'tracking'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
            ]"
          >
            <Package class="w-4 h-4" />
            <span>Order Tracking</span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <!-- Chat Tab -->
      <div v-if="activeTab === 'chat'" class="space-y-8">
        <!-- Current Order Summary -->
        <div v-if="currentOrder" class="glass rounded-3xl shadow-xl border border-white/20 p-8">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <h3 class="text-xl font-bold text-slate-900">Active Order</h3>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div
                class="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Utensils class="w-8 h-8 text-white" />
              </div>
              <div>
                <p class="font-bold text-slate-900 text-lg">{{ currentOrder.restaurant }}</p>
                <p class="text-sm text-slate-500">Order #{{ currentOrder.id.slice(-6) }}</p>
                <div class="flex items-center mt-1">
                  <div class="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                  <span class="text-xs text-orange-600 font-medium">In Progress</span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-slate-900 text-xl">
                ₦{{ currentOrder.total.toLocaleString() }}
              </p>
              <div class="flex items-center text-sm text-slate-500 mt-1">
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
