import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { registerSocket } from './socket/index.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

app.use(cors())
app.use(express.json())

// Сокет система
registerSocket(io)

const PORT = 3000
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})