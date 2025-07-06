import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'
  estimatedDelivery?: string
  deliveryAddress?: string
}

export const useDishcoveryStore = defineStore('dishcovery', () => {
  const orders = ref<Order[]>([])

  const currentOrder = computed(() => {
    return (
      orders.value.find((order) => order.status !== 'delivered' && order.status !== 'cancelled') ||
      null
    )
  })

  const orderHistory = computed(() => {
    return orders.value.filter(
      (order) => order.status === 'delivered' || order.status === 'cancelled',
    )
  })

  const createOrder = (orderData: Omit<Order, 'id'> & { id?: string }) => {
    const order: Order = {
      id: orderData.id || Date.now().toString(),
      restaurant: orderData.restaurant,
      items: orderData.items,
      total: orderData.total,
      deliveryTime: orderData.deliveryTime,
      status: orderData.status,
      estimatedDelivery: orderData.estimatedDelivery,
      deliveryAddress: orderData.deliveryAddress || '123 Main Street, Lagos',
    }

    orders.value.push(order)
    return order
  }

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const order = orders.value.find((o) => o.id === orderId)
    if (order) {
      order.status = status
    }
  }

  const getOrderById = (orderId: string) => {
    return orders.value.find((order) => order.id === orderId)
  }

  return {
    orders,
    currentOrder,
    orderHistory,
    createOrder,
    updateOrderStatus,
    getOrderById,
  }
})
