import * as express from 'express'
import { createReadStream } from 'node:fs'

const router = express.Router()

router.use(express.static('dist', { extensions: ['html', 'htm'] }))
router.use(express.static('public', { extensions: ['html', 'htm'] }))

router.get('*', async (req, res) => {
  res.header('Content-Type', 'text/html; charset=utf-8')
  createReadStream('dist/index.html').pipe(res)
})

export default router
