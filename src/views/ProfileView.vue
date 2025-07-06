<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  ArrowLeft,
  User,
  MapPin,
  Utensils,
  Plane,
  Settings,
  Bell,
  Heart,
  CreditCard,
} from 'lucide-vue-next'

const router = useRouter()

const userPreferences = {
  foodAllergies: ['Nuts', 'Shellfish'],
  favoriteCuisines: ['Nigerian', 'Italian', 'Japanese'],
  frequentDestinations: ['London', 'Dubai', 'New York'],
  dietaryRestrictions: ['Halal'],
  preferredAirlines: ['Emirates', 'British Airways'],
  budgetRange: '$500 - $2000',
}

const recentActivity = [
  { type: 'food', action: 'Ordered Jollof Rice from Lagos Kitchen', time: '2 hours ago' },
  { type: 'travel', action: 'Searched flights to London', time: '1 day ago' },
  { type: 'food', action: 'Reviewed Mama Cass Restaurant', time: '3 days ago' },
  { type: 'travel', action: 'Booked hotel in Paris', time: '1 week ago' },
]
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
          <h1 class="text-xl font-bold text-gray-900">Profile & Preferences</h1>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Profile Header -->
      <div class="bg-white rounded-2xl shadow-sm border p-8 mb-8">
        <div class="flex items-center space-x-6">
          <div
            class="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
          >
            <User class="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">John Doe</h2>
            <p class="text-gray-600">john.doe@example.com</p>
            <div class="flex items-center mt-2 text-sm text-gray-500">
              <MapPin class="w-4 h-4 mr-1" />
              Lagos, Nigeria
            </div>
          </div>
        </div>
      </div>

      <!-- Preferences Grid -->
      <div class="grid md:grid-cols-2 gap-8 mb-8">
        <!-- Food Preferences -->
        <div class="bg-white rounded-2xl shadow-sm border p-6">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              <Utensils class="w-5 h-5 text-orange-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Food Preferences</h3>
          </div>

          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Favorite Cuisines</label>
              <div class="flex flex-wrap gap-2 mt-2">
                <span
                  v-for="cuisine in userPreferences.favoriteCuisines"
                  :key="cuisine"
                  class="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                >
                  {{ cuisine }}
                </span>
              </div>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">Allergies</label>
              <div class="flex flex-wrap gap-2 mt-2">
                <span
                  v-for="allergy in userPreferences.foodAllergies"
                  :key="allergy"
                  class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                >
                  {{ allergy }}
                </span>
              </div>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">Dietary Restrictions</label>
              <div class="flex flex-wrap gap-2 mt-2">
                <span
                  v-for="restriction in userPreferences.dietaryRestrictions"
                  :key="restriction"
                  class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {{ restriction }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Travel Preferences -->
        <div class="bg-white rounded-2xl shadow-sm border p-6">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Plane class="w-5 h-5 text-blue-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Travel Preferences</h3>
          </div>

          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Frequent Destinations</label>
              <div class="flex flex-wrap gap-2 mt-2">
                <span
                  v-for="destination in userPreferences.frequentDestinations"
                  :key="destination"
                  class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {{ destination }}
                </span>
              </div>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">Preferred Airlines</label>
              <div class="flex flex-wrap gap-2 mt-2">
                <span
                  v-for="airline in userPreferences.preferredAirlines"
                  :key="airline"
                  class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                >
                  {{ airline }}
                </span>
              </div>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">Budget Range</label>
              <p class="mt-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-sm inline-block">
                {{ userPreferences.budgetRange }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-2xl shadow-sm border p-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
        <div class="space-y-4">
          <div
            v-for="activity in recentActivity"
            :key="activity.action"
            class="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50"
          >
            <div
              :class="[
                'w-10 h-10 rounded-lg flex items-center justify-center',
                activity.type === 'food' ? 'bg-orange-100' : 'bg-blue-100',
              ]"
            >
              <Utensils v-if="activity.type === 'food'" class="w-5 h-5 text-orange-600" />
              <Plane v-else class="w-5 h-5 text-blue-600" />
            </div>
            <div class="flex-1">
              <p class="text-gray-900">{{ activity.action }}</p>
              <p class="text-sm text-gray-500">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings -->
      <div class="bg-white rounded-2xl shadow-sm border p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Settings</h3>
        <div class="space-y-4">
          <button
            class="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-50 text-left"
          >
            <Bell class="w-5 h-5 text-gray-600" />
            <span class="text-gray-900">Notifications</span>
          </button>
          <button
            class="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-50 text-left"
          >
            <CreditCard class="w-5 h-5 text-gray-600" />
            <span class="text-gray-900">Payment Methods</span>
          </button>
          <button
            class="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-50 text-left"
          >
            <Heart class="w-5 h-5 text-gray-600" />
            <span class="text-gray-900">Saved Places</span>
          </button>
          <button
            class="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-50 text-left"
          >
            <Settings class="w-5 h-5 text-gray-600" />
            <span class="text-gray-900">Account Settings</span>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
