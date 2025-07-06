<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, QrCode, Star, Camera, CheckCircle } from 'lucide-vue-next'

const router = useRouter()
const isScanning = ref(false)
interface Restaurant {
  name: string
  location: string
  lastVisit: string
  orderTotal: string
  items: string[]
}

const scannedRestaurant = ref<Restaurant | null>(null)
const reviewSubmitted = ref(false)
const rating = ref(0)
const reviewText = ref('')

onMounted(() => {
  // Any initialization code can go here
})

const startScanning = () => {
  isScanning.value = true
  // Simulate QR code scanning
  setTimeout(() => {
    isScanning.value = false
    scannedRestaurant.value = {
      name: 'Lagos Kitchen',
      location: 'Victoria Island, Lagos',
      lastVisit: '2 hours ago',
      orderTotal: '₦4,000',
      items: ['Jollof Rice', 'Coca Cola x3'],
    }
  }, 2000)
}

const submitReview = () => {
  if (rating.value > 0) {
    reviewSubmitted.value = true
    // Simulate review submission
    setTimeout(() => {
      router.push('/')
    }, 2000)
  }
}

const setRating = (stars: number) => {
  rating.value = stars
}
</script>

<style scoped>
@keyframes scan {
  0% {
    top: 1rem;
  }
  50% {
    top: calc(100% - 2rem);
  }
  100% {
    top: 1rem;
  }
}
</style>

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
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <QrCode class="w-5 h-5 text-purple-600" />
            </div>
            <h1 class="text-xl font-bold text-gray-900">QR Review</h1>
          </div>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Scanning State -->
      <div v-if="!scannedRestaurant && !isScanning" class="text-center">
        <div class="bg-white rounded-2xl shadow-sm border p-8 mb-8">
          <div
            class="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <QrCode class="w-12 h-12 text-purple-600" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Scan QR Code to Review</h2>
          <p class="text-gray-600 mb-8">
            Scan the QR code at your table to leave a review and earn rewards
          </p>
          <button
            @click="startScanning"
            class="bg-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <Camera class="w-5 h-5" />
            <span>Start Scanning</span>
          </button>
        </div>

        <!-- Instructions -->
        <div class="bg-white rounded-2xl shadow-sm border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">How it works</h3>
          <div class="space-y-3">
            <div class="flex items-center space-x-3">
              <div
                class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm font-bold"
              >
                1
              </div>
              <span class="text-gray-700">Scan the QR code at your restaurant table</span>
            </div>
            <div class="flex items-center space-x-3">
              <div
                class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm font-bold"
              >
                2
              </div>
              <span class="text-gray-700">Rate your dining experience</span>
            </div>
            <div class="flex items-center space-x-3">
              <div
                class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm font-bold"
              >
                3
              </div>
              <span class="text-gray-700">Earn rewards and help others discover great food</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Scanning Animation -->
      <div v-if="isScanning" class="text-center">
        <div class="bg-white rounded-2xl shadow-sm border p-8">
          <div class="relative w-48 h-48 mx-auto mb-6">
            <div class="absolute inset-0 border-4 border-purple-200 rounded-2xl"></div>
            <div class="absolute inset-4 border-2 border-purple-400 rounded-xl animate-pulse"></div>
            <div class="absolute inset-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <QrCode class="w-16 h-16 text-purple-600 animate-bounce" />
            </div>
            <!-- Scanning line animation -->
            <div
              class="absolute left-4 right-4 h-0.5 bg-purple-500 animate-pulse"
              style="top: 50%; animation: scan 2s linear infinite"
            ></div>
          </div>
          <h2 class="text-xl font-bold text-gray-900 mb-2">Scanning QR Code...</h2>
          <p class="text-gray-600">Point your camera at the QR code</p>
        </div>
      </div>

      <!-- Review Form -->
      <div v-if="scannedRestaurant && !reviewSubmitted" class="space-y-6">
        <!-- Restaurant Info -->
        <div class="bg-white rounded-2xl shadow-sm border p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">{{ scannedRestaurant.name }}</h2>
          <div class="space-y-2 text-sm text-gray-600">
            <p>📍 {{ scannedRestaurant.location }}</p>
            <p>🕐 Last visit: {{ scannedRestaurant.lastVisit }}</p>
            <p>💰 Order total: {{ scannedRestaurant.orderTotal }}</p>
            <p>🍽️ Items: {{ scannedRestaurant.items.join(', ') }}</p>
          </div>
        </div>

        <!-- Rating -->
        <div class="bg-white rounded-2xl shadow-sm border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Rate your experience</h3>
          <div class="flex items-center space-x-2 mb-6">
            <button
              v-for="star in 5"
              :key="star"
              @click="setRating(star)"
              class="transition-colors"
            >
              <Star
                :class="[
                  'w-8 h-8',
                  star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300',
                ]"
              />
            </button>
            <span v-if="rating > 0" class="ml-2 text-gray-600"
              >{{ rating }} star{{ rating > 1 ? 's' : '' }}</span
            >
          </div>

          <!-- Review Text -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Write a review (optional)
            </label>
            <textarea
              v-model="reviewText"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Share your experience with other diners..."
            ></textarea>
          </div>

          <!-- Submit Button -->
          <button
            @click="submitReview"
            :disabled="rating === 0"
            :class="[
              'w-full py-3 px-4 rounded-xl font-medium transition-colors',
              rating > 0
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed',
            ]"
          >
            Submit Review
          </button>
        </div>
      </div>

      <!-- Success State -->
      <div v-if="reviewSubmitted" class="text-center">
        <div class="bg-white rounded-2xl shadow-sm border p-8">
          <div
            class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle class="w-8 h-8 text-green-600" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Review Submitted!</h2>
          <p class="text-gray-600 mb-6">
            Thank you for your feedback. You've earned 50 reward points!
          </p>
          <div class="bg-green-50 rounded-lg p-4 mb-6">
            <p class="text-green-800 font-medium">🎉 Reward Earned</p>
            <p class="text-green-700 text-sm">50 points added to your account</p>
          </div>
          <p class="text-sm text-gray-500">Redirecting to home...</p>
        </div>
      </div>
    </main>
  </div>
</template>
