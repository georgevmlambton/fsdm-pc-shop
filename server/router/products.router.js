import { Router } from 'express'
import * as productsService from '../services/product.service.js'

const router = Router()

router.get('/', async (req, resp) => {
  try {
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
  } catch (err) {
    resp.status(500).json({ error: err })
  }
})

router.get('/featured', async (req, resp) => {
  try {
    resp.json({
      products: await productsService.getFeatured(),
    })
  } catch (err) {
    resp.status(500).json({ error: err })
  }
})

router.get('/:product_id', async (req, resp) => {
  try {
    const product = await productsService.getProductById(req.params.product_id)
    if (!product) {
      resp.status(404).json({ error: 'Product not found' })
      return
    }
    resp.json(product)
  } catch (err) {
    resp.status(500).json({ error: err })
  }
})

export default router
