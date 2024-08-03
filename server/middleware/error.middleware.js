export const errorMiddleware = (err, req, res, next) => {
  if (!err) {
    next()
  }

  console.error(err)
  res.status(500).json({ error: 'Internal Error: ' + err.message })
}
