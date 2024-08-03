import { Router } from 'express'
import { getOrderProducts } from '../services/orders.service.js'

const router = Router()

router.get('/:orderid', async (req, resp) => {
  let orderId = req.params.orderid
  !orderId && resp.status(404).json({ error: 'OrderId not found' })
  resp.json(await getOrderProducts(orderId))
})

export default router
