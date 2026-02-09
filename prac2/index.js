import express from 'express';
const app = express();
const port = 3000;

let products = [
    { id: 1, name: 'Товар 1', price: 100 },
    { id: 2, name: 'Товар 2', price: 200 },
    { id: 3, name: 'Товар 3', price: 300 }
];

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API для товаров готово!');
});

app.post('/products', (req, res) => {
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(400).json({ error: 'Необходимо указать name и price' });
    }
    const newProduct = { id: Date.now(), name, price };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.get('/products', (req, res) => {
    res.json(products);
});

app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    res.json(product);
});

app.patch('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    const { name, price } = req.body;
    if (name) product.name = name;
    if (price) product.price = price;
    res.json(product);
});

app.delete('/products/:id', (req, res) => {
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    products.splice(index, 1);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});