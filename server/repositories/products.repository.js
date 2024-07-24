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

export async function getProducts(limit, skip) {
  return productsCollection.find().limit(limit).skip(skip).toArray()
}

export async function getProductById(productId) {
  return productsCollection.findOne({ id: parseInt(productId) })
}
