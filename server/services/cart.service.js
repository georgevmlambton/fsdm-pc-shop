import * as cartRepository from '../repositories/cart.repository.js'

export async function getCart(userId) {
  const items = await cartRepository.getCart(userId)
  return items.map((item) => ({
    id: item._id,
    user_id: item.userId,
    product_id: item.product_id,
    quantity: item.quantity,
  }))
}

export async function addToCart(userId, product_id, quantity) {
  try {
    await cartRepository.addToCart(userId, product_id, quantity)
    return getCart(userId)
  } catch (error) {
    console.error('Error in cart service:', error)
    throw new Error('Failed to add item to cart')
  }
}

export async function removeFromCart(userId, product_id) {
  try {
    await cartRepository.removeFromCart(userId, product_id)
    return getCart(userId)
  } catch (error) {
    console.error('Error in cart service:', error)
    throw new Error('Failed to remove item from cart')
  }
}

export async function clearCart(userId) {
  try {
    await cartRepository.clearCart(userId)
    return []
  } catch (error) {
    console.error('Error in cart service:', error)
    throw new Error('Failed to clear cart')
  }
}

export async function updateQuantity(userId, productId, quantity) {
  try {
    if (quantity == 0) {
      return await removeFromCart(userId, productId)
    }
    await cartRepository.updateQuantity(userId, productId, quantity)
    return await getCart(userId)
  } catch (error) {
    console.error('Error in cart service:', error)
    throw new Error('Failed to clear cart')
  }
}
