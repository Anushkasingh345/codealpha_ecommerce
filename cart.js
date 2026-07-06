document.addEventListener("DOMContentLoaded", () => {
    loadCart();
});

function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.getElementById("cart-container");
    const totalPriceElement = document.getElementById("total-price");

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p style='text-align:center; color:#777;'>Your cart is empty.</p>";
        totalPriceElement.innerText = "0";
        return;
    }

    // Fetch products from backend to match with cart ids and get details (Price, Name)
    fetch("/api/products")
        .then(response => response.json())
        .then(products => {
            cartContainer.innerHTML = "";
            let total = 0;

            cart.forEach(cartItem => {
                // Find the full product info from the backend list using the ID
                let product = products.find(p => p.id === cartItem.id);

                if (product) {
                    let itemTotal = product.price * cartItem.quantity;
                    total += itemTotal;

                    const itemRow = `
                        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding: 10px 0;">
                            <div>
                                <h4 style="margin: 0;">${product.name}</h4>
                                <p style="color: #666; margin: 5px 0 0 0;">Price: Rs. ${product.price} x ${cartItem.quantity}</p>
                            </div>
                            <div style="font-weight: bold; color: #333;">
                                Rs. ${itemTotal}
                            </div>
                        </div>
                    `;
                    cartContainer.innerHTML += itemRow;
                }
            });

            totalPriceElement.innerText = total;
        })
        .catch(error => console.error("Error loading cart items:", error));
}

// Order Processing implementation
function processOrder() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("Your cart is empty! Please add some items first.");
        return;
    }

    // Clear the cart after successfully placing the order
    localStorage.removeItem("cart");
    alert("🎉 Order Processed Successfully! Thank you for shopping.");
    window.location.href = "/"; // Send user back to shop home page
}