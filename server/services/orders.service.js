import * as ordersRepository from '../repositories/orders.repository.js'
import { clearCart, getCart } from './cart.service.js'

export async function checkout(userId) {
  try {
    let cartProducts = await getCart(userId)
    if (cartProducts.length === 0) {
      throw new Error('User has no items in their cart.')
    }

    let insertedOrder = await ordersRepository.insertOrder(userId, cartProducts)
    await clearCart(userId)
    return { orderId: insertedOrder.insertedId }
  } catch (error) {
    throw new Error(error.message)
  }
}

export async function getOrderProducts(orderId) {
  try {
    const order = await ordersRepository.getOrder(orderId)
    if (!order) {
      throw new Error('Order not found')
    }
    const products = order.products.map((product) => {
      return { product_id: product.product_id, quantity: product.quantity }
    })

    return { order: products }
  } catch (error) {
    throw new Error(error.message)
  }
}
