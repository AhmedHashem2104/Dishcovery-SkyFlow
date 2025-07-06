<script setup lang="ts">
import { ref } from 'vue'
import { Plane, MapPin, Calendar, DollarSign, AlertTriangle, Hotel, Clock } from 'lucide-vue-next'

interface TripStop {
  city: string
  country: string
  duration: number
}

interface Trip {
  id: string
  destination: string
  departureDate: string
  returnDate: string
  stops: TripStop[]
  totalCost: number
  status: 'planning' | 'booked' | 'completed' | 'cancelled'
  visaRequired?: string[]
  flightDetails?: {
    outbound: {
      airline: string
      flight: string
      departure: string
      arrival: string
      from: string
      to: string
      duration: string
      price: number
    }
    return: {
      airline: string
      flight: string
      departure: string
      arrival: string
      from: string
      to: string
      duration: string
      price: number
    }
  }
  hotelDetails?: HotelDetail[]
}

interface Props {
  currentTrip: Trip | null
  tripHistory: Trip[]
}

const props = defineProps<Props>()

const showFlightDetails = ref(false)
const showHotelDetails = ref(false)

const getStatusColor = (status: string) => {
  switch (status) {
    case 'planning':
      return 'text-blue-600 bg-blue-100'
    case 'booked':
      return 'text-green-600 bg-green-100'
    case 'completed':
      return 'text-gray-600 bg-gray-100'
    case 'cancelled':
      return 'text-red-600 bg-red-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'planning':
      return 'Planning'
    case 'booked':
      return 'Booked'
    case 'completed':
      return 'Completed'
    case 'cancelled':
      return 'Cancelled'
    default:
      return 'Unknown'
  }
}

const mockFlightDetails = {
  outbound: {
    airline: 'British Airways',
    flight: 'BA075',
    departure: '2024-07-15 14:30',
    arrival: '2024-07-15 19:45',
    from: 'Lagos (LOS)',
    to: 'London Heathrow (LHR)',
    duration: '6h 15m',
    price: 450,
  },
  return: {
    airline: 'KLM',
    flight: 'KL1008',
    departure: '2024-07-25 11:20',
    arrival: '2024-07-26 06:30',
    from: 'Amsterdam (AMS)',
    to: 'Lagos (LOS)',
    duration: '7h 10m',
    price: 380,
  },
}

const mockHotelDetails = [
  {
    city: 'London',
    name: 'Premier Inn London City',
    rating: 4.2,
    price: 120,
    nights: 4,
    checkIn: '2024-07-15',
    checkOut: '2024-07-19',
  },
  {
    city: 'Paris',
    name: 'Hotel des Grands Boulevards',
    rating: 4.5,
    price: 150,
    nights: 3,
    checkIn: '2024-07-19',
    checkOut: '2024-07-22',
  },
  {
    city: 'Amsterdam',
    name: 'Lloyd Hotel',
    rating: 4.3,
    price: 110,
    nights: 3,
    checkIn: '2024-07-22',
    checkOut: '2024-07-25',
  },
]
</script>

<template>
  <div class="space-y-6">
    <!-- Current Trip Planning -->
    <div v-if="currentTrip" class="bg-white rounded-2xl shadow-sm border p-6">
      <div class="flex justify-between items-start mb-6">
        <h2 class="text-xl font-bold text-gray-900">Trip Planning</h2>
        <div
          :class="[
            'px-3 py-1 rounded-full text-sm font-medium',
            getStatusColor(currentTrip.status),
          ]"
        >
          {{ getStatusText(currentTrip.status) }}
        </div>
      </div>

      <!-- Trip Overview -->
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ currentTrip.destination }}</h3>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="flex items-center space-x-2">
            <Calendar class="w-5 h-5 text-blue-600" />
            <div>
              <p class="text-sm text-gray-600">Departure</p>
              <p class="font-medium text-gray-900">{{ currentTrip.departureDate }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <Calendar class="w-5 h-5 text-purple-600" />
            <div>
              <p class="text-sm text-gray-600">Return</p>
              <p class="font-medium text-gray-900">{{ currentTrip.returnDate }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <DollarSign class="w-5 h-5 text-green-600" />
            <div>
              <p class="text-sm text-gray-600">Total Cost</p>
              <p class="font-medium text-gray-900">${{ currentTrip.totalCost.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Visa Requirements -->
      <div
        v-if="currentTrip.visaRequired && currentTrip.visaRequired.length > 0"
        class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6"
      >
        <div class="flex items-center space-x-2 mb-3">
          <AlertTriangle class="w-5 h-5 text-yellow-600" />
          <h4 class="font-medium text-yellow-800">Visa Requirements</h4>
        </div>
        <div class="space-y-2">
          <div
            v-for="visa in currentTrip.visaRequired"
            :key="visa"
            class="flex items-center justify-between p-3 bg-white rounded-lg"
          >
            <span class="text-sm font-medium text-gray-900">{{ visa }}</span>
            <button class="text-sm text-blue-600 hover:text-blue-700">Apply Now</button>
          </div>
        </div>
      </div>

      <!-- Trip Stops -->
      <div class="mb-6">
        <h4 class="font-medium text-gray-900 mb-4">Itinerary</h4>
        <div class="space-y-3">
          <div
            v-for="(stop, index) in currentTrip.stops"
            :key="stop.city"
            class="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl"
          >
            <div
              class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm"
            >
              {{ index + 1 }}
            </div>
            <div class="flex-1">
              <h5 class="font-medium text-gray-900">{{ stop.city }}, {{ stop.country }}</h5>
              <p class="text-sm text-gray-500">{{ stop.duration }} days</p>
            </div>
            <MapPin class="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      <!-- Flight & Hotel Details -->
      <div class="grid md:grid-cols-2 gap-4">
        <!-- Flight Details -->
        <div class="border border-gray-200 rounded-xl p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-2">
              <Plane class="w-5 h-5 text-blue-600" />
              <h4 class="font-medium text-gray-900">Flights</h4>
            </div>
            <button
              @click="showFlightDetails = !showFlightDetails"
              class="text-sm text-blue-600 hover:text-blue-700"
            >
              {{ showFlightDetails ? 'Hide' : 'View' }} Details
            </button>
          </div>

          <div v-if="showFlightDetails" class="space-y-3">
            <!-- Outbound Flight -->
            <div class="bg-gray-50 rounded-lg p-3">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <p class="font-medium text-gray-900">{{ mockFlightDetails.outbound.airline }}</p>
                  <p class="text-sm text-gray-600">{{ mockFlightDetails.outbound.flight }}</p>
                </div>
                <p class="font-medium text-gray-900">${{ mockFlightDetails.outbound.price }}</p>
              </div>
              <div class="flex items-center space-x-2 text-sm text-gray-600">
                <span>{{ mockFlightDetails.outbound.from }}</span>
                <span>→</span>
                <span>{{ mockFlightDetails.outbound.to }}</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">{{ mockFlightDetails.outbound.duration }}</p>
            </div>

            <!-- Return Flight -->
            <div class="bg-gray-50 rounded-lg p-3">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <p class="font-medium text-gray-900">{{ mockFlightDetails.return.airline }}</p>
                  <p class="text-sm text-gray-600">{{ mockFlightDetails.return.flight }}</p>
                </div>
                <p class="font-medium text-gray-900">${{ mockFlightDetails.return.price }}</p>
              </div>
              <div class="flex items-center space-x-2 text-sm text-gray-600">
                <span>{{ mockFlightDetails.return.from }}</span>
                <span>→</span>
                <span>{{ mockFlightDetails.return.to }}</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">{{ mockFlightDetails.return.duration }}</p>
            </div>
          </div>
        </div>

        <!-- Hotel Details -->
        <div class="border border-gray-200 rounded-xl p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-2">
              <Hotel class="w-5 h-5 text-purple-600" />
              <h4 class="font-medium text-gray-900">Hotels</h4>
            </div>
            <button
              @click="showHotelDetails = !showHotelDetails"
              class="text-sm text-blue-600 hover:text-blue-700"
            >
              {{ showHotelDetails ? 'Hide' : 'View' }} Details
            </button>
          </div>

          <div v-if="showHotelDetails" class="space-y-3">
            <div
              v-for="hotel in mockHotelDetails"
              :key="hotel.name"
              class="bg-gray-50 rounded-lg p-3"
            >
              <div class="flex justify-between items-start mb-2">
                <div>
                  <p class="font-medium text-gray-900">{{ hotel.name }}</p>
                  <p class="text-sm text-gray-600">{{ hotel.city }}</p>
                </div>
                <p class="font-medium text-gray-900">${{ hotel.price }}/night</p>
              </div>
              <div class="flex items-center justify-between text-sm text-gray-600">
                <span>{{ hotel.nights }} nights</span>
                <span>★ {{ hotel.rating }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Trip History -->
    <div class="bg-white rounded-2xl shadow-sm border p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6">Trip History</h2>

      <div v-if="props.tripHistory.length === 0" class="text-center py-8">
        <div
          class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Plane class="w-8 h-8 text-gray-400" />
        </div>
        <p class="text-gray-500">No previous trips</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="trip in props.tripHistory"
          :key="trip.id"
          class="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="font-medium text-gray-900">{{ trip.destination }}</h3>
              <p class="text-sm text-gray-500">{{ trip.departureDate }} - {{ trip.returnDate }}</p>
            </div>
            <div class="text-right">
              <p class="font-medium text-gray-900">${{ trip.totalCost.toLocaleString() }}</p>
              <div
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium mt-1',
                  getStatusColor(trip.status),
                ]"
              >
                {{ getStatusText(trip.status) }}
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4 text-sm text-gray-600">
              <div class="flex items-center space-x-1">
                <MapPin class="w-4 h-4" />
                <span>{{ trip.stops.length }} stops</span>
              </div>
              <div class="flex items-center space-x-1">
                <Clock class="w-4 h-4" />
                <span>{{ trip.stops.reduce((acc, stop) => acc + stop.duration, 0) }} days</span>
              </div>
            </div>
            <button class="text-sm text-blue-600 hover:text-blue-700">View Details</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
