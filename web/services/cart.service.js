import productService from './product.service.js'
import userService from './user.service.js'

class CartService {
  cartItems = []

  url = 'https://fsdm-pc-shop-v1.georgevm.com'

  cartItemsPromise = null

  async getCartItems() {
    if (this.cartItemsPromise) {
      return this.cartItemsPromise
    }

    if (!this.cartItems.length) {
      this.cartItemsPromise = new Promise((resolve) => {
        $.ajax({
          url: `${this.url}/cart`, // Replace URL with the prod url
          type: 'GET',
          headers: {
            Authorization: userService.getAuth(),
            'Content-Type': 'application/json',
          },
          success: (cartRes) => {
            this.cartItems = cartRes.cart
            resolve(this.cartItems)
            this.cartItemsPromise = null
          },
          error: function (_, status, error) {
            console.error(
              'GET request failed with status',
              status,
              'and error',
              error
            )
          },
        })
      })

      return this.cartItemsPromise
    }
    return this.cartItems
  }

  async getCartProducts() {
    var items = await this.getCartItems()
    var fetchedProdcuts = []
    var promises = items.map(async (item) => {
      const product = await productService.getProduct(item.product_id)
      fetchedProdcuts.push(product)
    })
    await Promise.all(promises)
    return fetchedProdcuts
  }

  async getCartItemsCount() {
    var cartCount = await this.getCartItems()
    return cartCount.length
  }

  async addToCart(id, quantity) {
    let response = await $.ajax({
      url: `${this.url}/cart/add`, // Replace URL with the prod url
      type: 'POST',
      data: JSON.stringify({
        product_id: id,
        quantity: quantity,
      }),
      headers: {
        Authorization: userService.getAuth(),
        'Content-Type': 'application/json',
      },
      success: () => {
        // Add success logic if any
      },
      error: function (_, status, error) {
        console.error(
          'POST request failed with status',
          status,
          'and error',
          error
        )
      },
    })
    this.cartItems = response.cart
    return this.cartItems
  }

  async setQuantity(id, quantity) {
    let response = await $.ajax({
      url: `${this.url}/cart/item/` + id, // Replace URL with the prod url
      type: 'POST',
      data: JSON.stringify({
        quantity: quantity,
      }),
      headers: {
        Authorization: userService.getAuth(),
        'Content-Type': 'application/json',
      },
      success: () => {
        // Add success logic if any
      },
      error: function (_, status, error) {
        console.error(
          'POST request failed with status',
          status,
          'and error',
          error
        )
      },
    })
    this.cartItems = response.cart
    return this.cartItems
  }

  async removeFromCart(id) {
    let response = await $.ajax({
      url: `${this.url}/cart/item/` + id, // Replace URL with the prod url
      type: 'DELETE',
      headers: {
        Authorization: userService.getAuth(),
        'Content-Type': 'application/json',
      },
      success: () => {
        // Add success logic if any
      },
      error: function (_, status, error) {
        console.error(
          'DELETE request failed with status',
          status,
          'and error',
          error
        )
      },
    })
    this.cartItems = response.cart
    return this.cartItems
  }

  async emptyCart() {
    let response = await $.ajax({
      url: `${this.url}/cart`, // Replace URL with the prod url
      type: 'DELETE',
      headers: {
        Authorization: userService.getAuth(),
        'Content-Type': 'application/json',
      },
      success: () => {
        // Add success logic if any
      },
      error: function (_, status, error) {
        console.error(
          'DELETE request failed with status',
          status,
          'and error',
          error
        )
      },
    })
    this.cartItems = response.cart
    return this.cartItems
  }

  async checkout() {
    let response = await $.ajax({
      url: `${this.url}/cart/checkout`, // Replace URL with the prod url
      type: 'POST',
      headers: {
        Authorization: userService.getAuth(),
        'Content-Type': 'application/json',
      },
      success: () => {
        // Add success logic if any
      },
      error: function (_, status, error) {
        console.error(
          'POST request failed with status',
          status,
          'and error',
          error
        )
      },
    })
    this.cartItems = []
    return response.order_id
  }

  async getOrder(orderID) {
    try {
      let response = await $.ajax({
        url: `${this.url}/order/` + orderID, // Replace URL with the prod url
        type: 'GET',
        headers: {
          Authorization: userService.getAuth(),
          'Content-Type': 'application/json',
        },
        success: () => {
          // Add success logic if any
        },
        error: function (_, status, error) {
          console.error(
            'POST request failed with status',
            status,
            'and error',
            error
          )
        },
      })
      return response.order
    } catch {
      return []
    }
  }
}

const cartService = new CartService()

export default cartService
