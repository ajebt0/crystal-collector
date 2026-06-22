function generateCoins(count) {
    const coins = []
    for (let i = 0; i < count; i++) {
        coins.push({
            id: Date.now() + i + Math.random(),
            x: (Math.random() - 0.5) * 20,
            z: (Math.random() - 0.5) * 20
        })
    }
    return coins
}

export function roomSocket(io, socket, state) {
    console.log(`Room socket initialized for ${socket.id}`)

    socket.on("joinRoom", (roomName, mode = 'timeattack') => {
        console.log(`[JOIN] Player ${socket.id} joining room: ${roomName}, mode: timeattack`)

        if (socket.room) {
            socket.leave(socket.room)
        }

        socket.join(roomName)
        socket.room = roomName

        // Всегда создаем комнату с Time Attack режимом
        if (!state.rooms[roomName]) {
            const initialCoins = generateCoins(20)
            console.log(`[CREATE] New room ${roomName} with ${initialCoins.length} coins`)
            state.rooms[roomName] = {
                coins: initialCoins,
                mode: 'timeattack'
            }
        }

        // Отправляем монеты игроку
        const roomCoins = state.rooms[roomName].coins
        console.log(`[SEND] Sending ${roomCoins.length} coins to player ${socket.id}`)
        socket.emit("coins", roomCoins)

        // Отправляем режим игры
        io.to(roomName).emit("gameMode", 'timeattack')

        // Отправляем список игроков
        io.emit("players", state.players)
    })
}