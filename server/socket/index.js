import { gameSocket } from './game.js';
import { chatSocket } from './chat.js';
import { roomSocket } from './rooms.js';

// ГЛОБАЛЬНЫЙ state
const state = {
    players: {},
    rooms: {}
};

export function registerSocket(io) {
    io.on("connection", (socket) => {
        console.log(`🟢 User connected: ${socket.id}`);

        // Инициализируем игрока
        state.players[socket.id] = {
            id: socket.id,
            name: 'Guest',
            x: 0,
            y: 0,
            z: 0,
            score: 0,
            won: false
        };

        // Регистрируем модули - ПЕРЕДАЕМ state
        gameSocket(io, socket, state);
        chatSocket(io, socket, state);
        roomSocket(io, socket, state);

        socket.on("disconnect", () => {
            console.log(`🔴 User disconnected: ${socket.id}`);
            delete state.players[socket.id];
            io.emit("players", state.players);
        });
    });
}