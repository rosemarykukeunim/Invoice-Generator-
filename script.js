const itemsContainer = document.getElementById("itemsContainer");
const addItemBtn = document.getElementById("addItemBtn");
const generateBtn = document.getElementById("generateBtn");
const printBtn = document.getElementById("printBtn");

const subtotalDisplay = document.getElementById("subtotal");
const totalDisplay = document.getElementById("total");

const invoicePreview = document.getElementById("invoicePreview");
const previewContent = document.getElementById("previewContent");

function formatMoney(amount) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN"
    }).format(amount);
}

function getItems() {
    const rows = document.querySelectorAll(".item-row");

    return Array.from(rows).map(row => {
        return {
            name: row.querySelector(".item-name").value.trim(),
            quantity: Number(row.querySelector(".item-quantity").value),
            price: Number(row.querySelector(".item-price").value)
        };
    });
}

function calculateTotal() {
    const items = getItems();

    const subtotal = items.reduce((sum, item) => {
        return sum + item.quantity * item.price;
    }, 0);

    subtotalDisplay.textContent = formatMoney(subtotal);
    totalDisplay.textContent = formatMoney(subtotal);

    return subtotal;
}

addItemBtn.addEventListener("click", () => {
    const newRow = document.createElement("div");

    newRow.className = "item-row";

    newRow.innerHTML = `
        <input type="text" class="item-name" placeholder="Item or service">
        <input type="number" class="item-quantity" placeholder="Qty" min="1" value="1">
        <input type="number" class="item-price" placeholder="Price (₦)" min="0" step="0.01">
    `;

    itemsContainer.appendChild(newRow);
});

itemsContainer.addEventListener("input", calculateTotal);

generateBtn.addEventListener("click", () => {
    const businessName = document.getElementById("businessName").value.trim();
    const businessEmail = document.getElementById("businessEmail").value.trim();
    const businessAddress = document.getElementById("businessAddress").value.trim();

    const customerName = document.getElementById("customerName").value.trim();
    const customerEmail = document.getElementById("customerEmail").value.trim();

    const invoiceNumber = document.getElementById("invoiceNumber").value.trim();
    const invoiceDate = document.getElementById("invoiceDate").value;
    const dueDate = document.getElementById("dueDate").value;
    const notes = document.getElementById("notes").value.trim();

    const items = getItems();
    const validItems = items.filter(item => item.name && item.quantity > 0 && item.price >= 0);

    if (!businessName || !customerName || !invoiceNumber) {
        alert("Please enter your business name, customer name, and invoice number.");
        return;
    }

    if (validItems.length === 0) {
        alert("Please add at least one item with a name, quantity, and price.");
        return;
    }

    const subtotal = validItems.reduce((sum, item) => {
        return sum + item.quantity * item.price;
    }, 0);

    const safe = value => String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);

    const itemRows = validItems.map(item => `
        <tr>
            <td>${safe(item.name)}</td>
            <td>${item.quantity}</td>
            <td>${formatMoney(item.price)}</td>
            <td>${formatMoney(item.quantity * item.price)}</td>
        </tr>
    `).join("");

    previewContent.innerHTML = `
        <div class="preview-header">
            <h1>INVOICE</h1>
            <h2>${safe(businessName)}</h2>
            <p>${safe(businessEmail)}</p>
            <p>${safe(businessAddress).replace(/\n/g, "<br>")}</p>
        </div>

        <hr style="margin: 20px 0;">

        <p><strong>Invoice Number:</strong> ${safe(invoiceNumber)}</p>
        <p><strong>Invoice Date:</strong> ${safe(invoiceDate || "Not specified")}</p>
        <p><strong>Due Date:</strong> ${safe(dueDate || "Not specified")}</p>

        <br>

        <h3>Bill To</h3>
        <p><strong>${safe(customerName)}</strong></p>
        <p>${safe(customerEmail)}</p>

        <br>

        <table style="width:100%; border-collapse:collapse; text-align:left;">
            <thead>
                <tr>
                    <th style="padding:8px; border-bottom:1px solid #ccc;">Item</th>
                    <th style="padding:8px; border-bottom:1px solid #ccc;">Qty</th>
                    <th style="padding:8px; border-bottom:1px solid #ccc;">Price</th>
                    <th style="padding:8px; border-bottom:1px solid #ccc;">Amount</th>
                </tr>
            </thead>
            <tbody>${itemRows}</tbody>
        </table>

        <div style="text-align:right; margin-top:20px;">
            <h3>Total: ${formatMoney(subtotal)}</h3>
        </div>

        ${notes ? `<br><h3>Notes</h3><p>${safe(notes).replace(/\n/g, "<br>")}</p>` : ""}
        
        <p style="margin-top:35px; text-align:center; color:#666;">
            Thank you for your business!
        </p>
    `;

    invoicePreview.hidden = false;
    invoicePreview.scrollIntoView({ behavior: "smooth" });
});

printBtn.addEventListener("click", () => {
    if (invoicePreview.hidden) {
        alert("Please generate your invoice first.");
        return;
    }

    window.print();
});

calculateTotal();