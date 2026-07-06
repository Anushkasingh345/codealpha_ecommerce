const express = require("express");
const path = require("path");
const fs = require("fs"); // File system module jo products.json ko read karega

const app = express();

// Public folder ke andar ki files (HTML, CSS, JS) ko allow karne ke liye
app.use(express.static("public"));

// 1. Home Page route (index.html open karega)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
    });

// 2. Products API endpoint (Frontend ko products.json ka data bhejega)
app.get("/api/products", (req, res) => {
    fs.readFile("products.json", "utf-8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Failed to read products data" });
        }
        res.json(JSON.parse(data)); // JSON data ko frontend ko send kar rahe hain
    });
});

// Server port 3000 par chalega
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});