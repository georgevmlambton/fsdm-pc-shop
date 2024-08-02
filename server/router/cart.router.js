import { Router } from 'express'
import * as cartService from '../services/cart.service.js'
import * as orderService from '../services/orders.service.js'

const router = Router()

router.get('/', async (req, resp) => {
  try {
    const userId = req.user._id
    const cart = await cartService.getCart(userId)
    resp.json({ cart })
  } catch (err) {
    resp.status(500).json({ error: err })
  }
})

router.delete('/', async (req, res) => {
  try {
    const userId = req.userId

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' })
    }

    const cart = await cartService.clearCart(userId)
    res.json({ cart })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/add', async (req, res) => {
  try {
    const userId = req.userId
    const productId = req.body.product_id
    const quantity = req.body.quantity
    if (!userId || !productId || quantity === undefined) {
      return res
        .status(400)
        .json({ error: 'User ID, product ID, and quantity are required' })
    }

    const cart = await cartService.addToCart(userId, productId, quantity)

    res.json({ cart })
  } catch (err) {
    console.error('Error in POST /cart/add:', err)
    res.status(500).json({ error: 'Failed to add item to cart' })
  }
})

router.delete('/item/:product_id', async (req, res) => {
  try {
    const userId = req.userId
    const productId = parseInt(req.params.product_id)
    if (!userId || !productId) {
      return res.status(400).json({ error: 'User ID, cartItemId are required' })
    }

    const cart = await cartService.removeFromCart(userId, productId)

    res.json({ cart })
  } catch (err) {
    console.error('Error in DELETE /cart/item:', err)
    res.status(500).json({ error: 'Failed to add item to cart' })
  }
})

router.post('/item/:product_id', async (req, res) => {
  try {
    const userId = req.userId
    const productId = parseInt(req.params.product_id)
    const quantity = parseInt(req.body.quantity)
    if (!userId || !productId || !quantity) {
      return res
        .status(400)
        .json({ error: 'User ID, productId, quantity are required' })
    }

    if (quantity < 0) {
      return res.status(400).json({ error: 'Quantity cannot be negative' })
    }

    const cart = await cartService.updateQuantity(userId, productId, quantity)
    res.json({ cart })
  } catch (err) {
    console.error('Error in POST /cart/item:', err)
    res.status(500).json({ error: 'Failed to add update quantity' })
  }
})

router.post('/checkout', async (req, resp) => {
  const userId = req.userId
  if (!userId) {
    return resp.status(400).json({ error: 'userId or cart missing' })
  }
  try {
    const orderId = await orderService.checkout(userId)
    resp.json(orderId)
  } catch (error) {
    console.error('Error in POST /cart/checkout', error)
    resp.status(500).json({ error: 'Failed to add item to cart' })
  }
})

export default router
