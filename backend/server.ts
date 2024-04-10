import dotenv from "dotenv"
dotenv.config()

import cors from "cors"
import express from "express"
import http from "http"
import { Server } from "socket.io"
import registerServerSocket from "./src/socket"

const app = express()
app.use(express.json())
app.use(cors())

// Socket.io
const server = http.createServer(app)
const io = new Server(server)

// Establish a connection
io.on("connection", socket => {
	registerServerSocket(io, socket)
})

const port = process.env.PORT || 5000

server.listen(port, () => console.log(`Server up and running on port ${port}!`))
