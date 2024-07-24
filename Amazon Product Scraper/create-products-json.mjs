import { readFileSync, writeFileSync } from 'node:fs'
import { faker } from '@faker-js/faker'

const categories = [
  'accessories',
  'cases',
  'cpu',
  'gpu',
  'memory',
  'monitor',
  'power',
  'storage',
]

const products = categories.reduce((products, category) => {
  const data = JSON.parse(readFileSync(`${category}.scraped.json`).toString())
  let previousId = products[products.length - 1]?.id || 0
  const categoryProducts = []

  Object.values(data).forEach((product) => {
    if (!product.images[0]) {
      return
    }

    categoryProducts.push({
      id: ++previousId,
      name: product.name,
      price: product.price,
      category,
      stock: faker.number.int({ min: 0, max: 100 }),
      description: product.description,
      image: product.images[0],
      alt_images: product.images.slice(1),
      reviews: product.reviews.map((review) => ({
        username: faker.internet.userName(),
        ...review,
      })),
    })
  })

  return [...products, ...categoryProducts]
}, [])

writeFileSync('products.json', JSON.stringify(products, null, 2))
