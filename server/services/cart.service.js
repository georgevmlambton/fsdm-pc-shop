import * as cartRepository from '../repositories/cart.repository.js'

export async function getCart(userId) {
  return await cartRepository.getCart(userId)
}
