import * as THREE from "three"
import { socket } from "../net/socket.js"

export function setupCoins(scene) {
    const coins = {}

    function createCoin(data) {
        const geometry = new THREE.SphereGeometry(0.4, 16, 16)
        const material = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            emissive: new THREE.Color(0xffd700),
            emissiveIntensity: 0.3,
            metalness: 0.8,
            roughness: 0.2
        })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(data.x, 0.3, data.z)
        mesh.castShadow = true
        scene.add(mesh)
        return mesh
    }

    socket.on("coins", (data) => {
        console.log("Received coins from server:", data?.length || 0)

        // Очищаем старые монеты
        Object.values(coins).forEach(c => scene.remove(c))
        Object.keys(coins).forEach(k => delete coins[k])

        // Создаем новые монеты
        if (data && Array.isArray(data) && data.length > 0) {
            data.forEach(c => {
                if (c && c.x !== undefined && c.z !== undefined) {
                    coins[c.id] = createCoin(c)
                }
            })
            console.log(`Created ${Object.keys(coins).length} coins`)
        } else {
            console.log("No coins received, requesting...")
            setTimeout(() => {
                socket.emit("requestCoins")
            }, 500)
        }
    })

    // Запрашиваем монеты при запуске
    setTimeout(() => {
        console.log("Initial coin request...")
        socket.emit("requestCoins")
    }, 500)

    return coins
}