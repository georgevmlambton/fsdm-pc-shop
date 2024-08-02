import { Router } from 'express'
import * as userService from '../services/user.service.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/login', authMiddleware, async (req, resp) => {
  try {
    const user = req.user
    resp.json({ user: { name: user.name, email: user.email } })
  } catch (err) {
    resp.status(500).json({ error: err.message })
  }
})

router.post('/login', async (req, resp) => {
  try {
    const { email, password } = req.body

    try {
      const loginResponse = await userService.login(email, password)
      resp.json(loginResponse)
    } catch (error) {
      console.error('Error: ', error.message)
      resp.status(500).json({ message: 'Server error' })
    }
  } catch (err) {
    console.error('Error: ', err.message)
    resp.status(500).json({ error: err.message })
  }
})

router.post('/register', async (req, resp) => {
  const { name, email, password } = req.body
  console.log(req.body)
  if (!req.body) {
    return resp.status(400).json({ message: 'Invalid data' })
  }
  try {
    await userService.registerUser({
      name,
      email: email.toLowerCase(),
      password,
    })
    resp.status(201).json({ message: 'User created successfully' })
  } catch (error) {
    resp.status(500).json({ message: error.message })
  }
})

export default router
