# Digital Black Card MVP

## Step-by-Step Setup Instructions

Для того чтобы всё заработало "из коробки" и подключалось к Apple Wallet, вам нужно правильно настроить шаблон в PassNinja (он берёт на себя подпись сертификатами Apple). Следуйте этой инструкции:

### 1. Настройка PassNinja
1. Зарегистрируйтесь на [PassNinja](https://passninja.com/) (это бесплатно для тестов).
2. Перейдите в **Dashboard -> Settings** и скопируйте:
   - **Account ID**
   - **API Key**
3. Перейдите в раздел **Passes -> Templates** и создайте новый шаблон (Create Template).
   - Выберите тип (например, Generic или Member).
   - Настройте цвета (черный фон `#000000`, белый текст `#ffffff`).
   - Добавьте поле (Field) с ключом **`name`** (обязательно строчными буквами). Это поле будет заполняться именем из формы.
   - Сохраните шаблон.
4. Скопируйте **Template ID** (обычно начинается с `ptk_`).

### 2. Настройка Backend (Cloudflare Workers)
1. Откройте файл `worker.js`.
2. В самом начале файла замените 3 константы на ваши реальные ключи из PassNinja:
   - `PASSNINJA_API_KEY`
   - `PASSNINJA_ACCOUNT_ID`
   - `PASSNINJA_TEMPLATE_ID`
3. Задеплойте `worker.js` в Cloudflare Workers и скопируйте публичный URL воркера (например, `https://my-worker.my-subdomain.workers.dev`).

### 3. Настройка Frontend
1. Откройте `index.html`.
2. Найдите строку:
   ```javascript
   const WORKER_URL = 'https://your-worker-subdomain.workers.dev/';
   ```
3. Замените URL на реальный адрес вашего задеплоенного воркера.
4. Задеплойте `index.html` (например, на GitHub Pages).

### Как это работает?
Пользователь вводит имя, фронтенд отправляет его в воркер. Воркер делает защищенный запрос к PassNinja API с вашими скрытыми ключами. PassNinja генерирует Apple Wallet Pass и возвращает специальную ссылку (landing page). Воркер передает ссылку фронтенду, а тот автоматически перенаправляет пользователя на страницу установки пасса, откуда в 1 клик его можно добавить в Apple Wallet!
