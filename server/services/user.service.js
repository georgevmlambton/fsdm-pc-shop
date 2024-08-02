import * as userRepository from '../repositories/user.repository.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { jwtSecret } from '../confg.js'

export async function registerUser({ name, email, password }) {
  const existingUser = await getUser({ email })
  if (existingUser) {
    throw new Error('User already exists')
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  return await userRepository.registerUser({ name, email, hashedPassword })
}

export async function getUser(email) {
  return await userRepository.getUserByEmail(email)
}

export async function getUserById(id) {
  return await userRepository.getUserById(id)
}

export async function login(email, password) {
  try {
    const user = await userRepository.getUserByEmail(email)
    if (!user) {
      throw new Error('Invalid Credentials')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new Error('Invalid Credentials')
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: '1h',
    })

    return { token, user: { name: user.name, email: user.email } }
  } catch (err) {
    throw new Error(err)
  }
}
