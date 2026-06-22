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

export function gameSocket(io, socket, state) {
    console.log(`Game socket initialized for ${socket.id}`)
    const players = state.players
    const TIME_ATTACK_DURATION = 120
    let gameTimers = {}

    socket.on("setName", (name) => {
        console.log(`[NAME] ${socket.id} set name to ${name}`)
        if (players[socket.id]) {
            players[socket.id].name = name || "Guest"
            io.emit("players", players)
        }
    })

    socket.on("requestCoins", () => {
        console.log(`[REQUEST] Coins requested by ${socket.id}, room: ${socket.room}`)
        const room = state.rooms[socket.room]
        if (room) {
            console.log(`[REQUEST] Sending ${room.coins.length} coins to ${socket.id}`)
            socket.emit("coins", room.coins)
        } else {
            if (socket.room) {
                const initialCoins = generateCoins(20)
                state.rooms[socket.room] = {
                    coins: initialCoins,
                    mode: 'timeattack'
                }
                console.log(`[REQUEST] Created new room with ${initialCoins.length} coins`)
                socket.emit("coins", initialCoins)
            }
        }
    })

    socket.on("forceCoins", () => {
        console.log(`[FORCE] Force coins for ${socket.id}, room: ${socket.room}`)
        const room = state.rooms[socket.room]
        if (room) {
            room.coins = generateCoins(20)
            console.log(`[FORCE] Created ${room.coins.length} coins`)
            io.to(socket.room).emit("coins", room.coins)
        } else {
            if (socket.room) {
                const initialCoins = generateCoins(20)
                state.rooms[socket.room] = {
                    coins: initialCoins,
                    mode: 'timeattack'
                }
                console.log(`[FORCE] Created new room with ${initialCoins.length} coins`)
                socket.emit("coins", initialCoins)
            }
        }
    })

    socket.on("move", (data) => {
        const player = players[socket.id]
        if (!player || player.won) return

        player.x = data.x || 0
        player.y = data.y || 0
        player.z = data.z || 0

        const room = state.rooms[socket.room]
        if (!room || !room.coins) return

        let collected = false
        const coinsToRemove = []

        room.coins.forEach((coin, index) => {
            const dx = player.x - coin.x
            const dz = player.z - coin.z
            const dist = Math.sqrt(dx * dx + dz * dz)

            if (dist < 1) {
                player.score += 10
                collected = true
                coinsToRemove.push(index)

                // Отправляем обновленный счет
                io.emit("timeAttackScore", {
                    id: socket.id,
                    name: player.name,
                    score: player.score
                })
            }
        })

        // Удаляем собранные монеты
        if (coinsToRemove.length > 0) {
            for (let i = coinsToRemove.length - 1; i >= 0; i--) {
                room.coins.splice(coinsToRemove[i], 1)
            }
        }

        // Добавляем новые монеты
        if (collected) {
            const newCoin = {
                id: Date.now() + Math.random(),
                x: (Math.random() - 0.5) * 20,
                z: (Math.random() - 0.5) * 20
            }
            room.coins.push(newCoin)
        }

        // Если монет мало, добавляем новые
        if (room.coins.length < 10) {
            const newCoins = generateCoins(5)
            room.coins = [...room.coins, ...newCoins]
        }

        io.emit("players", players)
        io.to(socket.room).emit("coins", room.coins)
    })

    socket.on("startTimeAttack", () => {
        const room = state.rooms[socket.room]
        if (!room) return

        // Сброс очков
        Object.keys(players).forEach(id => {
            if (players[id]) {
                players[id].score = 0
                players[id].won = false
            }
        })

        room.coins = generateCoins(20)

        let timeLeft = TIME_ATTACK_DURATION

        io.to(socket.room).emit("timeAttackStart", {
            duration: TIME_ATTACK_DURATION,
            coins: room.coins
        })
        io.emit("players", players)
        io.to(socket.room).emit("coins", room.coins)

        if (gameTimers[socket.room]) {
            clearInterval(gameTimers[socket.room])
        }

        gameTimers[socket.room] = setInterval(() => {
            timeLeft--

            // Добавляем новые монеты каждые 2 секунды
            if (timeLeft % 2 === 0 && room.coins.length < 30) {
                const newCoins = generateCoins(3)
                room.coins = [...room.coins, ...newCoins]
                io.to(socket.room).emit("coins", room.coins)
            }

            io.to(socket.room).emit("timeAttackTick", timeLeft)

            if (timeLeft <= 0) {
                clearInterval(gameTimers[socket.room])
                delete gameTimers[socket.room]

                let winner = null
                let maxScore = -1

                Object.keys(players).forEach(id => {
                    const p = players[id]
                    if (p && p.score > maxScore) {
                        maxScore = p.score
                        winner = p
                    }
                })

                if (winner) {
                    winner.won = true
                    io.emit("win", {
                        id: socket.id,
                        name: winner.name,
                        score: winner.score,
                        mode: 'timeattack',
                        timeUp: true
                    })
                }

                room.coins = []
                io.to(socket.room).emit("coins", room.coins)
            }
        }, 1000)
    })

    socket.on("disconnect", () => {
        if (socket.room && gameTimers[socket.room]) {
            const roomPlayers = Object.keys(players).filter(id => {
                return state.rooms[socket.room] && players[id]
            })

            if (roomPlayers.length === 0) {
                clearInterval(gameTimers[socket.room])
                delete gameTimers[socket.room]
            }
        }
    })
}