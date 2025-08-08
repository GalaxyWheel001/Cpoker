# Backend API Setup для Poker Room

## Технологии для Backend

Рекомендуемые варианты:
- **Node.js + Express + Socket.io** (быстрая разработка)
- **Python + FastAPI + WebSockets** (производительность)
- **Go + Gin + Gorilla WebSocket** (максимальная производительность)

## Основные эндпоинты

### Аутентификация
```javascript
POST /api/auth/telegram
{
  "id": 123456789,
  "first_name": "John",
  "username": "john_doe",
  "photo_url": "https://...",
  "hash": "abc123..."
}
```

### Столы
```javascript
GET /api/tables
POST /api/tables
{
  "name": "Высокие ставки",
  "gameType": "cash",
  "currency": "usdt",
  "buyIn": 100,
  "maxPlayers": 6
}
POST /api/tables/:id/join
{
  "buyIn": 100
}
```

### Игра
```javascript
POST /api/game/action
{
  "action": "call", // fold, call, raise, check
  "amount": 50
}
```

### Транзакции
```javascript
GET /api/transactions
POST /api/transactions/deposit
{
  "amount": 100,
  "currency": "usdt"
}
```

## WebSocket события

```javascript
// Сервер -> Клиент
{
  "type": "GAME_STATE_UPDATE",
  "payload": {
    "pot": 250,
    "communityCards": ["Ah", "Kd", "7s"],
    "gamePhase": "flop",
    "players": [...]
  }
}

// Клиент -> Сервер
{
  "type": "GAME_ACTION",
  "payload": {
    "action": "raise",
    "amount": 50
  }
}
```

## База данных

Рекомендуемая схема:
- **Users** - пользователи
- **Tables** - игровые столы
- **Games** - игровые сессии
- **Transactions** - транзакции
- **GameActions** - действия в игре

## Безопасность

1. **JWT токены** для аутентификации
2. **Валидация Telegram данных** на сервере
3. **Rate limiting** для API
4. **WebSocket аутентификация**
5. **Валидация игровых действий**

## Развертывание

### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://...
      - TELEGRAM_BOT_TOKEN=...
    depends_on:
      - postgres
      - redis
  
  postgres:
    image: postgres:14
    environment:
      - POSTGRES_DB=poker_room
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    
  redis:
    image: redis:7-alpine
```

## Тестирование API

Используйте Postman или curl для тестирования:

```bash
# Создание стола
curl -X POST http://localhost:3001/api/tables \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Тестовый стол",
    "gameType": "cash",
    "currency": "chips",
    "buyIn": 1000,
    "maxPlayers": 6
  }'
```
