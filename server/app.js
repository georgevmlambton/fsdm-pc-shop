import express from 'express'
import staticRouter from './router/static.js'
import baseRouter from './router/base.router.js'
import { errorMiddleware } from './middleware/error.middleware.js'
const app = express()

app.use('/api', baseRouter)
app.use(staticRouter)
app.use(errorMiddleware)

export default app
