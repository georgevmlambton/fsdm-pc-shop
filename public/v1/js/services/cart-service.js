class CartService {
  cartItems = []

  url = 'https://fsdm-pc-shop-v1.georgevm.com'

  cartItemsPromise = null

  async getCartItems() {
    if (this.cartItemsPromise) {
      return this.cartItemsPromise
    }

    if (!this.cartItems.length) {
      this.cartItemsPromise = new Promise(async (resolve) => {
        const cartRes = await $.ajax({
          url: `${this.url}/cart`, // Replace URL with the prod url
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
              'GET request failed with status',
              status,
              'and error',
              error
            )
          },
        })

        this.cartItems = cartRes.cart
        resolve(this.cartItems)
        this.cartItemsPromise = null
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

  refreshCart() {
    this.updateCart()
    this.updateTotal()
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
    this.refreshCart()
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
    this.refreshCart(true)
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
    this.refreshCart(true)
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

  updateCart() {
    document.dispatchEvent(new Event('cartUpdate'))
  }

  updateTotal() {
    document.dispatchEvent(new Event('updateTotal'))
  }

  onUpdateCart(fn) {
    document.addEventListener('cartUpdate', fn)
  }

  onUpdateTotal(fn) {
    document.addEventListener('updateTotal', fn)
  }

  async getQuantity(id) {
    var products = await this.getCartItems()
    if (products) {
      for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) return products[i].quantity
      }
    }
  }
}

let cartService = new CartService()
