import jwt from 'jsonwebtoken'
import { jwtSecret } from '../confg.js'
import * as userService from '../services/user.service.js'

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const payload = jwt.verify(token, jwtSecret)
    if (!payload) return res.send(403).json({ error: 'Forbidden' })
    const user = await userService.getUserById(payload.userId)
    if (!user) {
      return res.send(403).json({ error: 'Forbidden' })
    }
    req.user = user
    req.userId = user._id
    next()
  } catch (error) {
    res.send(403).json({ error: 'Forbidden' })
  }
}
