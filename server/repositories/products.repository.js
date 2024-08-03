import { db } from './mongo.js'

const productsCollection = db.collection('products')
productsCollection.createIndex('id')

export async function updateProducts(products) {
  for (const product of products) {
    await productsCollection.updateOne(
      { id: product.id },
      { $set: product },
      {
        upsert: true,
      }
    )
  }
}

export async function getFeatured() {
  return await productsCollection
    .aggregate([{ $sample: { size: 4 } }])
    .toArray()
}

export async function getProducts(limit, skip, category, search) {
  const findObject = {}
  if (category) {
    findObject.category = category
  }
  if (search) {
    findObject.name = new RegExp(String.raw`${search}`, 'i')
  }
  const totalProducts = await productsCollection.countDocuments(findObject)
  const products = await productsCollection
    .find(findObject)
    .limit(limit)
    .skip(skip)
    .toArray()
  return {
    total_products: totalProducts,
    total_pages: Math.ceil(totalProducts / limit),
    products,
  }
}

export async function getProductById(productId) {
  return productsCollection.findOne({ id: parseInt(productId) })
}
