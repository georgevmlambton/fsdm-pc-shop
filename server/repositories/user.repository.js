import { db } from './mongo.js'
import { ObjectId } from 'mongodb'

const userCollection = db.collection('users')
userCollection.createIndex('email')

export async function getUserByEmail(email) {
  try {
    const user = await userCollection.findOne({ email })
    return user
  } catch (e) {
    throw new Error(e)
  }
}

export async function getUserById(id) {
  try {
    return await userCollection.findOne({ _id: new ObjectId(id) })
  } catch (e) {
    console.log(e)
    throw new Error(e)
  }
}

export async function registerUser({ name, email, hashedPassword }) {
  try {
    return await userCollection.insertOne({
      email,
      password: hashedPassword,
      name,
    })
  } catch (e) {
    throw new Error(e)
  }
}
