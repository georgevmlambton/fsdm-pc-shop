import process from 'node:process'
import dotenv from 'dotenv'

export const isDev = process.env['ENV'] !== 'prod'

if (isDev) {
  Object.assign(
    process.env,
    dotenv.config({ path: '.env.local' }).parsed,
    dotenv.config({ path: '.env' }).parsed
  )
}

export const mongoUri = process.env['MONGO_URI']
export const jwtSecret = process.env['JWT_SECRET']
