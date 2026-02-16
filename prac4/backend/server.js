// Импорт основных зависимостей
const express = require('express'); // Express — фреймворк для создания HTTP API
const { nanoid } = require('nanoid'); // nanoid — генерация коротких уникальных ID
const cors = require('cors'); // CORS — позволяет запросы с другого домена

// Создаем экземпляр приложения и настраиваем порт
const app = express();
const port = 3000;

// Начальный набор тестовых товаров
let products = [
    { id: nanoid(6), name: 'iPhone 15', category: 'Electronics', description: 'Latest smartphone with advanced camera', price: 999, stock: 50, rating: 4.8 },
    { id: nanoid(6), name: 'MacBook Pro', category: 'Electronics', description: 'High-performance laptop for professionals', price: 1999, stock: 20, rating: 4.9 },
    { id: nanoid(6), name: 'Wireless Headphones', category: 'Electronics', description: 'Noise-cancelling over-ear headphones', price: 299, stock: 100, rating: 4.5 },
    { id: nanoid(6), name: 'Coffee Maker', category: 'Home Appliances', description: 'Automatic drip coffee machine', price: 89, stock: 30, rating: 4.2 },
    { id: nanoid(6), name: 'Blender', category: 'Home Appliances', description: 'High-speed blender for smoothies', price: 59, stock: 40, rating: 4.3 },
    { id: nanoid(6), name: 'Running Shoes', category: 'Footwear', description: 'Lightweight sneakers for marathon runners', price: 129, stock: 60, rating: 4.6 },
    { id: nanoid(6), name: 'Yoga Mat', category: 'Fitness', description: 'Non-slip eco-friendly yoga mat', price: 39, stock: 80, rating: 4.4 },
    { id: nanoid(6), name: 'Protein Powder', category: 'Fitness', description: 'Whey protein for muscle gain', price: 49, stock: 25, rating: 4.7 },
    { id: nanoid(6), name: 'Organic Tea', category: 'Grocery', description: 'Assorted herbal tea blends', price: 19, stock: 150, rating: 4.1 },
    { id: nanoid(6), name: 'Dark Chocolate', category: 'Grocery', description: '70% cacao organic chocolate bar', price: 5, stock: 200, rating: 4.9 },
    { id: nanoid(6), name: 'Notebook', category: 'Stationery', description: 'Spiral-bound lined notebook', price: 8, stock: 120, rating: 4.0 },
    { id: nanoid(6), name: 'Pen Set', category: 'Stationery', description: 'Gel ink pens in assorted colors', price: 12, stock: 90, rating: 4.2 }
];

// Подключаем JSON-парсер для тела запросов
app.use(express.json());

// Настраиваем CORS
app.use(cors({
    origin: "http://localhost:5173", // разрешенный источник
    methods: ["GET", "POST", "PATCH", "DELETE"], // допустимые методы
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Логирование всех запросов (метод, статус, путь, тело для POST/PATCH)
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            console.log('Body:', req.body);
        }
    });
    next();
});

// Вспомогательная функция: ищет товар по id или отправляет 404
function findProductOr404(id, res) {
    const product = products.find(p => p.id === id);
    if (!product) {
        res.status(404).json({ error: "Product not found" });
        return null;
    }
    return product;
}

// Создание нового товара (POST /api/products)
app.post("/api/products", (req, res) => {
    const { name, category, description, price, stock, rating } = req.body;

    // Формируем новый объект продукта
    const newProduct = {
        id: nanoid(6),
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        price: Number(price),
        stock: Number(stock),
        rating: rating ? Number(rating) : undefined
    };

    // Добавляем товар в "базу"
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// Получение списка всех товаров (GET /api/products)
app.get("/api/products", (req, res) => {
    res.json(products);
});

// Получение одного товара по id (GET /api/products/:id)
app.get("/api/products/:id", (req, res) => {
    const id = req.params.id;
    const product = findProductOr404(id, res);
    if (!product) return;
    res.json(product);
});

// Обновление данных товара (PATCH /api/products/:id)
app.patch("/api/products/:id", (req, res) => {
    const id = req.params.id;
    const product = findProductOr404(id, res);
    if (!product) return;

    // Проверяем, было ли что-то передано для обновления
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Nothing to update" });
    }

    // Обновляем только переданные поля
    const { name, category, description, price, stock, rating } = req.body;
    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (rating !== undefined) product.rating = Number(rating);

    res.json(product);
});

// Удаление товара (DELETE /api/products/:id)
app.delete("/api/products/:id", (req, res) => {
    const id = req.params.id;
    const exists = products.some(p => p.id === id);
    if (!exists) return res.status(404).json({ error: "Product not found" });

    // Фильтруем список, исключая удаленный товар
    products = products.filter(p => p.id !== id);
    res.status(204).send(); // Успех, контент не возвращается
});

// Обработка несуществующих маршрутов — 404 Not Found
app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

// Глобальный обработчик ошибок (чтобы не падал сервер)
app.use((err, req, res) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

// Запускаем сервер
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
