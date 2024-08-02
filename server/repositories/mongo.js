import {
  MongoClient,
  MongoServerSelectionError,
  MongoTopologyClosedError,
} from 'mongodb'
import { isDev, mongoUri } from '../confg.js'
import process from 'node:process'

const client = new MongoClient(mongoUri)
process.on('uncaughtException', (error) => {
  if (
    (error instanceof MongoServerSelectionError ||
      error instanceof MongoTopologyClosedError) &&
    isDev
  ) {
    console.error('Error connecting to Mongo')
    console.error(error.message)
    return
  }
  console.log(error)
  throw error
})

export const db = client.db('pc_shop')
