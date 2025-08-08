# Poker Room Backend - Быстрый старт

Минимальная версия backend для бета-тестирования покерной комнаты.

## 🚀 Быстрый запуск

### 1. Установка зависимостей
```bash
cd backend-quickstart
npm install
```

### 2. Настройка окружения
```bash
cp env.example .env
```

Отредактируйте `.env` файл:
```env
# Обязательные настройки
JWT_SECRET=your-super-secret-jwt-key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_BOT_USERNAME=your_bot_username

# Опциональные настройки
PORT=3001
FRONTEND_URL=http://localhost:4028
```

### 3. Запуск сервера
```bash
# Режим разработки
npm run dev

# Продакшн режим
npm start
```

## 📋 Что включено

### ✅ Готовые компоненты
- **Express сервер** с middleware
- **Socket.IO** для real-time обновлений
- **SQLite база данных** с автоматической инициализацией
- **JWT аутентификация**
- **Rate limiting** и безопасность
- **CORS** настройки
- **Логирование** ошибок

### 🔧 API эндпоинты
- `POST /api/auth/telegram` - Telegram аутентификация
- `GET /api/users/profile` - Профиль пользователя
- `GET /api/tables` - Список столов
- `POST /api/tables` - Создание стола
- `POST /api/game/action` - Игровые действия
- `GET /api/transactions` - История транзакций
- `GET /api/tournaments` - Список турниров

### 🔌 WebSocket события
- `join_table` - Присоединение к столу
- `leave_table` - Выход со стола
- `player_action` - Действие игрока
- `chat_message` - Сообщения в чате

## 🗄️ База данных

Автоматически создаются таблицы:
- `users` - Пользователи
- `tables` - Игровые столы
- `games` - Активные игры
- `transactions` - Транзакции
- `tournaments` - Турниры
- `achievements` - Достижения

## 🔐 Безопасность

- **Helmet** - Заголовки безопасности
- **Rate limiting** - Ограничение запросов
- **CORS** - Настройки cross-origin
- **JWT** - Токены аутентификации
- **Валидация** - Проверка входных данных

## 📱 Интеграция с Frontend

### Настройка frontend
Обновите `.env` файл в корне проекта:
```env
VITE_API_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001
```

### WebSocket подключение
```javascript
import { io } from 'socket.io-client';

const socket = io('ws://localhost:3001');

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.emit('join_table', { tableId: 1, playerId: 123, playerName: 'Player' });
```

## 🧪 Тестирование

### Запуск тестов
```bash
npm test
```

### Проверка здоровья сервера
```bash
curl http://localhost:3001/api/health
```

## 📊 Мониторинг

### Логи
- Все запросы логируются в консоль
- Ошибки сохраняются в лог файлы
- WebSocket подключения отслеживаются

### Метрики
- Количество активных подключений
- Время ответа API
- Количество ошибок

## 🚀 Развертывание

### Локальное развертывание
```bash
npm start
```

### Docker развертывание
```bash
docker build -t poker-room-backend .
docker run -p 3001:3001 poker-room-backend
```

### Production настройки
1. Измените `NODE_ENV=production`
2. Настройте `JWT_SECRET`
3. Добавьте SSL сертификат
4. Настройте reverse proxy (Nginx)

## 🔧 Конфигурация

### Переменные окружения
| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `PORT` | Порт сервера | 3001 |
| `JWT_SECRET` | Секрет для JWT | required |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot токен | required |
| `FRONTEND_URL` | URL frontend | http://localhost:4028 |
| `DB_PATH` | Путь к базе данных | ./poker_room.db |

## 📞 Поддержка

### Полезные команды
```bash
# Перезапуск сервера
npm run dev

# Очистка базы данных
rm poker_room.db

# Просмотр логов
tail -f logs/app.log
```

### Отладка
- Включите `NODE_ENV=development` для подробных логов
- Используйте `console.log()` для отладки
- Проверяйте WebSocket подключения в DevTools

## 🎯 Следующие шаги

1. **Добавить реальную игровую логику**
2. **Интегрировать платежную систему**
3. **Добавить анти-бот защиту**
4. **Настроить мониторинг**
5. **Добавить тесты**

## 📝 Лицензия

MIT License
