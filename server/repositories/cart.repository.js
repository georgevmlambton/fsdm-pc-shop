import { db } from './mongo.js'

const cartCollection = db.collection('cart')
cartCollection.createIndex('userId')

export async function getCart(userId) {
  return cartCollection.find({ userId }).toArray()
}
