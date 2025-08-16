import express, { Application, Request, Response } from "express"
import { router } from "./app/routes"


const app : Application = express()
app.use(express.json())

app.use("/api/v1", router)

app.get('/', (req : Request, res : Response) => {
  res.send('Welcome to the Ride Booking System')
})


export default app;