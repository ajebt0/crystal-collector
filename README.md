ЗАПУСК http://localhost:5173/


💎 Crystal Collector 3D
Многопользовательская 3D игра по сбору кристаллов в режиме реального времени

Three.js Socket.io Prisma Vite Node.js

📸 Скриншоты
Gameplay
Игровой процесс

Menu
Главное меню

✨ Особенности
⏱️ Time Attack режим — собери как можно больше кристаллов за 2 минуты
🌐 Мультиплеер — играй с друзьями в реальном времени
💬 Встроенный чат — общайся с другими игроками
🎯 3D графика — полноценный 3D мир на Three.js
🔄 Динамические монеты — новые кристаллы появляются каждые 2 секунды
💾 База данных — сохранение прогресса через PostgreSQL + Prisma
🏆 Система победителей — определяет лучшего игрока
🎮 Как играть
Введи имя (или оставь автоматическое)
Выбери комнату (по умолчанию "lobby")
Нажми "Join Game"
Прочитай правила и нажми "START GAME"
Управляй персонажем с помощью WASD
Собирай кристаллы и набери максимум очков за 2 минуты!
Побеждает игрок с наибольшим количеством кристаллов! 🏆
🛠️ Технологии
Компонент	Технология
3D Движок	Three.js
Сервер	Node.js + Express
Реалтайм	Socket.io
База данных	PostgreSQL + Prisma
Сборка	Vite
📦 Установка
Требования
Node.js (v18 или выше)
PostgreSQL (или Neon)
npm или yarn
Пошаговая инструкция
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
