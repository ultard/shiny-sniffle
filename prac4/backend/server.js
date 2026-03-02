const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

const JWT_SECRET = 'your-super-secret-key-ChangeThisInProduction-1234567890abcdef';

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

let users = [{
    id: nanoid(6),
    email: "demo@test.ru",
    first_name: "Gleb",
    last_name: "Pozdniakov",
    hashedPassword: "$argon2i$v=19$m=16,t=2,p=1$RXJRRklSdDZweWRDd1VMVA$ifDjVOkTKSoondzA7lDj9Q"
}];

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            console.log('Body:', req.body);
        }
    });
    next();
});

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Unauthorized: Bearer token required" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id, email, first_name, last_name }
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

function findProductOr404(id, res) {
    const product = products.find(p => p.id === id);
    if (!product) {
        res.status(404).json({ error: "Product not found" });
        return null;
    }
    return product;
}

function findUserOr404(email, res) {
    const searchEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email === searchEmail);
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return null;
    }
    return user;
}

const swaggerOptions = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'Auth & Products API',
            version: '1.0.0',
            description: 'REST API для регистрации/авторизации пользователей и управления товарами (CRUD)',
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
                name: 'Auth',
                description: 'Авторизация и регистрация пользователей',
            },
            {
                name: 'Products',
                description: 'Операции с товарами',
            },
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: 'abc123' },
                        email: { type: 'string', example: 'user@example.com' },
                        first_name: { type: 'string', example: 'Иван' },
                        last_name: { type: 'string', example: 'Иванов' },
                        hashedPassword: {
                            type: 'string',
                            description: 'Хэш пароля (только для демо)',
                            example: 'a1b2c3...:d4e5f6...'
                        },
                    },
                },
                RegisterRequest: {
                    type: 'object',
                    required: ['email', 'first_name', 'last_name', 'password'],
                    properties: {
                        email: { type: 'string', example: 'user@example.com' },
                        first_name: { type: 'string', example: 'Иван' },
                        last_name: { type: 'string', example: 'Иванов' },
                        password: { type: 'string', format: 'password', example: 'password123' },
                    },
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', example: 'user@example.com' },
                        password: { type: 'string', format: 'password', example: 'password123' },
                    },
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
                    }
                },
                Product: {
                    type: 'object',
                    required: ['name', 'category', 'price', 'stock'],
                    properties: {
                        id: { type: 'string', example: 'abc123', readOnly: true },
                        name: { type: 'string', example: 'iPhone 15' },
                        category: { type: 'string', example: 'Electronics' },
                        description: { type: 'string', nullable: true },
                        price: { type: 'number', example: 999 },
                        stock: { type: 'integer', example: 50 },
                        rating: { type: 'number', nullable: true },
                    },
                },
                ProductCreate: {
                    type: 'object',
                    required: ['name', 'category', 'price', 'stock'],
                    properties: {
                        name: { type: 'string' },
                        category: { type: 'string' },
                        description: { type: 'string', nullable: true },
                        price: { type: 'number' },
                        stock: { type: 'integer' },
                        rating: { type: 'number', nullable: true },
                    },
                },
                ProductUpdate: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', nullable: true },
                        category: { type: 'string', nullable: true },
                        description: { type: 'string', nullable: true },
                        price: { type: 'number', nullable: true },
                        stock: { type: 'integer', nullable: true },
                        rating: { type: 'number', nullable: true },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string', example: 'Product not found' },
                    },
                },
            },
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT токен в формате: Bearer <token>'
                }
            }
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

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация (создание) пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Некорректные данные
 */
app.post("/api/auth/register", async (req, res) => {
    const { email, first_name, last_name, password } = req.body;
    if (!email || !first_name || !last_name || !password) {
        return res.status(400).json({ error: "Все поля обязательны" });
    }

    const existing = users.find(u => u.email === email.trim().toLowerCase());
    if (existing) {
        return res.status(409).json({ error: "Пользователь с таким email уже существует" });
    }

    const newUser = {
        id: nanoid(6),
        email: email.trim().toLowerCase(),
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        hashedPassword: Bun.password.hashSync(password)
    };

    users.push(newUser);

    const payload = {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '24h'
    });

    res.json({ accessToken });
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вход в систему
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Успешный вход
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Некорректные данные
 *       401:
 *         description: Неверные учётные данные
 *       404:
 *         description: Пользователь не найден
 */
app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email и password обязательны" });

    const user = users.find(u => u.email === email.trim().toLowerCase());
    if (!user) return res.status(401).json({ error: "Неверный email или пароль" });

    const isValid = Bun.password.verifySync(password, user.hashedPassword);
    if (!isValid) return res.status(401).json({ error: "Неверный email или пароль" });

    const payload = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '24h'
    });

    res.json({ accessToken });
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Получить данные текущего пользователя
 *     description: Возвращает профиль авторизованного пользователя по JWT-токену
 *     tags:
 *       - Auth
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Данные пользователя
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Не авторизован (нет токена / токен недействителен / истёк)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get("/api/auth/me", authMiddleware, (req, res) => {
    res.json(req.user);
});

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
app.post("/api/products", authMiddleware, (req, res) => {
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
 *   put:
 *     summary: Обновить параметры товара (PUT по заданию)
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
app.put("/api/products/:id", (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Nothing to update" });
    }

    const { name, category, description, price, stock, rating } = req.body;

    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category.trim();
    if (description !== undefined) product.description = description ? description.trim() : undefined;
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
app.delete("/api/products/:id", authMiddleware, (req, res) => {
    const id = req.params.id;
    const exists = products.some(p => p.id === id);
    if (!exists) return res.status(404).json({ error: "Product not found" });

    products = products.filter(p => p.id !== id);
    res.status(204).send();
});

app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Swagger docs: http://localhost:${port}/api-docs`);
});