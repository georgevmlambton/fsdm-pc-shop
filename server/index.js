import { seedProducts } from './services/product.service.js'
import { isDev } from './confg.js'
import app from './app.js'

const port = 8080

seedProducts().catch((error) => {
  if (isDev) {
    return
  }

  throw error
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
