import { Router } from 'express'
import * as cartService from '../services/cart.service.js'

const router = Router()

router.get('/', async (req, resp) => {
  try {
    const userId = req.userId
    const cart = await cartService.getCart(userId)
    resp.json(cart)
  } catch (err) {
    resp.status(500).json({ error: err })
  }
})

export default router
