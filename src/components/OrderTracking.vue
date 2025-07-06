<script setup lang="ts">
import { computed } from 'vue'
import { Clock, MapPin, CheckCircle, Truck, ChefHat, Star } from 'lucide-vue-next'

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  restaurant: string
  items: OrderItem[]
  total: number
  deliveryTime: string
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered'
  estimatedDelivery?: string
  deliveryAddress?: string
}

interface Props {
  currentOrder: Order | null
  orderHistory: Order[]
}

const props = defineProps<Props>()

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'text-yellow-600 bg-yellow-100'
    case 'confirmed':
      return 'text-blue-600 bg-blue-100'
    case 'preparing':
      return 'text-orange-600 bg-orange-100'
    case 'out_for_delivery':
      return 'text-purple-600 bg-purple-100'
    case 'delivered':
      return 'text-green-600 bg-green-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Order Pending'
    case 'confirmed':
      return 'Order Confirmed'
    case 'preparing':
      return 'Being Prepared'
    case 'out_for_delivery':
      return 'Out for Delivery'
    case 'delivered':
      return 'Delivered'
    default:
      return 'Unknown Status'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return Clock
    case 'confirmed':
      return CheckCircle
    case 'preparing':
      return ChefHat
    case 'out_for_delivery':
      return Truck
    case 'delivered':
      return CheckCircle
    default:
      return Clock
  }
}

const trackingSteps = computed(() => {
  if (!props.currentOrder) return []

  const steps = [
    { key: 'confirmed', label: 'Order Confirmed', completed: false },
    { key: 'preparing', label: 'Being Prepared', completed: false },
    { key: 'out_for_delivery', label: 'Out for Delivery', completed: false },
    { key: 'delivered', label: 'Delivered', completed: false },
  ]

  const statusOrder = ['confirmed', 'preparing', 'out_for_delivery', 'delivered']
  const currentIndex = statusOrder.indexOf(props.currentOrder.status)

  steps.forEach((step, index) => {
    step.completed = index <= currentIndex
  })

  return steps
})
</script>

<template>
  <div class="space-y-6">
    <!-- Current Order Tracking -->
    <div v-if="currentOrder" class="bg-white rounded-2xl shadow-sm border p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6">Order Tracking</h2>

      <!-- Order Summary -->
      <div class="bg-gray-50 rounded-xl p-4 mb-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="font-semibold text-gray-900">{{ currentOrder.restaurant }}</h3>
            <p class="text-sm text-gray-500">Order #{{ currentOrder.id.slice(-6) }}</p>
          </div>
          <div class="text-right">
            <p class="font-semibold text-gray-900">₦{{ currentOrder.total.toLocaleString() }}</p>
            <div class="flex items-center text-sm text-gray-500 mt-1">
              <Clock class="w-4 h-4 mr-1" />
              {{ currentOrder.deliveryTime }}
            </div>
          </div>
        </div>

        <!-- Items -->
        <div class="space-y-2">
          <div
            v-for="item in currentOrder.items"
            :key="item.name"
            class="flex justify-between text-sm"
          >
            <span class="text-gray-700">{{ item.quantity }}x {{ item.name }}</span>
            <span class="text-gray-900">₦{{ (item.price * item.quantity).toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <!-- Status Badge -->
      <div class="flex items-center justify-center mb-6">
        <div
          :class="[
            'px-4 py-2 rounded-full flex items-center space-x-2',
            getStatusColor(currentOrder.status),
          ]"
        >
          <component :is="getStatusIcon(currentOrder.status)" class="w-5 h-5" />
          <span class="font-medium">{{ getStatusText(currentOrder.status) }}</span>
        </div>
      </div>

      <!-- Progress Steps -->
      <div class="relative">
        <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        <div class="space-y-6">
          <div v-for="step in trackingSteps" :key="step.key" class="relative flex items-center">
            <div
              :class="[
                'w-12 h-12 rounded-full flex items-center justify-center border-2 bg-white z-10',
                step.completed
                  ? 'border-green-500 text-green-500'
                  : 'border-gray-300 text-gray-400',
              ]"
            >
              <CheckCircle v-if="step.completed" class="w-6 h-6 fill-current" />
              <div v-else class="w-3 h-3 rounded-full bg-current"></div>
            </div>
            <div class="ml-4">
              <p :class="['font-medium', step.completed ? 'text-gray-900' : 'text-gray-500']">
                {{ step.label }}
              </p>
              <p v-if="step.completed" class="text-sm text-green-600">Completed</p>
              <p v-else-if="step.key === currentOrder.status" class="text-sm text-blue-600">
                In Progress
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Delivery Info -->
      <div v-if="currentOrder.status === 'out_for_delivery'" class="mt-6 p-4 bg-blue-50 rounded-xl">
        <div class="flex items-center space-x-2 mb-2">
          <Truck class="w-5 h-5 text-blue-600" />
          <span class="font-medium text-blue-900">On the way!</span>
        </div>
        <p class="text-sm text-blue-700">
          Your order is out for delivery and should arrive by {{ currentOrder.deliveryTime }}
        </p>
        <div v-if="currentOrder.deliveryAddress" class="flex items-center space-x-2 mt-2">
          <MapPin class="w-4 h-4 text-blue-600" />
          <span class="text-sm text-blue-700">{{ currentOrder.deliveryAddress }}</span>
        </div>
      </div>
    </div>

    <!-- Order History -->
    <div class="bg-white rounded-2xl shadow-sm border p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6">Order History</h2>

      <div v-if="orderHistory.length === 0" class="text-center py-8">
        <div
          class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Clock class="w-8 h-8 text-gray-400" />
        </div>
        <p class="text-gray-500">No previous orders</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="order in orderHistory"
          :key="order.id"
          class="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="font-medium text-gray-900">{{ order.restaurant }}</h3>
              <p class="text-sm text-gray-500">Order #{{ order.id.slice(-6) }}</p>
            </div>
            <div class="text-right">
              <p class="font-medium text-gray-900">₦{{ order.total.toLocaleString() }}</p>
              <div
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium mt-1',
                  getStatusColor(order.status),
                ]"
              >
                {{ getStatusText(order.status) }}
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600">
              {{ order.items.map((item) => `${item.quantity}x ${item.name}`).join(', ') }}
            </div>
            <button
              v-if="order.status === 'delivered'"
              class="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <Star class="w-4 h-4" />
              <span>Rate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
