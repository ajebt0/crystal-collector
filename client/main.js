console.log("MAIN JS LOADED")
import { createMenu } from './ui/menu.js'
import { startGame } from './game/scene.js'
import { socket } from './net/socket.js'

createMenu((room, name, mode) => {
    socket.emit("joinRoom", room, mode)
    socket.emit("setName", name || "Guest")
    startGame()
})