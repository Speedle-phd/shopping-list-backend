import express from 'express'

import {userRouter} from './router/userRouter'
import cors from 'cors'
import { config } from 'dotenv'
config()
import "express-async-errors"
import helmet from 'helmet'
// @ts-ignore
import xss from 'xss-clean'
// @ts-ignore
import rateLimiter from 'express-rate-limit'
import { connectDB } from './db/db'
import { errorHandler } from './middleware/error-handler'
import { notFound } from './middleware/not-found'
import { itemListRouter } from './router/itemRouter'
import { auth } from './middleware/auth'
import { settingsRouter } from './router/settingsRouter'
import { favoritesRouter } from './router/favoritesRouter'



const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(xss())
app.set('trust proxy', 1)
app.use("/api",
   rateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: `Too many requests coming from your IP. Please try again in 15 minutes`
   })
)


app.use("/api/v1/auth", userRouter)
app.use("/api/v1/lists", auth ,itemListRouter)
app.use('/api/v1/auth/settings', auth, settingsRouter)
app.use('/api/v1/favorites', auth, favoritesRouter)

app.use(notFound)
app.use(errorHandler)

const startApp = async() => {
   try {
      await connectDB(process.env.MONGO_URI!)
      app.listen(port, () => {
         console.log(`Server is listening on port ${port}...`)
      })
   } catch (error) {
      console.log(error)
   }
}
startApp()



