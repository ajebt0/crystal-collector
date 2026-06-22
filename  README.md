# 💎 Crystal Collector 3D

> Многопользовательская 3D игра по сбору кристаллов в режиме реального времени

[![Three.js](https://img.shields.io/badge/Three.js-3D-blue?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-green?style=for-the-badge&logo=socket.io)](https://socket.io/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-purple?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Vite](https://img.shields.io/badge/Vite-Build-yellow?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Server-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)

## 📸 Скриншоты

<p align="center">
  <img src="https://via.placeholder.com/800x400/1a1a2e/ffffff?text=Gameplay+Screenshot" alt="Gameplay" width="80%">
  <br>
  <em>Игровой процесс</em>
</p>

<p align="center">
  <img src="https://via.placeholder.com/800x400/1a1a2e/ffffff?text=Menu+Screenshot" alt="Menu" width="80%">
  <br>
  <em>Главное меню</em>
</p>

## ✨ Особенности

- ⏱️ **Time Attack режим** — собери как можно больше кристаллов за 2 минуты
- 🌐 **Мультиплеер** — играй с друзьями в реальном времени
- 💬 **Встроенный чат** — общайся с другими игроками
- 🎯 **3D графика** — полноценный 3D мир на Three.js
- 🔄 **Динамические монеты** — новые кристаллы появляются каждые 2 секунды
- 💾 **База данных** — сохранение прогресса через PostgreSQL + Prisma
- 🏆 **Система победителей** — определяет лучшего игрока

## 🎮 Как играть

1. **Введи имя** (или оставь автоматическое)
2. **Выбери комнату** (по умолчанию "lobby")
3. **Нажми "Join Game"**
4. **Прочитай правила** и нажми "START GAME"
5. **Управляй персонажем** с помощью WASD
6. **Собирай кристаллы** и набери максимум очков за 2 минуты!
7. **Побеждает** игрок с наибольшим количеством кристаллов! 🏆

## 🛠️ Технологии

| Компонент | Технология |
|-----------|------------|
| 3D Движок | Three.js |
| Сервер | Node.js + Express |
| Реалтайм | Socket.io |
| База данных | PostgreSQL + Prisma |
| Сборка | Vite |

## 📦 Установка

### Требования
- Node.js (v18 или выше)
- PostgreSQL (или Neon)
- npm или yarn

### Пошаговая инструкция

```bash
# 1. Клонируй репозиторий
git clone https://github.com/ТВОЙ_НИК/crystal-collector.git
cd crystal-collector

# 2. Установи зависимости
npm install

# 3. Настрой .env файл
# Создай файл .env с DATABASE_URL
# Пример: DATABASE_URL="postgresql://user:password@localhost:5432/crystal_collector"

# 4. Сгенерируй Prisma клиент
npx prisma generate
npx prisma db push

# 5. Запусти игру
npm run start