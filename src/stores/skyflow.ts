import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface TripStop {
  city: string
  country: string
  duration: number
}

interface FlightDetails {
  airline: string
  flightNumber: string
  departureTime: string
  arrivalTime: string
  [key: string]: unknown
}

interface HotelDetails {
  name: string
  address: string
  checkInDate: string
  checkOutDate: string
  roomType: string
  totalPrice: number
  confirmationNumber?: string
  amenities?: string[]
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
  flightDetails?: FlightDetails
  hotelDetails?: HotelDetails
}

export const useSkyFlowStore = defineStore('skyflow', () => {
  const trips = ref<Trip[]>([])

  const currentTrip = computed(() => {
    return (
      trips.value.find((trip) => trip.status === 'planning' || trip.status === 'booked') || null
    )
  })

  const tripHistory = computed(() => {
    return trips.value.filter((trip) => trip.status === 'completed' || trip.status === 'cancelled')
  })

  const createTrip = (tripData: Omit<Trip, 'id'> & { id?: string }) => {
    const trip: Trip = {
      id: tripData.id || Date.now().toString(),
      destination: tripData.destination,
      departureDate: tripData.departureDate,
      returnDate: tripData.returnDate,
      stops: tripData.stops,
      totalCost: tripData.totalCost,
      status: tripData.status,
      visaRequired: tripData.visaRequired,
      flightDetails: tripData.flightDetails,
      hotelDetails: tripData.hotelDetails,
    }

    trips.value.push(trip)
    return trip
  }

  const updateTripStatus = (tripId: string, status: Trip['status']) => {
    const trip = trips.value.find((t) => t.id === tripId)
    if (trip) {
      trip.status = status
    }
  }

  const getTripById = (tripId: string) => {
    return trips.value.find((trip) => trip.id === tripId)
  }

  return {
    trips,
    currentTrip,
    tripHistory,
    createTrip,
    updateTripStatus,
    getTripById,
  }
})
