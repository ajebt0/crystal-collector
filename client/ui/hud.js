import { socket } from "../net/socket.js"

export function setupHUD() {
    const hud = document.createElement("div")
    hud.id = "hud"
    hud.style.position = "absolute"
    hud.style.top = "20px"
    hud.style.left = "20px"
    hud.style.color = "white"
    hud.style.fontFamily = "Arial, sans-serif"
    hud.style.fontSize = "18px"
    hud.style.textShadow = "0 0 10px rgba(0,0,0,0.8)"
    hud.style.background = "rgba(0,0,0,0.7)"
    hud.style.padding = "15px 20px"
    hud.style.borderRadius = "10px"
    hud.style.minWidth = "200px"
    hud.style.border = "2px solid #ff4444"
    document.body.appendChild(hud)

    // Добавляем информацию о режиме сверху
    const modeLabel = document.createElement("div")
    modeLabel.id = "modeLabel"
    modeLabel.style.color = "#ff4444"
    modeLabel.style.fontSize = "14px"
    modeLabel.style.fontWeight = "bold"
    modeLabel.style.marginBottom = "10px"
    modeLabel.textContent = "⏱️ TIME ATTACK MODE"
    hud.appendChild(modeLabel)

    // Контейнер для информации о игроке
    const playerInfo = document.createElement("div")
    playerInfo.id = "playerInfo"
    hud.appendChild(playerInfo)

    socket.on("players", (players) => {
        const me = players[socket.id]
        if (!me) return

        const playerCount = Object.keys(players).length

        playerInfo.innerHTML =
            '<div style="color: #00ff88; margin: 5px 0;">🎮 ' + me.name + '</div>' +
            '<div style="color: #ffd700; margin: 5px 0;">💎 Score: ' + me.score + '</div>' +
            '<div style="color: #888; margin: 5px 0; font-size: 14px;">👥 Players online: ' + playerCount + '</div>'
    })

    // Добавляем легенду управления внизу HUD
    const controls = document.createElement("div")
    controls.style.marginTop = "10px"
    controls.style.paddingTop = "10px"
    controls.style.borderTop = "1px solid rgba(255,255,255,0.1)"
    controls.style.fontSize = "12px"
    controls.style.color = "#666"
    controls.innerHTML = `
    <span style="color: #888;">W A S D</span> - Move
  `
    hud.appendChild(controls)
}