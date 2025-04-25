document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("paymentForm");
  const cardNumber = document.getElementById("cardNumber");
  const cvv = document.getElementById("cvv");

  // Create validation message spans
  const cardMsg = document.createElement("small");
  cardMsg.style.color = "red";
  cardNumber.parentNode.insertBefore(cardMsg, cardNumber.nextSibling);

  const cvvMsg = document.createElement("small");
  cvvMsg.style.color = "red";
  cvv.parentNode.insertBefore(cvvMsg, cvv.nextSibling);

  // Enforce input type for CVV
  cvv.setAttribute("type", "password");

  // Live card number validation
  cardNumber.addEventListener("input", () => {
      const value = cardNumber.value.replace(/\D/g, ""); // remove non-digits
      if (value.length > 16) {
          cardMsg.textContent = "Card number cannot exceed 16 digits.";
          cardNumber.value = value.slice(0, 16);
      } else {
          cardMsg.textContent = value.length < 16 ? `Currently ${value.length}/16 digits.` : "";
      }
  });

  // Live CVV validation
  cvv.addEventListener("input", () => {
      const value = cvv.value.replace(/\D/g, ""); // remove non-digits
      if (value.length > 3) {
          cvvMsg.textContent = "CVV cannot exceed 3 digits.";
          cvv.value = value.slice(0, 3);
      } else {
          cvvMsg.textContent = value.length < 3 ? `Currently ${value.length}/3 digits.` : "";
      }
  });

  // Replicating the order summary table
  const tableBody = document.getElementById("orderTableBody");
  const totalField = document.getElementById("totalPrice");

  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem("orderSummary")) || [];

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

  // On form submit
  form.addEventListener("submit", function (e) {
      e.preventDefault();

      const requiredFields = ["name", "email", "address", "city", "zip", "cardName", "cardNumber", "expiry", "cvv"];
      let allValid = true;

      requiredFields.forEach((id) => {
          const field = document.getElementById(id);
          const value = field.value.trim();

          field.style.border = "1px solid #ccc";

          if (!value) {
              field.style.border = "2px solid red";
              allValid = false;
          }

          if (id === "cardNumber" && !/^\d{16}$/.test(value)) {
              alert("Card number must be exactly 16 digits.");
              field.style.border = "2px solid red";
              allValid = false;
          }

          if (id === "cvv" && !/^\d{3}$/.test(value)) {
              alert("CVV must be exactly 3 digits.");
              field.style.border = "2px solid red";
              allValid = false;
          }
      });

      if (!allValid) return;

      // Storing delivery date and redirecting
      const deliveryDate = new Date(new Date().setDate(new Date().getDate() + 3));
      localStorage.setItem("deliveryDate", deliveryDate.toDateString());
      window.location.href = "pay_message.html";
  });

  // Optional: Show summary (if needed)
  const summaryBox = document.getElementById("orderSummary");

  if (summaryBox) {
      if (cart.length > 0) {
          let html = "<ul>";
          cart.forEach((item) => {
              html += `<li>${item.quantity} x ${item.name} - LKR ${item.price.toLocaleString()}</li>`;
          });
          html += "</ul>";
          summaryBox.innerHTML = html;
      } else {
          summaryBox.innerHTML = "<p>No items in your cart.</p>";
      }
  }
});