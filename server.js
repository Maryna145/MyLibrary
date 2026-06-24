import express from 'express'
import dotenv from 'dotenv'
import bookRoutes from './routes/bookRoutes.js'
import seriesRoutes from './routes/seriesRoutes.js'
import quotesRoutes from './routes/quotesRoutes.js'
import userRoutes from './routes/userRoutes.js'
import {errorHandler} from "./middleware/errorHandler.js";
import connectDB from "./config/dbConnections.js";

const app = express()
dotenv.config()

if(!process.env.ACCESS_TOKEN_SECRET || !process.env.CONNECTION_STRING){
    throw new Error ("ACCESS_TOKEN_SECRET or CONNECTION_STRING is missing")
}
connectDB()
const port = process.env.PORT
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/books", bookRoutes)
app.use("/api/series", seriesRoutes)
app.use("/api/quotes", quotesRoutes)
app.use("/api/users", userRoutes)
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
