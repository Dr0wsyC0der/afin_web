# AFIN Website Project

## Структура проекта
- `index.html` - Главная страница (лендинг)
- `styles/style.css` - Основные стили
- `scripts/script.js` - JavaScript функциональность
- `images/` - Папка для изображений

## Настройка и запуск

1. Создайте папку проекта и разместите все файлы согласно структуре
2. Для локального запуска откройте `index.html` в браузере
3. Для размещения на хостинге загрузите все файлы на сервер

## Интеграции

### CRM интеграция
Замените обработчик формы в `script.js` на отправку данных в вашу CRM:

```javascript
// Пример для amoCRM
fetch('https://yourcrm.amocrm.ru/api/v4/leads', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer YOUR_TOKEN',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: data.name,
        company: data.company,
        // ... другие поля
    })
})
