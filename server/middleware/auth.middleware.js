import jwt from 'jsonwebtoken'
import { jwtSecret } from '../confg.js'
import * as userService from '../services/user.service.js'

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)
  try {
    const payload = jwt.verify(token, jwtSecret)
    if (!payload) return res.sendStatus(403)
    const user = await userService.getUserById(payload.userId)
    if (!user) {
      return res.sendStatus(403)
    }
    req.user = user
    req.userId = user._id
    next()
  } catch (error) {
    res.sendStatus(403)
  }
}
