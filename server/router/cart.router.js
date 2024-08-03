import { Router } from 'express'
import * as cartService from '../services/cart.service.js'
import * as orderService from '../services/orders.service.js'

const router = Router()

router.get('/', async (req, resp) => {
  const userId = req.user._id
  const cart = await cartService.getCart(userId)
  resp.json({ cart })
})

router.delete('/', async (req, res) => {
  const userId = req.userId

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' })
  }

  const cart = await cartService.clearCart(userId)
  res.json({ cart })
})

router.post('/add', async (req, res) => {
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
})

router.delete('/item/:product_id', async (req, res) => {
  const userId = req.userId
  const productId = parseInt(req.params.product_id)
  if (!userId || !productId) {
    return res.status(400).json({ error: 'User ID, cartItemId are required' })
  }

  const cart = await cartService.removeFromCart(userId, productId)

  res.json({ cart })
})

router.post('/item/:product_id', async (req, res) => {
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
})

router.post('/checkout', async (req, resp) => {
  const userId = req.userId
  if (!userId) {
    return resp.status(400).json({ error: 'userId or cart missing' })
  }
  const orderId = await orderService.checkout(userId)
  resp.json(orderId)
})

export default router
