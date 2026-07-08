const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware for parsing JSON and serving frontend files
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simulated Database Files
const USERS_FILE = path.join(__dirname, 'users.json');
const ORDERS_FILE = path.join(__dirname, 'orders.json');

// Helper function to read/write JSON files safely
const readData = (filePath) => {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]');
};
const writeData = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// 1. Endpoint to Fetch Products (Directly serves your existing products.json)
app.get('/api/products', (req, res) => {
    const productsPath = path.join(__dirname, 'products.json');
    if (fs.existsSync(productsPath)) {
        res.sendFile(productsPath);
    } else {
        res.status(404).json({ message: "Products file not found" });
    }
});

// 2. User Registration API
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    const users = readData(USERS_FILE);

    if (users.find(u => u.username === username)) {
        return res.status(400).json({ success: false, message: "User already exists!" });
    }

    users.push({ username, password });
    writeData(USERS_FILE, users);
    res.json({ success: true, message: "Registration successful!" });
});

// 3. User Login API
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const users = readData(USERS_FILE);
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(400).json({ success: false, message: "Invalid credentials!" });
    }
    res.json({ success: true, message: "Login successful!", username });
});

// 4. Order Processing API (Checkout)
app.post('/api/checkout', (req, res) => {
    const { username, cartItems, totalAmount } = req.body;
    const orders = readData(ORDERS_FILE);

    const newOrder = {
        orderId: 'ORD' + Date.now(),
        username: username || 'Guest',
        items: cartItems,
        total: totalAmount,
        date: new Date().toLocaleString()
    };

    orders.push(newOrder);
    writeData(ORDERS_FILE, orders);
    res.json({ success: true, message: "Order processed successfully!", orderId: newOrder.orderId });
});

// Start the Full Stack Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});