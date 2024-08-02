import { db } from './mongo.js'

const cartCollection = db.collection('cart')
cartCollection.createIndex('userId')

export async function getCart(userId) {
  return await cartCollection.find({ userId }).sort({ product_id: 1 }).toArray()
}

export async function addToCart(userId, product_id, quantity) {
  const cartItem = await cartCollection.findOne({ userId, product_id })

  if (cartItem) {
    await cartCollection.updateOne(
      { userId, product_id },
      { $inc: { quantity: quantity } }
    )
  } else {
    await cartCollection.insertOne({ userId, product_id, quantity })
  }
}

export async function removeFromCart(userId, product_id) {
  await cartCollection.deleteOne({ userId, product_id })
}

export async function clearCart(userId) {
  await cartCollection.deleteMany({ userId })
}

export async function updateQuantity(userId, productId, quantity) {
  await cartCollection.updateOne(
    { userId, product_id: productId },
    { $set: { quantity: quantity } }
  )
}
