import * as THREE from "three"

export function setupCamera(camera, player) {
    const offset = new THREE.Vector3(0, 6, 10)
    const target = new THREE.Vector3()

    return {
        update() {
            target.copy(player.position).add(offset)
            camera.position.lerp(target, 0.1)
            camera.lookAt(player.position)
        }
    }
}