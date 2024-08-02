import userService from './user.service.js'

class CartService {
  cartItems = []
  url = '/api/order'

  async getOrder(orderID) {
    try {
      const response = await fetch(`${this.url}/` + orderID, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: userService.getAuth(),
        },
        method: 'GET',
      })

      return (await response.json()).order
    } catch (e) {
      throw new Error(e)
    }
  }
}

const cartService = new CartService()

export default cartService
