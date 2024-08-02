import { Router } from 'express'
import productsRouter from './products.router.js'
import cartRouter from './cart.router.js'
import userRouter from './user.router.js'
import orderRouter from './order.router.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import bodyParser from 'body-parser'
import cors from 'cors'
const router = Router()
router.use(cors())
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.use('/auth', userRouter)
router.use('/products', productsRouter)
router.use(authMiddleware)
router.use('/cart', cartRouter)
router.use('/order', orderRouter)
router.use('/*', (req, resp) => {
  resp.status(404).send('Not found')
})

export default router
