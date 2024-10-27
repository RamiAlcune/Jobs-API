import express, { Application, RequestHandler } from 'express'
import connectDB from './db/connect'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes'
import auth from './middleware/authMiddleWare'
import helmet from 'helmet'
import cors from 'cors'
import JobsRoutes from './routes/jobsRoutes'
dotenv.config()

const app: Application = express()

// Middleware
app.use(express.json())
app.use(helmet())
app.use(cors())
//Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/Jobs', auth as RequestHandler, JobsRoutes)

const port = process.env.PORT || 5000
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI!)
    app.listen(port, () => console.log(`Server is listening on port ${port}`))
  } catch (err) {
    console.log(err)
  }
}

start()
