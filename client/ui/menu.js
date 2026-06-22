export function createMenu(onJoin) {
    const menu = document.createElement("div")
    menu.style.position = "absolute"
    menu.style.top = "0"
    menu.style.left = "0"
    menu.style.width = "100%"
    menu.style.height = "100%"
    menu.style.background = "linear-gradient(135deg, #0a0a1a, #1a1a3e)"
    menu.style.display = "flex"
    menu.style.flexDirection = "column"
    menu.style.justifyContent = "center"
    menu.style.alignItems = "center"
    menu.style.color = "white"
    menu.style.fontFamily = "Arial, sans-serif"

    const title = document.createElement("h1")
    title.innerText = "💎 Crystal Collector"
    title.style.fontSize = "48px"
    title.style.marginBottom = "10px"
    title.style.textShadow = "0 0 20px rgba(0,255,136,0.5)"

    const subtitle = document.createElement("p")
    subtitle.innerText = "⏱️ Time Attack Mode - 2 minutes to collect as many crystals as possible!"
    subtitle.style.fontSize = "18px"
    subtitle.style.marginBottom = "30px"
    subtitle.style.color = "#ff4444"
    subtitle.style.fontWeight = "bold"

    const nameInput = document.createElement("input")
    nameInput.placeholder = "Your name"
    nameInput.value = "Player" + Math.floor(Math.random() * 1000)
    nameInput.style.fontSize = "20px"
    nameInput.style.padding = "12px"
    nameInput.style.margin = "10px"
    nameInput.style.borderRadius = "8px"
    nameInput.style.border = "2px solid #ff4444"
    nameInput.style.background = "rgba(255,255,255,0.1)"
    nameInput.style.color = "white"
    nameInput.style.width = "300px"

    const roomInput = document.createElement("input")
    roomInput.placeholder = "Room name"
    roomInput.value = "lobby"
    roomInput.style.fontSize = "20px"
    roomInput.style.padding = "12px"
    roomInput.style.margin = "10px"
    roomInput.style.borderRadius = "8px"
    roomInput.style.border = "2px solid #4444ff"
    roomInput.style.background = "rgba(255,255,255,0.1)"
    roomInput.style.color = "white"
    roomInput.style.width = "300px"

    // Информация о режиме
    const infoBox = document.createElement("div")
    infoBox.style.background = "rgba(255,68,68,0.1)"
    infoBox.style.border = "2px solid #ff4444"
    infoBox.style.borderRadius = "12px"
    infoBox.style.padding = "20px"
    infoBox.style.margin = "10px"
    infoBox.style.width = "300px"
    infoBox.style.textAlign = "center"
    infoBox.innerHTML = `
    <div style="color: #ff4444; font-size: 24px;">⏱️</div>
    <div style="color: #fff; font-size: 14px; margin-top: 10px;">
      <strong>Rules:</strong><br>
      • Collect as many crystals as possible<br>
      • You have 2 minutes<br>
      • New crystals spawn every 2 seconds<br>
      • Player with most crystals wins!
    </div>
  `

    const btn = document.createElement("button")
    btn.innerText = "🚀 Join Game"
    btn.style.fontSize = "24px"
    btn.style.padding = "15px 40px"
    btn.style.margin = "20px"
    btn.style.borderRadius = "12px"
    btn.style.border = "none"
    btn.style.background = "linear-gradient(135deg, #ff4444, #cc0000)"
    btn.style.color = "white"
    btn.style.cursor = "pointer"
    btn.style.fontWeight = "bold"
    btn.style.boxShadow = "0 4px 15px rgba(255,68,68,0.3)"
    btn.style.transition = "transform 0.2s"

    btn.onmouseover = () => {
        btn.style.transform = "scale(1.05)"
    }
    btn.onmouseout = () => {
        btn.style.transform = "scale(1)"
    }

    btn.onclick = () => {
        const name = nameInput.value || "Guest"
        const room = roomInput.value || "lobby"
        menu.remove()
        onJoin(room, name, 'timeattack') // Всегда timeattack
    }

    roomInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") btn.click()
    })
    nameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") btn.click()
    })

    menu.appendChild(title)
    menu.appendChild(subtitle)
    menu.appendChild(nameInput)
    menu.appendChild(roomInput)
    menu.appendChild(infoBox)
    menu.appendChild(btn)
    document.body.appendChild(menu)
}