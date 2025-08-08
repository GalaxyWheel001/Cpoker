#!/bin/bash

echo "🚀 Настройка Poker Room для разработки..."

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Установите Node.js 16+ и попробуйте снова."
    exit 1
fi

# Проверяем версию Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Требуется Node.js версии 16 или выше. Текущая версия: $(node -v)"
    exit 1
fi

echo "✅ Node.js версии $(node -v) найден"

# Устанавливаем зависимости
echo "📦 Установка зависимостей..."
npm install

# Создаем .env файл если его нет
if [ ! -f .env ]; then
    echo "📝 Создание .env файла..."
    cp env.example .env
    echo "⚠️  Отредактируйте .env файл с вашими настройками"
fi

# Проверяем наличие Docker (опционально)
if command -v docker &> /dev/null; then
    echo "🐳 Docker найден"
    echo "💡 Для запуска полного стека используйте: docker-compose up"
else
    echo "⚠️  Docker не найден. Установите Docker для полного стека."
fi

# Создаем папки для логов
mkdir -p logs

echo "✅ Настройка завершена!"
echo ""
echo "🎮 Для запуска в режиме разработки:"
echo "   npm start"
echo ""
echo "🔧 Для сборки production версии:"
echo "   npm run build"
echo ""
echo "📚 Документация: README.md"
