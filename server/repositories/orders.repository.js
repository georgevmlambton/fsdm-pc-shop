import { db } from './mongo.js'
import { ObjectId } from 'mongodb'

const ordersCollection = db.collection('orders')
ordersCollection.createIndex('orderId')

export async function insertOrder(userId, products) {
  return await ordersCollection.insertOne({
    userId: userId,
    products: products.map((product) => ({
      product_id: product.product_id,
      quantity: product.quantity,
    })),
  })
}

export async function getOrder(orderId) {
  return await ordersCollection.findOne({ _id: new ObjectId(orderId) })
}
