import dotenv from "dotenv"
dotenv.config()

import cors from "cors"
import express, { Request, Response } from "express"
import http from "http"
import { Server } from "socket.io"
import path from "path"
import registerServerSocket from "./src/socket"

const app = express()
app.use(express.json())

if (process.env.NODE_ENV === "development") app.use(cors())

// Add
app.use(express.static(path.join(__dirname, "./build")))

app.get("*", (req: Request, res: Response) => {
	res.sendFile(path.join(__dirname, "./build", "index.html"))
})

// Socket.io
const server = http.createServer(app)
const io = new Server(server)

// Establish a connection
io.on("connection", socket => {
	registerServerSocket(io, socket)
})

const port = process.env.PORT || 5000

server.listen(port, () => console.log(`Server up and running on port ${port}!`))
