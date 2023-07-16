import express from "express"
import compress from "compression"
import helmet from "helmet"
import cors from "cors"
import cookieParser from "cookie-parser"
import session from "express-session"
import passport from "passport"

import userRoutes from "./routes/user.routes"
import questionRoutes from "./routes/question.routes"
import answerRoutes from "./routes/answer.routes"
import "./passport.config"
import "dotenv/config"


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(compress())
app.use(helmet())
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true
}))
app.use(cookieParser())
app.use(passport.initialize())
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 10 * 60 * 1000
  }
}))
app.use(passport.session())

app.use("/", userRoutes)
app.use("/", questionRoutes)
app.use("/", answerRoutes)

export default app