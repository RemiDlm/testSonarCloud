function login(event) {
    event.preventDefault();

    // Get values from the form
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Retrieve stored credentials
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));

    // Check if the entered credentials match and determine the role
    var role = Object.keys(storedCredentials).find(
        key => storedCredentials[key].username === username && storedCredentials[key].password === password
    );

    if (role) {
        alert("Login successful! Welcome " + storedCredentials[role].role + ".");

        // Redirect to the dashboard and pass the username and role
        redirectToDashboard(username, storedCredentials[role].role);
        log("login", username, "login");
    } else {
        alert("Invalid credentials. Please try again.");
    }
    
}


function redirectToDashboard(username, userRole) {
    // Store username and role in local storage for later use
    localStorage.setItem("username", username);
    localStorage.setItem("userRole", userRole);

    // Redirect to the dashboard page
    window.location.href = "dashboard.html";
}
var username = localStorage.getItem("username");

function loadDashboardContent() {
    // Get username and role from local storage
    var username = localStorage.getItem("username");
    var userRole = localStorage.getItem("userRole");

    // Update the welcome message
    document.getElementById("welcomeMessage").textContent = "Welcome, " + username + "!";

    // Update the actions list based on the user's role
    var actionsList = document.getElementById("actionsList");
    actionsList.innerHTML = ""; // Clear existing content

    switch (userRole) {
        case "admin":
            // Admin actions
            addDashboardAction(actionsList, "List Products");
            addDashboardAction(actionsList, "Add Products");
            addDashboardAction(actionsList, "Desactivate Products");
            addDashboardAction(actionsList, "Create Sales");
            addDashboardAction(actionsList, "Modify Sales");
            addDashboardAction(actionsList, "Delete Sales"); 
            addDashboardAction(actionsList, "Deactivate Products");
            addDashboardAction(actionsList, "Add New Users");
            break;

        case "assistant":
            // Assistant actions
            addDashboardAction(actionsList, "List Products");
            addDashboardAction(actionsList, "Add Products");
            addDashboardAction(actionsList, "Create Sales");
            addDashboardAction(actionsList, "Modify Sales");
            break;

        case "seller":
            // Seller actions
            addDashboardAction(actionsList, "List Products");
            break;

        default:
            // Handle unknown role
            actionsList.innerHTML = "<li>Unknown role. Please contact support.</li>";
    }

    var salesList = document.getElementById("salesItems");
    salesList.innerHTML = ""; // Clear existing content

    for (var i = 0; i < Sales.length; i++) {
        var saleItem = document.createElement("li");
        saleItem.textContent = `Sale ${i + 1}: Product - ${Sales[i].product}, Quantity - ${Sales[i].quantity}, Total Amount - ${Sales[i].totalAmount}`;
        salesList.appendChild(saleItem);
    }

    loadProducts();

    updateClientList()

}

function addDashboardAction(parentElement, actionText) {
    var listItem = document.createElement("li");
    listItem.textContent = actionText;
    parentElement.appendChild(listItem);
}

function addUserHTML(event) {

    // Check if the user has admin role
    var userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
        alert("You don't have permission to add users.");
        return;
    }

    // Get values from the form
    var newUsername = document.getElementById("newUsername").value;
    var newPassword = document.getElementById("newPassword").value;
    var newRole = document.getElementById("newRole").value;

    // Call the addUser function from credentials.js
    addUser(newUsername, newPassword, newRole);
    log("addUserHTML", username, newUsername);

    loadDashboardContent();

    // Display a success message or perform any other actions as needed
    alert("User added successfully!");
}

function createSaleHTML(event) {
    event.preventDefault();

    var userRole = localStorage.getItem("userRole");
    if (userRole !== "admin" && userRole !== "assistant") {
        alert("You don't have permission to modify sales.");
        return;
    }

    var newSaleProduct = document.getElementById("newSaleProduct").value;
    var newSaleQuantity = document.getElementById("newSaleQuantity").value;
    var newSaleTotalAmount = parseInt(document.getElementById("newSaleTotalAmount").value, 10);

    // Call the createSale function from script.js
    createSale(newSaleProduct, newSaleQuantity, newSaleTotalAmount)
    log("createSaleHTML", username, newSaleProduct);

    // Update the sales list on the dashboard
    loadDashboardContent();
}

function modifySaleHTML(event) {
    event.preventDefault();

    var userRole = localStorage.getItem("userRole");
    if (userRole !== "admin" && userRole !== "assistant") {
        alert("You don't have permission to modify sales.");
        return;
    }

    var productName = document.getElementById("ProductName").value;
    var modifiedSaleProduct = document.getElementById("modifiedSaleProduct").value;
    var modifiedSaleQuantity = parseInt(document.getElementById("modifiedSaleQuantity").value, 10);
    var modifiedSaleTotalAmount = parseFloat(document.getElementById("modifiedSaleTotalAmount").value);

    // Call the modifySale function from script.js
    modifySale(productName, { product: modifiedSaleProduct, quantity: modifiedSaleQuantity, totalAmount: modifiedSaleTotalAmount });
    log("modifySaleHTML", username, productName);

    // Update the sales list on the dashboard
    loadDashboardContent();
}

// Function to delete a sale HTML (only usable by admin)
function deleteSaleHTML(event) {
    event.preventDefault();

    var userRole = localStorage.getItem("userRole");
    if (userRole !== "admin" && userRole !== "assistant") {
        alert("You don't have permission to delete sales.");
        return;
    }

    var productNameToDelete = document.getElementById("deleteSaleProductName").value;
    deleteSale(productNameToDelete);
    log("deleteSaleHTML", username, productNameToDelete);

    // Update the sales list on the dashboard
    loadDashboardContent();

}

function addProductHTML(event) {
    event.preventDefault();

    var productName = document.getElementById("newProductName").value;
    var productPrice = parseFloat(document.getElementById("newProductPrice").value);

    // Call the addProduct function from script.js
    addProduct(productName, productPrice);

    // Update the products list on the dashboard
    loadProducts();
    log("addProductHTML", username);
    // Display a success message or perform any other actions as needed
    alert(`Product "${productName}" added successfully!`);
}

// Function to disable a product HTML
function disableProductHTML(event) {
    event.preventDefault();

    var productNameToDisable = document.getElementById("disableProductName").value;

    // Call the disableProduct function from script.js
    disableProduct(productNameToDisable);

    // Update the products list on the dashboard
    loadProducts();
    log("disableProductHTML", username, productNameToDisable);
    // Display a success message or perform any other actions as needed
    alert(`Product "${productNameToDisable}" disabled successfully!`);
}

function loadProducts() {
    var productsList = document.getElementById("productsItems");
    productsList.innerHTML = ""; // Clear existing content

    // Loop through Products array and add each product to the list
    for (var i = 0; i < Products.length; i++) {
        var productItem = document.createElement("li");
        productItem.textContent = `Product ${i + 1}: Name - ${Products[i].name}, Price - ${Products[i].price}, Active - ${Products[i].active ? 'Yes' : 'No'}`;
        productsList.appendChild(productItem);
    }
}

async function updateClientList() {
    var clientList = document.getElementById("clientItems");
    clientList.innerHTML = ""; // Clear existing content
  
    for (var i = 0; i < Clients.length; i++) {
      // Decrypt the address and phone number
      const decryptedAddress = await decryptData(Clients[i].address);
      const decryptedPhoneNumber = await decryptData(Clients[i].phoneNumber);
  
      var clientItem = document.createElement("li");
      clientItem.textContent = `Client ${i + 1}: Name - ${Clients[i].name}, Address - ${decryptedAddress}, Phone Number - ${decryptedPhoneNumber}`;
      clientList.appendChild(clientItem);
    }
}

function createClientHTML(event) {
    event.preventDefault();

    var userRole = localStorage.getItem("userRole");
    if (userRole !== "admin" && userRole !== "assistant") {
        alert("You don't have permission to create clients.");
        return;
    }

    var newClientName = document.getElementById("newClientName").value;
    var newClientAddress = document.getElementById("newClientAddress").value;
    var newClientPhoneNumber = document.getElementById("newClientPhoneNumber").value;

    // Call the createClient function from script.js
    createClient(newClientName, newClientAddress, newClientPhoneNumber);
    log("createClientHTML", username, newClientName);
    // Update the client list on the dashboard
    loadDashboardContent();
}

function modifyClientHTML(event) {
    event.preventDefault();

    var userRole = localStorage.getItem("userRole");
    if (userRole !== "admin" && userRole !== "assistant") {
        alert("You don't have permission to modify clients.");
        return;
    }

    var clientName = document.getElementById("clientName").value;
    var modifiedClientName = document.getElementById("modifiedClientName").value;
    var modifiedClientAddress = document.getElementById("modifiedClientAddress").value;
    var modifiedClientPhoneNumber = document.getElementById("modifiedClientPhoneNumber").value;

    // Call the modifyClient function from script.js
    modifyClient(clientName, { name: modifiedClientName, address: modifiedClientAddress, phoneNumber: modifiedClientPhoneNumber });
    log("modifyClientHTML", username, modifiedClientName);
    // Update the client list on the dashboard
    loadDashboardContent();
}

// Function to delete a client HTML (only usable by admin)
function deleteClientHTML(event) {
    event.preventDefault();

    var userRole = localStorage.getItem("userRole");
    if (userRole !== "admin" && userRole !== "assistant") {
        alert("You don't have permission to delete clients.");
        return;
    }

    var clientNameToDelete = document.getElementById("deleteClientName").value;
    deleteClient(clientNameToDelete);
    log("deleteClientHTML", username, clientNameToDelete);

    // Update the client list on the dashboard
    loadDashboardContent();
}

// Load dashboard content when the page loads
window.onload = function () {
    
    loadDashboardContent();
    

    // Check if the logged-in user is an admin and show the add user form accordingly
    var userRole = localStorage.getItem("userRole");
    switch (userRole) {
        case "admin":
            document.getElementById("addProductHTML").style.display = "block";
            document.getElementById("disableProductHTML").style.display = "block";
            document.getElementById("salesListHTML").style.display = "block";
            document.getElementById("createSaleHTML").style.display = "block";
            document.getElementById("modifySaleHTML").style.display = "block";
            document.getElementById("deleteSaleHTML").style.display = "block";
            document.getElementById("clientListHTML").style.display = "block";
            document.getElementById("createClientHTML").style.display = "block";
            document.getElementById("modifyClientHTML").style.display = "block";
            document.getElementById("deleteClientHTML").style.display = "block";
            document.getElementById("addUserForm").style.display = "block";            
            break;

        case "assistant":
            document.getElementById("addProductHTML").style.display = "block";
            document.getElementById("salesListHTML").style.display = "block";
            document.getElementById("createSaleHTML").style.display = "block";
            document.getElementById("modifySaleHTML").style.display = "block";
            document.getElementById("clientListHTML").style.display = "block";
            document.getElementById("createClientHTML").style.display = "block";
            document.getElementById("modifyClientHTML").style.display = "block";
        break;
    }  
    log("Load Dashboard", localStorage.getItem("username"));
};

document.getElementById('downloadBtn').addEventListener('click', function () {
    saveDataToCSV();
});

var csvString = "Action,User,Date,Time\n";

function log(action, user, result) {
    // Get current date and time
    var currentDate = new Date();
    var date = currentDate.toISOString().slice(0, 10);
    var time = currentDate.toISOString().slice(11, 19);

    // Append to CSV string
    csvString += `${action},${result},${user},${date},${time}\n`;
}

function saveLogToCSV() {
    // Add a button click event to call this function

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'log.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('Log CSV file downloaded');
}

document.getElementById('downloadLog').addEventListener('click', function () {
    saveLogToCSV();
});