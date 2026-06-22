import * as THREE from "three"
import { createPlayer } from "./player.js"
import { setupCamera } from "./camera.js"
import { setupCoins } from "./coins.js"
import { setupRemotePlayers } from "./remotePlayer.js"
import { setupChat } from "../ui/chat.js"
import { setupHUD } from "../ui/hud.js"
import { socket } from "../net/socket.js"

export function startGame() {
    console.log("Starting game...")

    try {
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0x1a1a2e)

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.set(0, 8, 12)

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        document.body.appendChild(renderer.domElement)
        console.log("Renderer created")

        const ambientLight = new THREE.AmbientLight(0x404060)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(10, 20, 10)
        directionalLight.castShadow = true
        scene.add(directionalLight)

        const groundGeometry = new THREE.PlaneGeometry(30, 30)
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a4a,
            roughness: 0.8,
            metalness: 0.2
        })
        const ground = new THREE.Mesh(groundGeometry, groundMaterial)
        ground.rotation.x = -Math.PI / 2
        ground.position.y = -0.5
        ground.receiveShadow = true
        scene.add(ground)

        const gridHelper = new THREE.GridHelper(30, 20, 0x4444ff, 0x444488)
        gridHelper.position.y = -0.45
        scene.add(gridHelper)

        const player = createPlayer(scene)
        console.log("Player created")

        const cameraSystem = setupCamera(camera, player)
        const coinsSystem = setupCoins(scene)
        console.log("Coins system setup")

        const remote = setupRemotePlayers(scene)

        setupHUD()
        setupChat(socket)

        // Проверка монет
        let coinCheckAttempts = 0
        const checkCoinsInterval = setInterval(() => {
            const coinCount = Object.keys(coinsSystem).length
            console.log(`Coin check attempt ${coinCheckAttempts + 1}: ${coinCount} coins`)

            if (coinCount === 0) {
                console.log("No coins found, requesting...")
                socket.emit("requestCoins")
                coinCheckAttempts++

                if (coinCheckAttempts > 3) {
                    console.log("Forcing coins creation...")
                    socket.emit("forceCoins")
                    clearInterval(checkCoinsInterval)
                }
            } else {
                console.log(`Found ${coinCount} coins!`)
                clearInterval(checkCoinsInterval)
            }
        }, 1000)

        setTimeout(() => {
            clearInterval(checkCoinsInterval)
        }, 10000)

        let gameWon = false
        let timeLeft = 120
        let isTimeAttackRunning = false

        const keys = { w: false, a: false, s: false, d: false }

        // Автоматически показываем информацию о Time Attack
        socket.on("gameMode", (mode) => {
            console.log(`Game mode: timeattack`)
            setTimeout(() => {
                showTimeAttackInfo()
            }, 500)
        })

        function showTimeAttackInfo() {
            const oldInfo = document.getElementById("timeAttackInfo")
            if (oldInfo) oldInfo.remove()

            const info = document.createElement("div")
            info.id = "timeAttackInfo"
            info.style.position = "absolute"
            info.style.top = "50%"
            info.style.left = "50%"
            info.style.transform = "translate(-50%, -50%)"
            info.style.background = "rgba(0,0,0,0.9)"
            info.style.color = "white"
            info.style.padding = "30px"
            info.style.borderRadius = "12px"
            info.style.textAlign = "center"
            info.style.border = "2px solid #ff4444"
            info.style.zIndex = "1000"
            info.style.maxWidth = "400px"
            info.innerHTML = `
        <h2 style="color: #ff4444; font-size: 32px;">⏱️ TIME ATTACK</h2>
        <div style="font-size: 48px; margin: 20px 0;">⚔️</div>
        <p style="font-size: 18px; margin: 10px 0;">Collect as many crystals as possible!</p>
        <p style="font-size: 14px; color: #ff8888; margin: 10px 0;">⏱️ 2 minutes on the clock</p>
        <p style="font-size: 14px; color: #88ff88; margin: 10px 0;">✨ New crystals spawn every 2 seconds</p>
        <p style="font-size: 14px; color: #ffd700; margin: 10px 0;">🏆 Player with most crystals wins!</p>
        <button id="startTimeAttackBtn" style="
          margin-top: 20px;
          padding: 15px 40px;
          font-size: 20px;
          background: linear-gradient(135deg, #ff4444, #cc0000);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          box-shadow: 0 4px 15px rgba(255,68,68,0.3);
          transition: transform 0.2s;
        "
        onmouseover="this.style.transform='scale(1.05)'"
        onmouseout="this.style.transform='scale(1)'"
        >START GAME</button>
      `
            document.body.appendChild(info)

            document.getElementById("startTimeAttackBtn").addEventListener("click", () => {
                const infoElement = document.getElementById("timeAttackInfo")
                if (infoElement) infoElement.remove()
                socket.emit("startTimeAttack")
                isTimeAttackRunning = true
            })
        }

        document.addEventListener("keydown", (e) => {
            const key = e.key.toLowerCase()
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return
            }
            if (key in keys) {
                e.preventDefault()
                keys[key] = true
            }
        })

        document.addEventListener("keyup", (e) => {
            const key = e.key.toLowerCase()
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return
            }
            if (key in keys) {
                e.preventDefault()
                keys[key] = false
            }
        })

        socket.on("timeAttackTick", (time) => {
            timeLeft = time
            updateTimeDisplay()
        })

        socket.on("timeAttackStart", (data) => {
            isTimeAttackRunning = true
            timeLeft = data.duration
            updateTimeDisplay()
        })

        function updateTimeDisplay() {
            let timerElement = document.getElementById("timeAttackTimer")
            if (!timerElement) {
                timerElement = document.createElement("div")
                timerElement.id = "timeAttackTimer"
                timerElement.style.position = "absolute"
                timerElement.style.top = "20px"
                timerElement.style.right = "20px"
                timerElement.style.background = "rgba(0,0,0,0.7)"
                timerElement.style.color = "#ff4444"
                timerElement.style.padding = "10px 20px"
                timerElement.style.borderRadius = "8px"
                timerElement.style.fontSize = "24px"
                timerElement.style.fontWeight = "bold"
                timerElement.style.fontFamily = "Arial, sans-serif"
                document.body.appendChild(timerElement)
            }

            const minutes = Math.floor(timeLeft / 60)
            const seconds = timeLeft % 60
            timerElement.textContent = `⏱️ ${minutes}:${seconds.toString().padStart(2, '0')}`

            if (timeLeft <= 10) {
                timerElement.style.color = "#ff0000"
                timerElement.style.animation = "blink 0.5s infinite"
            }
        }

        const style = document.createElement('style')
        style.textContent = `
      @keyframes blink {
        0% { opacity: 1; }
        50% { opacity: 0.3; }
        100% { opacity: 1; }
      }
    `
        document.head.appendChild(style)

        function updateMovement() {
            if (gameWon) return

            const speed = 0.15
            let moved = false
            let newX = player.position.x
            let newZ = player.position.z

            if (keys.w) { newZ -= speed; moved = true }
            if (keys.s) { newZ += speed; moved = true }
            if (keys.a) { newX -= speed; moved = true }
            if (keys.d) { newX += speed; moved = true }

            if (moved) {
                player.position.x = newX
                player.position.z = newZ

                socket.emit("move", {
                    x: player.position.x,
                    y: player.position.y,
                    z: player.position.z
                })
            }
        }

        socket.on("win", (data) => {
            gameWon = true
            isTimeAttackRunning = false

            const message = `⏱️ TIME'S UP!\n🏆 ${data.name} wins with ${data.score} coins collected!`
            alert(message)

            const timerElement = document.getElementById("timeAttackTimer")
            if (timerElement) timerElement.remove()
        })

        window.addEventListener('resize', () => {
            const width = window.innerWidth
            const height = window.innerHeight
            renderer.setSize(width, height)
            camera.aspect = width / height
            camera.updateProjectionMatrix()
        })

        function animate() {
            requestAnimationFrame(animate)

            updateMovement()
            cameraSystem.update()

            renderer.render(scene, camera)
        }

        animate()

        console.log("Game started! Use WASD to move")

    } catch (error) {
        console.error("Error starting game:", error)
    }
}