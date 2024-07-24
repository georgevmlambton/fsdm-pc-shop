export const authMiddleware = (req, resp, next) => {
  const token = req.headers.authorization
  if (token && token.split(' ')[0] === 'Basic') {
    req.userId = token.split(' ')[1]
  }

  next()
}
