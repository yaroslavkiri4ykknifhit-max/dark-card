# Digital Black Card MVP

## Step-by-Step Setup Instructions (WalletWallet API)

Мы переключились на [WalletWallet.dev](https://www.walletwallet.dev/), который намного проще для разработчиков и не требует сложных шаблонов.

### 1. Настройка Backend (Cloudflare Workers)
Ваш API-ключ уже вшит в `worker.js`. 
Всё, что вам нужно сделать:
1. Задеплоить файл `worker.js` в Cloudflare Workers.
2. Скопировать публичный URL воркера (например, `https://my-worker.my-subdomain.workers.dev`).

### 2. Настройка Frontend
1. Откройте `index.html`.
2. Найдите строку:
   ```javascript
   const WORKER_URL = 'https://your-worker-subdomain.workers.dev/';
   ```
3. Замените URL на реальный адрес вашего задеплоенного воркера (или на `http://localhost:8787/`, если тестируете через Wrangler).
4. Откройте `index.html` в браузере.

### Как это работает?
Пользователь вводит имя, фронтенд отправляет его в воркер. Воркер формирует нужный JSON с вашим дизайном (черный фон, нужные поля) и делает запрос к API WalletWallet. WalletWallet мгновенно подписывает Apple Wallet Pass и возвращает его в виде base64-строки. Наш воркер декодирует её в бинарный файл `.pkpass` и отдает фронтенду, который автоматически скачивает файл. При открытии этого файла на Mac или iPhone он сразу же добавляется в Apple Wallet!
