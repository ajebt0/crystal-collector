import * as THREE from "three"
import { socket } from "../net/socket.js"

export function setupRemotePlayers(scene) {
    const players = {}

    socket.on("players", (data) => {
        // Обновляем существующих и создаем новых
        Object.keys(data).forEach(id => {
            if (id === socket.id) return

            const playerData = data[id]
            if (!playerData) return

            if (!players[id]) {
                const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8)
                const material = new THREE.MeshStandardMaterial({
                    color: 0xff4488,
                    emissive: new THREE.Color(0xff4488),
                    emissiveIntensity: 0.2
                })
                const mesh = new THREE.Mesh(geometry, material)
                mesh.castShadow = true
                scene.add(mesh)
                players[id] = mesh
            }

            players[id].position.set(
                playerData.x || 0,
                playerData.y || 0,
                playerData.z || 0
            )
        })

        // Удаляем игроков, которых больше нет
        Object.keys(players).forEach(id => {
            if (!data[id]) {
                scene.remove(players[id])
                delete players[id]
            }
        })
    })

    return players
}