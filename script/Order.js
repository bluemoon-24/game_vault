let cart = [];

// Add to cart
function addToCart(button) {
    const productCard = button.closest(".processor, .G-card, .M-board, .ram, .storage");
    const input = productCard.querySelector("input[type='number']");
    const name = input.dataset.name;
    const price = parseFloat(input.dataset.price.replace(/,/g, ""));
    const quantity = parseInt(input.value);

    if (isNaN(quantity) || quantity <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }

    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ name, price, quantity });
    }

    input.value = "";
    updateOrderTable();
}

// Refresh the order summary table
function updateOrderTable() {
    const tableBody = document.getElementById("orderTableBody");
    const totalField = document.getElementById("totalPrice");
    tableBody.innerHTML = "";

    let total = 0;
    cart.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${(item.price * item.quantity).toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
        total += item.price * item.quantity;
    });

    totalField.textContent = total.toLocaleString();
    localStorage.setItem("orderSummary", JSON.stringify(cart));
}

// Add a single product to favourites
function addToFavourites(button) {
    const productCard = button.closest(".processor, .G-card, .M-board, .ram, .storage");
    const input = productCard.querySelector("input[type='number']");
    const name = input.dataset.name;
    const price = parseFloat(input.dataset.price.replace(/,/g, ""));
    const quantity = parseInt(input.value);

    if (isNaN(quantity) || quantity <= 0) {
        alert("Please enter a valid quantity to save as favourite.");
        return;
    }

    const newFav = { name, price, quantity };
    let favourites = JSON.parse(localStorage.getItem("favouriteOrder")) || [];

    const exists = favourites.find(item => item.name === name);
    if (exists) {
        exists.quantity += quantity;
    } else {
        favourites.push(newFav);
    }

    localStorage.setItem("favouriteOrder", JSON.stringify(favourites));
    alert("Item added to favourites!");
    input.value = "";
}

// Merge favourites into cart
function applyFavourites() {
    const favourites = JSON.parse(localStorage.getItem("favouriteOrder"));
    if (!favourites || favourites.length === 0) {
        alert("No favourite items found.");
        return;
    }

    favourites.forEach(fav => {
        const existing = cart.find(item => item.name === fav.name);
        if (existing) {
            existing.quantity += fav.quantity;
        } else {
            cart.push({ ...fav });
        }

        // Reflect in the input if desired
        const input = document.querySelector(`input[data-name="${fav.name}"]`);
        if (input) input.value = fav.quantity;
    });

    updateOrderTable();
}

// Completely clear favourites
function removeFavourites() {
    if (confirm("Remove all favourite items?")) {
        localStorage.removeItem("favouriteOrder");
        alert("Favourites cleared.");
    }
}

// Clear the order summary
function clearOrder() {
    if (cart.length === 0) {
      alert("No items in cart to clear.");
      return;
    }
    if (confirm("Are you sure you want to clear your order?")) {
      cart = [];
      updateOrderTable();
    }
  }


// Prevent "Buy Now" if cart empty
document.addEventListener("DOMContentLoaded", () => {
    const buyBtn = document.getElementById("buyNowBtn");
    buyBtn.addEventListener("click", function(e) {
        if (cart.length === 0) {
            e.preventDefault();
            alert("Your cart is empty. Please add items before proceeding to payment.");
        }
    });
});