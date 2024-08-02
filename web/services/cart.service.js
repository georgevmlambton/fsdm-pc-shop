import productService from './product.service.js'
import userService from './user.service.js'

class CartService {
  cartItems = []
  url = '/api/cart'

  async getCart() {
    try {
      const response = await fetch(`${this.url}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: userService.getAuth(),
        },
        method: 'GET',
      })
      const data = await response.json()
      const products = []
      const productsPromises = data.cart.map(async (item, i) => {
        const product = await productService.getProduct(item.product_id)
        products.push({ ...data.cart[i], product })
      })
      await Promise.all(productsPromises)

      return products
    } catch (e) {
      throw new Error(e)
    }
  }

  async addToCart(id, quantity) {
    try {
      const response = await fetch(`${this.url}/add`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: userService.getAuth(),
        },
        method: 'POST',
        body: JSON.stringify({
          product_id: id,
          quantity: quantity,
        }),
      })
      const data = await response.json()
      return data.cart
    } catch (e) {
      throw new Error(e)
    }
  }

  async setQuantity(id, quantity) {
    const response = await fetch(`${this.url}/item/` + id, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userService.getAuth(),
      },
      method: 'POST',
      body: JSON.stringify({
        quantity: quantity,
      }),
    })

    return response.cart
  }

  async removeFromCart(product_id) {
    try {
      const response = await fetch(`${this.url}/item/` + product_id, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: userService.getAuth(),
        },
        method: 'DELETE',
      })
      const data = await response.json()
      return data.cart
    } catch (e) {
      throw new Error(e)
    }
  }

  async emptyCart() {
    try {
      const response = await fetch(`${this.url}/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: userService.getAuth(),
        },
        method: 'DELETE',
      })
      await response.json()
      return []
    } catch (e) {
      throw new Error(e)
    }
  }

  async checkout() {
    try {
      const response = await fetch(`${this.url}/checkout`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: userService.getAuth(),
        },
        method: 'POST',
      })
      return (await response.json()).orderId
    } catch (e) {
      throw new Error(e)
    }
  }
}

const cartService = new CartService()

export default cartService
