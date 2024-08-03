import { Router } from 'express'
import * as userService from '../services/user.service.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/login', authMiddleware, async (req, resp) => {
  const user = req.user
  resp.json({ user: { name: user.name, email: user.email } })
})

router.post('/login', async (req, resp) => {
  const { email, password } = req.body

  const loginResponse = await userService.login(email.toLowerCase(), password)

  if (!loginResponse) {
    return resp.status(401).json({ error: 'Invalid Credentials' })
  }

  resp.json(loginResponse)
})

router.post('/register', async (req, resp) => {
  const { name, email, password } = req.body
  console.log(req.body)
  if (!req.body) {
    return resp.status(400).json({ message: 'Invalid data' })
  }
  await userService.registerUser({
    name,
    email: email.toLowerCase(),
    password,
  })
  resp.status(201).json({ message: 'User created successfully' })
})

export default router
