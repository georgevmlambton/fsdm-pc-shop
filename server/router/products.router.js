import { Router } from 'express'
import * as productsService from '../services/product.service.js'

const router = Router()

router.get('/', async (req, resp) => {
  const limit = parseInt(req.query.limit ?? 50)
  const page = parseInt(req.query.page ?? 1)
  const search = req.query.search
  const category = req.query.category
  const skip = (page - 1) * limit
  const products = await productsService.getProducts(
    limit,
    skip,
    category,
    search
  )
  resp.json(products)
})

router.get('/featured', async (req, resp) => {
  resp.json({
    products: await productsService.getFeatured(),
  })
})

router.get('/:product_id', async (req, resp) => {
  const product = await productsService.getProductById(req.params.product_id)
  if (!product) {
    resp.status(404).json({ error: 'Product not found' })
    return
  }
  resp.json(product)
})

export default router
