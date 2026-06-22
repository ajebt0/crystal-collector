export function chatSocket(io, socket, state) {
    socket.on("chat", (text) => {
        const player = state.players[socket.id]
        if (!player) return

        const message = {
            name: player.name,
            text: text,
            time: Date.now()
        }

        io.emit("chat", message)
        console.log(`[${player.name}]: ${text}`)
    })
}