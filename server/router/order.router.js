import { Router } from 'express'
import { getOrderProducts } from '../services/orders.service.js'

const router = Router()

router.get('/:orderid', async (req, resp) => {
  try {
    let orderId = req.params.orderid
    !orderId && resp.status(404).json({ error: 'OrderId not found' })
    resp.json(await getOrderProducts(orderId))
  } catch (error) {
    console.log(error)
    resp.status(500).json({ error: error.message })
  }
})

export default router
