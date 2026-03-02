// Импорт основных зависимостей
const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Создаем экземпляр приложения и настраиваем порт
const app = express();
const port = 3000;

// Начальный набор тестовых товаров
let products = [
    {
        id: nanoid(6),
        name: 'iPhone 15',
        category: 'Electronics',
        description: 'Latest smartphone with advanced camera',
        price: 999,
        stock: 50,
        rating: 4.8,
        photo: "https://www.apple.com/v/iphone/home/ci/images/overview/select/iphone_17pro__0s6piftg70ym_small_2x.jpg"
    },
    {
        id: nanoid(6),
        name: 'MacBook Pro',
        category: 'Electronics',
        description: 'High-performance laptop for professionals',
        price: 1999,
        stock: 20,
        rating: 4.9,
        photo: "https://www.apple.com/assets-www/en_WW/mac/01_product_tile/small/mbp_14_16_1c273d714_2x.jpg"
    },
    {
        id: nanoid(6),
        name: 'Wireless Headphones',
        category: 'Electronics',
        description: 'Noise-cancelling over-ear headphones',
        price: 299,
        stock: 100,
        rating: 4.5,
        photo: "https://www.apple.com/v/airpods/shared/compare/f/images/compare/compare_airpods_max__b14s2x6q07rm_small_2x.png"
    },
    {
        id: nanoid(6),
        name: 'Coffee Maker',
        category: 'Home Appliances',
        description: 'Automatic drip coffee machine',
        price: 89,
        stock: 30,
        rating: 4.2,
        photo: "https://images.unsplash.com/photo-1637029436347-e33bf98a5412?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: nanoid(6),
        name: 'Blender',
        category: 'Home Appliances',
        description: 'High-speed blender for smoothies',
        price: 59,
        stock: 40,
        rating: 4.3,
        photo: "https://plus.unsplash.com/premium_photo-1718043036199-d98bef36af46?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: nanoid(6),
        name: 'Running Shoes',
        category: 'Footwear',
        description: 'Lightweight sneakers for marathon runners',
        price: 129,
        stock: 60,
        rating: 4.6,
        photo: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: nanoid(6),
        name: 'Yoga Mat',
        category: 'Fitness',
        description: 'Non-slip eco-friendly yoga mat',
        price: 39,
        stock: 80,
        rating: 4.4,
        photo: "https://images.unsplash.com/photo-1591291621164-2c6367723315?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: nanoid(6),
        name: 'Protein Powder',
        category: 'Fitness',
        description: 'Whey protein for muscle gain',
        price: 49,
        stock: 25,
        rating: 4.7,
        photo: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: nanoid(6),
        name: 'Organic Tea',
        category: 'Grocery',
        description: 'Assorted herbal tea blends',
        price: 19,
        stock: 150,
        rating: 4.1,
        photo: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: nanoid(6),
        name: 'Dark Chocolate',
        category: 'Grocery',
        description: '70% cacao organic chocolate bar',
        price: 5,
        stock: 200,
        rating: 4.9,
        photo: "https://images.unsplash.com/photo-1610450949065-1f2841536c88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: nanoid(6),
        name: 'Notebook',
        category: 'Stationery',
        description: 'Spiral-bound lined notebook',
        price: 8,
        stock: 120,
        rating: 4.0,
        photo: "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: nanoid(6),
        name: 'Pen Set',
        category: 'Stationery',
        description: 'Gel ink pens in assorted colors',
        price: 12,
        stock: 90,
        rating: 4.2,
        photo: "https://plus.unsplash.com/premium_photo-1760662482274-b90c8050fd69?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
];

// Подключаем JSON-парсер и CORS
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
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

const swaggerOptions = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'Products API',
            version: '1.0.0',
            description: 'Simple REST API для управления товарами (CRUD)',
            contact: {
                name: 'Your Name',
            },
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Development server',
            },
        ],
        tags: [
            {
                name: 'Products',
                description: 'Операции с товарами',
            },
        ],
        components: {
            schemas: {
                Product: {
                    type: 'object',
                    required: ['name', 'category', 'price', 'stock'],
                    properties: {
                        id: {
                            type: 'string',
                            example: 'abc123',
                            description: 'Уникальный идентификатор (генерируется автоматически)',
                            readOnly: true,
                        },
                        name: {
                            type: 'string',
                            example: 'iPhone 15',
                            minLength: 1,
                        },
                        category: {
                            type: 'string',
                            example: 'Electronics',
                        },
                        description: {
                            type: 'string',
                            example: 'Latest smartphone with advanced camera',
                            nullable: true,
                        },
                        price: {
                            type: 'number',
                            format: 'float',
                            example: 999,
                            minimum: 0,
                        },
                        stock: {
                            type: 'integer',
                            example: 50,
                            minimum: 0,
                        },
                        rating: {
                            type: 'number',
                            format: 'float',
                            example: 4.8,
                            minimum: 0,
                            maximum: 5,
                            nullable: true,
                        },
                    },
                },
                ProductCreate: {
                    type: 'object',
                    required: ['name', 'category', 'price', 'stock'],
                    properties: {
                        name: { type: 'string', example: 'New Product' },
                        category: { type: 'string', example: 'Grocery' },
                        description: { type: 'string', example: 'Very nice thing', nullable: true },
                        price: { type: 'number', example: 149.99 },
                        stock: { type: 'integer', example: 100 },
                        rating: { type: 'number', example: 4.5, nullable: true },
                    },
                },
                ProductUpdate: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', example: 'Updated Name', nullable: true },
                        category: { type: 'string', example: 'New Category', nullable: true },
                        description: { type: 'string', nullable: true },
                        price: { type: 'number', example: 199.99, nullable: true },
                        stock: { type: 'integer', example: 75, nullable: true },
                        rating: { type: 'number', example: 4.7, nullable: true },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string', example: 'Product not found' },
                    },
                },
            },
        },
    },
    apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Подключаем Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    swaggerOptions: {
        persistAuthorization: true,
    },
}));

// Вспомогательная функция поиска продукта
function findProductOr404(id, res) {
    const product = products.find(p => p.id === id);
    if (!product) {
        res.status(404).json({ error: "Product not found" });
        return null;
    }
    return product;
}

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить список всех товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список всех товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get("/api/products", (req, res) => {
    res.json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить один товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара (6-символьный nanoid)
 *     responses:
 *       200:
 *         description: Найденный товар
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get("/api/products/:id", (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;
    res.json(product);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreate'
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Некорректные данные
 */
app.post("/api/products", (req, res) => {
    const { name, category, description, price, stock, rating } = req.body;

    if (!name || !category || price == null || stock == null) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const newProduct = {
        id: nanoid(6),
        name: name.trim(),
        category: category.trim(),
        description: description ? description.trim() : undefined,
        price: Number(price),
        stock: Number(stock),
        rating: rating !== undefined ? Number(rating) : undefined
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Частичное обновление товара
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdate'
 *     responses:
 *       200:
 *         description: Товар обновлён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 *       400:
 *         description: Ничего не передано для обновления
 */
app.patch("/api/products/:id", (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Nothing to update" });
    }

    const { name, category, description, price, stock, rating } = req.body;

    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (rating !== undefined) product.rating = Number(rating);

    res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Товар успешно удалён
 *       404:
 *         description: Товар не найден
 */
app.delete("/api/products/:id", (req, res) => {
    const id = req.params.id;
    const exists = products.some(p => p.id === id);
    if (!exists) return res.status(404).json({ error: "Product not found" });

    products = products.filter(p => p.id !== id);
    res.status(204).send();
});

// 404 для несуществующих маршрутов
app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Swagger docs: http://localhost:${port}/api-docs`);
});