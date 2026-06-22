export function setupChat(socket) {
    // Контейнер чата
    const chatContainer = document.createElement("div")
    chatContainer.style.position = "absolute"
    chatContainer.style.bottom = "70px"
    chatContainer.style.right = "20px"
    chatContainer.style.width = "300px"
    chatContainer.style.height = "200px"
    chatContainer.style.overflow = "auto"
    chatContainer.style.background = "rgba(0,0,0,0.7)"
    chatContainer.style.borderRadius = "8px"
    chatContainer.style.padding = "10px"
    chatContainer.style.backdropFilter = "blur(5px)"
    document.body.appendChild(chatContainer)

    // Инпут чата
    const input = document.createElement("input")
    input.style.position = "absolute"
    input.style.bottom = "20px"
    input.style.right = "20px"
    input.style.width = "300px"
    input.style.padding = "8px 12px"
    input.style.borderRadius = "8px"
    input.style.border = "2px solid #4444ff"
    input.style.background = "rgba(0,0,0,0.7)"
    input.style.color = "white"
    input.style.fontSize = "14px"
    input.placeholder = "Type a message..."
    document.body.appendChild(input)

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && input.value.trim()) {
            socket.emit("chat", input.value.trim())
            input.value = ""
        }
    })

    socket.on("chat", (msg) => {
        const line = document.createElement("div")
        line.style.padding = "4px 0"
        line.style.borderBottom = "1px solid rgba(255,255,255,0.1)"
        line.style.color = "#ddd"

        const nameSpan = document.createElement("span")
        nameSpan.style.color = "#00ff88"
        nameSpan.style.fontWeight = "bold"
        nameSpan.textContent = msg.name + ":"

        const textSpan = document.createElement("span")
        textSpan.textContent = " " + msg.text

        line.appendChild(nameSpan)
        line.appendChild(textSpan)
        chatContainer.appendChild(line)
        chatContainer.scrollTop = chatContainer.scrollHeight
    })
}