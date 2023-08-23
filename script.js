// Calculate GST based on tax type (inclusive/exclusive)
function calculateGST(itemAmount, gstRate, taxType) {
  if (taxType === "inclusive") {
    const gstAmount = (itemAmount * gstRate) / (100 + gstRate);
    return {
      gstAmount: gstAmount,
      totalAmount: itemAmount - gstAmount,
    };
  } else {
    const gstAmount = (itemAmount * gstRate) / 100;
    return {
      gstAmount: gstAmount,
      totalAmount: itemAmount + gstAmount,
    };
  }
}

document.getElementById("gstCalculatorForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const tableBody = document.getElementById("table-body");
  const gstCalculatorForm = document.getElementById("gstCalculatorForm"); // Update this line

  const itemName = document.getElementById("item_name").value;
  const itemAmount = parseFloat(document.getElementById("item_amount").value);
  const itemGstRate = parseFloat(document.getElementById("itemgstrate").value);
  const itemTaxType = document.getElementById("I_N").value;

  if (!isNaN(itemAmount) && !isNaN(itemGstRate)) {
    const gstAmount = (itemTaxType === "inclusive") ? (itemAmount * itemGstRate) / (100 + itemGstRate) : (itemAmount * itemGstRate) / 100;
    const totalAmount = (itemTaxType === "inclusive") ? itemAmount : itemAmount + gstAmount;

    const newItem = {
      name: itemName,
      amount: itemAmount,
      gstRate: itemGstRate,
      taxType: itemTaxType,
      gstAmount: gstAmount,
      totalAmount: totalAmount
    };

    saveItemToLocalstorage(newItem);

    const tableRow = tableBody.insertRow();
    tableRow.insertCell().textContent = itemName;
    tableRow.insertCell().textContent = itemAmount.toFixed(2);
    tableRow.insertCell().textContent = itemGstRate.toFixed(2);
    tableRow.insertCell().textContent = itemTaxType;

    gstCalculatorForm.reset(); // Reset the form inputs
  }
});

function saveItemToLocalstorage(item) {
  let storedItems = localStorage.getItem("gstCalculatorItems");
  if (!storedItems) {
    storedItems = [];
  } else {
    storedItems = JSON.parse(storedItems);
  }

  storedItems.push(item);
  localStorage.setItem("gstCalculatorItems", JSON.stringify(storedItems));
}

// Load stored items from local storage when the page loads
function loadStoredItems() {
  const storedItems = localStorage.getItem("gstCalculatorItems");
  if (storedItems) {
    const items = JSON.parse(storedItems);
    items.forEach(item => {
      const tableBody = document.getElementById("table-body");
      const tableRow = tableBody.insertRow();
      tableRow.insertCell().textContent = item.name;
      tableRow.insertCell().textContent = item.amount.toFixed(2);
      tableRow.insertCell().textContent = item.gstRate.toFixed(2);
      tableRow.insertCell().textContent = item.taxType;
    });
  }
}

// Call the function to load stored items when the page loads
loadStoredItems();

// Validate GST input on form submission
document.getElementById("gstCalculatorForm").addEventListener("submit", function (e) {
  const gstInput = document.getElementById("itemgstrate");
  const gstValue = parseFloat(gstInput.value);

  if (isNaN(gstValue) || gstValue < 0 || gstValue > 28) {
    e.preventDefault();
  }
});


document.getElementById("calculateBtn").addEventListener("click", function () {
  const storedItems = localStorage.getItem("gstCalculatorItems");
  if (storedItems) {
    const items = JSON.parse(storedItems);
    let totalGST = 0;
    let grandTotal = 0;

    items.forEach(item => {
      totalGST += item.gstAmount;
      grandTotal += item.totalAmount;
    });

    const resultElement = document.getElementById("result");
    resultElement.innerHTML = `
      <p><strong>Total GST Amount: ${totalGST.toFixed(2)}</strong></p>
      
      <p><strong>Grand Total: ${grandTotal.toFixed(2)}</strong></p>
    `;
  } else {
    const resultElement = document.getElementById("result");
    resultElement.innerHTML = `<p>No items found to calculate.</p>`;
  }
});


document.getElementById("resetBtn").addEventListener("click", function () {
  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = ""; // Clear the displayed items

  const resultElement = document.getElementById("result");
  resultElement.innerHTML = ""; // Clear the calculation result

  localStorage.removeItem("gstCalculatorItems"); // Optionally remove stored items

  // Reset the form inputs
  const itemForm = document.getElementById("itemForm");
  itemForm.reset();
});

