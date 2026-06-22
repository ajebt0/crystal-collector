import * as THREE from "three"

export function createPlayer(scene) {
    const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8)
    const material = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: new THREE.Color(0x00ff88),
        emissiveIntensity: 0.2
    })
    const player = new THREE.Mesh(geometry, material)
    player.position.set(0, 0, 0)
    player.castShadow = true
    scene.add(player)
    return player
}