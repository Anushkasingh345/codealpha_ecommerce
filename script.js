// Fetch and display products when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    updateCartCount(); // Page load hote hi cart ka number update karega
});

// Function to fetch products from the backend API
function fetchProducts() {
    fetch("/api/products")
        .then(response => response.json())
        .then(products => {
            const container = document.getElementById("products-container");
            container.innerHTML = ""; // Clear existing content

            // Loop through each product and generate HTML cards
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.style = 'border: 1px solid #ddd; border-radius: 8px; padding: 15px; width: 250px; text-align: center; box-shadow: 2px 2px 10px rgba(0,0,0,0.1);';
                
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 4px;">
                    <h3 style="margin: 10px 0;">
                        <a href="product-details.html?id=${product.id}" style="color: #2c3e50; text-decoration: none;">${product.name}</a>
                    </h3>
                    <p style="color: #666; font-size: 14px; height: 40px; overflow: hidden;">${product.description || ''}</p>
                    <p style="font-weight: bold; color: #e74c3c; margin: 10px 0;">$${product.price}</p>
                    <button class="add-to-cart-btn" style="background: #2ecc71; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; font-weight: bold; width: 100%;">Add to Cart</button>
                `;

                // Button par click karne ka event listener attach kiya
                const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
                addToCartBtn.addEventListener('click', () => {
                    addToCart(product);
                });

                container.appendChild(productCard);
            });
        })
        .catch(error => console.error("Error fetching products:", error));
}

// Function to add product to localStorage cart
function addToCart(product) {
    // Pehle se saved cart data lekar aao, ya fir empty array banao
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Product ko cart list mein push karo
    cart.push(product);
    
    // Wapas localStorage mein save kar do
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // UI par cart ka count instantly badhao
    updateCartCount();
    
    // User ko alert dikhao
    alert(`${product.name} successfully added to cart! 🛒`);
}

// Function to update cart count badge on top
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.innerText = cart.length;
    }
}