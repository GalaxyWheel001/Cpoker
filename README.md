# Poker Room - Современная платформа для игры в покер

Современное React-приложение для игры в покер с поддержкой Telegram аутентификации, real-time игрового процесса и криптовалютных транзакций.

## 🚀 Основные возможности

- **🎮 Реальная игра в покер** - Texas Hold'em с real-time обновлениями
- **🔐 Telegram аутентификация** - Безопасный вход через Telegram
- **💰 Криптовалютные транзакции** - Поддержка USDT депозитов/выводов
- **📊 Статистика игр** - Детальная аналитика и история транзакций
- **🎨 Современный UI/UX** - Адаптивный дизайн с темной темой, градиентами, анимациями и стеклянными эффектами
- **🔔 Real-time уведомления** - WebSocket для мгновенных обновлений
- **📱 Полная мобильная адаптация** - Компактный и красивый дизайн для всех устройств

## 🛠️ Технологический стек

- **React 18** - Современная версия React с улучшенным рендерингом
- **Redux Toolkit** - Управление состоянием приложения
- **Vite** - Быстрый сборщик и dev-сервер
- **Tailwind CSS** - Utility-first CSS фреймворк
- **Framer Motion** - Плавные анимации интерфейса
- **WebSocket** - Real-time обновления игры
- **React Router v6** - Маршрутизация приложения
- **Axios** - HTTP клиент для API запросов

## 📋 Требования

- Node.js (v16.x или выше)
- npm или yarn
- Telegram Bot Token (для аутентификации)

## 🛠️ Установка и запуск

1. **Клонируйте репозиторий:**
   ```bash
   git clone <repository-url>
   cd poker_room
   ```

2. **Установите зависимости:**
   ```bash
   npm install
   ```

3. **Настройте переменные окружения:**
   ```bash
   cp env.example .env
   ```
   
   Отредактируйте `.env` файл:
   ```env
   VITE_API_URL=http://localhost:3001/api
   VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   VITE_TELEGRAM_BOT_USERNAME=your_bot_username
   VITE_WS_URL=ws://localhost:3001
   ```

4. **Запустите dev-сервер:**
   ```bash
   npm start
   ```

5. **Откройте браузер:**
   ```
   http://localhost:4028
   ```

## 📁 Структура проекта

```
poker_room/
├── src/
│   ├── components/          # Переиспользуемые компоненты
│   │   ├── ui/             # UI компоненты (Button, Card, Modal, etc.)
│   │   └── ...
│   ├── pages/              # Страницы приложения
│   │   ├── game-lobby/     # Лобби игр
│   │   ├── poker-table-game/ # Игровой стол
│   │   ├── telegram-authentication/ # Аутентификация
│   │   ├── design-showcase/ # Демо дизайна
│   │   └── ...
│   ├── store/              # Redux store и слайсы
│   │   ├── slices/         # Redux Toolkit слайсы
│   │   └── index.js        # Конфигурация store
│   ├── services/           # API сервисы
│   ├── hooks/              # Кастомные хуки
│   ├── utils/              # Утилиты и хелперы
│   ├── contexts/           # React контексты
│   └── styles/             # Глобальные стили и анимации
├── public/                 # Статические файлы
├── env.example             # Пример переменных окружения
├── DESIGN_IMPROVEMENTS.md  # Документация по улучшениям дизайна
└── package.json           # Зависимости и скрипты
```

## 🔧 Конфигурация

### Telegram Bot Setup

1. Создайте бота через [@BotFather](https://t.me/botfather)
2. Получите токен и username
3. Добавьте в `.env` файл:
   ```env
   VITE_TELEGRAM_BOT_TOKEN=your_bot_token
   VITE_TELEGRAM_BOT_USERNAME=your_bot_username
   ```

### API Backend

Приложение ожидает backend API на `http://localhost:3001` с следующими эндпоинтами:

- `POST /api/auth/telegram` - Telegram аутентификация
- `GET /api/tables` - Получение списка столов
- `POST /api/tables` - Создание нового стола
- `POST /api/game/action` - Игровые действия
- `GET /api/transactions` - История транзакций
- `POST /api/transactions/deposit` - Создание депозита

## 🎮 Игровой процесс

1. **Аутентификация** - Вход через Telegram
2. **Лобби** - Выбор или создание стола
3. **Игра** - Texas Hold'em с real-time обновлениями
4. **Транзакции** - Депозиты и выводы в USDT

## 🎨 Дизайн и UX

### Современные эффекты
- **Градиенты**: Красивые цветовые переходы
- **Стеклянные эффекты**: Размытие и прозрачность
- **Анимации**: Плавные переходы и микроинтеракции
- **Свечение**: Эффекты свечения для важных элементов

### Компоненты
- **Кнопки**: Градиентные, стеклянные, светящиеся
- **Карточки**: Современные карточки с эффектами
- **Прогресс-бары**: Анимированные индикаторы
- **Модальные окна**: С анимациями появления/исчезновения

### Мобильная адаптация
- **Компактный покерный стол**: Оптимизированное расположение игроков для мобильных устройств
- **Адаптивные элементы**: Все компоненты автоматически подстраиваются под размер экрана
- **Touch-friendly интерфейс**: Удобные размеры кнопок и элементов управления
- **Оптимизированные панели**: Чат и информация об игре не перекрывают игровой стол

### Демонстрация
Перейдите на `/design-showcase` для просмотра всех улучшений дизайна в действии.

## 🚀 Развертывание

### Production Build

```bash
npm run build
```

### Docker (опционально)

```bash
docker build -t poker-room .
docker run -p 80:80 poker-room
```

## 🧪 Тестирование

```bash
npm test
```

## 📝 Лицензия

MIT License

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📞 Поддержка

- Email: support@pokerroom.com
- Telegram: @pokerroom_support

---

Built with ❤️ using React, Redux Toolkit, and Tailwind CSS
