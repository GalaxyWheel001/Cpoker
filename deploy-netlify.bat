@echo off
echo 🚀 Подготовка к деплою на Netlify...
echo.

echo 📦 Установка зависимостей...
call npm install

echo.
echo 🔨 Сборка проекта...
call npm run build

echo.
echo ✅ Сборка завершена!
echo.
echo 📁 Папка dist готова для загрузки на Netlify
echo.
echo 🌐 Для деплоя:
echo 1. Зайдите на https://netlify.com
echo 2. Перетащите папку dist в область "Drag and drop your site output folder here"
echo 3. Получите URL вашего сайта
echo.
echo 🎉 Удачи с деплоем!
pause
