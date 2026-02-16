// Импортируем библиотеку Express для создания веб-сервера
import express from 'express';

// Создаем экземпляр приложения Express
const app = express();

// Указываем порт, на котором будет работать сервер
const port = 3000;

// Пример списка товаров (в памяти, без базы данных)
let products = [
    { id: 1, name: 'Товар 1', price: 100 },
    { id: 2, name: 'Товар 2', price: 200 },
    { id: 3, name: 'Товар 3', price: 300 }
];

// Позволяем Express автоматически парсить JSON-тело запросов
app.use(express.json());

// Маршрут для проверки, что сервер работает
app.get('/', (req, res) => {
    res.send('API для товаров готово!');
});

// Создание нового товара (POST /products)
app.post('/products', (req, res) => {
    const { name, price } = req.body; // Получаем данные из тела запроса
    if (!name || !price) {
        // Проверяем, что переданы оба поля
        return res.status(400).json({ error: 'Необходимо указать name и price' });
    }
    // Создаем новый объект товара с уникальным id (используем текущее время)
    const newProduct = { id: Date.now(), name, price };
    products.push(newProduct); // Добавляем в массив
    res.status(201).json(newProduct); // Отправляем новый товар в ответ
});

// Получение всех товаров (GET /products)
app.get('/products', (req, res) => {
    res.json(products); // Отправляем список товаров
});

// Получение конкретного товара по id (GET /products/:id)
app.get('/products/:id', (req, res) => {
    // Ищем товар по id, преобразуя строку в число
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        // Если не найдено — возвращаем ошибку 404
        return res.status(404).json({ error: 'Товар не найден' });
    }
    res.json(product); // Возвращаем найденный товар
});

// Частичное обновление товара (PATCH /products/:id)
app.patch('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        // Если товар не найден
        return res.status(404).json({ error: 'Товар не найден' });
    }
    const { name, price } = req.body; // Получаем возможные обновления
    if (name) product.name = name;    // Обновляем имя, если передано
    if (price) product.price = price; // Обновляем цену, если передана
    res.json(product); // Возвращаем обновлённый товар
});

// Удаление товара (DELETE /products/:id)
app.delete('/products/:id', (req, res) => {
    // Ищем индекс товара по id
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    // Удаляем товар из массива
    products.splice(index, 1);
    // Отправляем статус 204 (успешно без тела ответа)
    res.status(204).send();
});

// Запускаем сервер и выводим сообщение в консоль
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
