import { createServer } from 'vite'
import './index.js'

const vite = await createServer()
vite.listen(3000)

console.log('\n\n    Open in browser: http://localhost:3000')
