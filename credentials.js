// Initialize some sample Users
let Users = [
    { username: "admin", password: "adminpass", role: "admin" },
    { username: "assistant", password: "assistantpass", role: "assistant" },
    { username: "seller", password: "sellerpass", role: "seller" }
];

// Initialize some sample products
let Products = [
    { name: "Product1", price: 20.0, active: true },
    { name: "Product2", price: 30.0, active: true },
    { name: "Product3", price: 15.0, active: true },
    { name: "Product4", price: 25.0, active: true },
    { name: "Product5", price: 40.0, active: true }
];

// Initialize some sample sales
let Sales = [
    {product: "Product1", quantity: 2, totalAmount: 40.0 },
    {product: "Product3", quantity: 3, totalAmount: 45.0 },
    {product: "Product2", quantity: 1, totalAmount: 30.0 },
    {product: "Product4", quantity: 4, totalAmount: 100.0 },
    {product: "Product5", quantity: 2, totalAmount: 80.0 }
];

// Initialize some sample Clients
let Clients = [
    { name: "Client1", address: "ab7aef309e1240a17f", phoneNumber: "db2cb86fcf5405bd42910d53c0" },
    { name: "Client3", address: "ab7aef309e1240a37f", phoneNumber: "d326bc6fcd5407bd469b0553c0" },
    { name: "Client2", address: "ab7aef309e1240a27f", phoneNumber: "de2bbd6fcc590abd45980650" },
    { name: "Client4", address: "ab7aef309e1240a47f", phoneNumber: "d92cba6fcd5407bd45900c54" },
    { name: "Client5", address: "ab7aef309e1240a57f", phoneNumber: "dd26b26fcb5001bd469d0155" }
];

// Function to add a new user
function addUser(newUsername, newPassword, newRole) {
    const newUser = { username: newUsername, password: newPassword, role: newRole };
    Users.push(newUser);

    // Update local storage after adding a user
    localStorage.setItem("credentials", JSON.stringify(Users));
}

// Function to add a new product
function addProduct(productName, price) {
    const newProduct = { name: productName, price: price, active: true };
    Products.push(newProduct);

    // Update local storage after adding a product
    localStorage.setItem("products", JSON.stringify(Products));
}

// Function to disable a product
function disableProduct(productName) {
    const productIndex = Products.findIndex(product => product.name === productName);
    if (productIndex !== -1) {
        Products[productIndex].active = false;

        // Update local storage after disabling a product
        localStorage.setItem("products", JSON.stringify(Products));
    }
}

// Function to create a new sale
function createSale(newProduct, newQuantity, newTotalAmount ) {
    const saleDetails = {product: newProduct, quantity: newQuantity, totalAmount: newTotalAmount };
    Sales.push(saleDetails);

    // Update local storage after creating a sale
    localStorage.setItem("sales", JSON.stringify(Sales));
}

// Function to modify a sale
function modifySale(productName, modifiedSaleDetails) {
    const saleIndex = Sales.findIndex(sale => sale.product === productName);
    if (saleIndex !== -1) {
        Sales[saleIndex] = modifiedSaleDetails;

        localStorage.setItem('sales', JSON.stringify(Sales));
        localStorage.setItem("sales", JSON.stringify(Sales));
        // Display a success message or perform any other actions as needed
        alert(`Sales for product "${productName}" updated successfully!`);

    } else {
        alert(`No sales found for product "${productName}".`);
    }
}

// Function to delete a sale
function deleteSale(productName) {
    const saleIndex = Sales.findIndex(sale => sale.product === productName);
    if (saleIndex !== -1) {
        Sales.splice(saleIndex, 1);

        localStorage.setItem("sales", JSON.stringify(Sales));
        // Display a success message or perform any other actions as needed
        alert(`Sales for product "${productName}" deleted successfully!`);

    } else {
        alert(`No sales found for product "${productName}".`);
    }
}

function createClient(newName, newAddress, newPhoneNumber) {
    const clientDetails = { name: newName, address: newAddress, phoneNumber: newPhoneNumber };
    Clients.push(clientDetails);

    // Update local storage after creating a client
    localStorage.setItem("clients", JSON.stringify(Clients));
}

// Function to modify a client
function modifyClient(clientName, modifiedClientDetails) {
    const clientIndex = Clients.findIndex(client => client.name === clientName);
    if (clientIndex !== -1) {
        Clients[clientIndex] = modifiedClientDetails;

        localStorage.setItem('clients', JSON.stringify(Clients));
        // Display a success message or perform any other actions as needed
        alert(`Client "${clientName}" updated successfully!`);

    } else {
        alert(`No client found with name "${clientName}".`);
    }
}

// Function to delete a client
function deleteClient(clientName) {
    const clientIndex = Clients.findIndex(client => client.name === clientName);
    if (clientIndex !== -1) {
        Clients.splice(clientIndex, 1);

        localStorage.setItem("clients", JSON.stringify(Clients));
        // Display a success message or perform any other actions as needed
        alert(`Client "${clientName}" deleted successfully!`);

    } else {
        alert(`No client found with name "${clientName}".`);
    }
}

function saveDataToCSV() {
    const data = [
        ['Username', 'Password', 'Role'],
        ...Users.map(user => [user.username, user.password, user.role]),
        [],
        ['Name', 'Price', 'Active'],
        ...Products.map(product => [product.name, product.price, product.active]),
        [],
        ['Product', 'Quantity', 'TotalAmount'],
        ...Sales.map(sale => [sale.product, sale.quantity, sale.totalAmount])
    ];

    const csvContent = data.map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'integrity-hash.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('CSV file downloaded');
}

// Fixed key for encryption and decryption
const fixedKey = 'superKEY12345678';

// Function to encrypt data
async function encryptData(data) {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);

  // Use a TextEncoder to convert the key to bytes
  const keyData = encoder.encode(fixedKey);

  // Use the keyData as the raw key for encryption
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encryptedData = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    cryptoKey,
    encodedData
  );

  // Concatenate IV and encrypted data
  const result = new Uint8Array(iv.length + encryptedData.byteLength);
  result.set(iv);
  result.set(new Uint8Array(encryptedData), iv.length);

  // Convert the result to a base64-encoded string
  return btoa(String.fromCharCode.apply(null, result));
}

// Function to decrypt data
async function decryptData(encryptedData) {
  // Convert the base64-encoded string back to a Uint8Array
  const binaryData = atob(encryptedData);
  const dataArray = new Uint8Array(binaryData.length);

  for (let i = 0; i < binaryData.length; i++) {
    dataArray[i] = binaryData.charCodeAt(i);
  }

  // Extract IV from the first 12 bytes
  const iv = dataArray.slice(0, 12);

  // Extract encrypted data from the remaining bytes
  const encryptedDataArray = dataArray.slice(12);

  // Use a TextEncoder to convert the key to bytes
  const keyData = new TextEncoder().encode(fixedKey);

  // Use the keyData as the raw key for decryption
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  // Decrypt the data
  const decryptedData = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    cryptoKey,
    encryptedDataArray
  );

  // Convert the decrypted data to a string
  const decoder = new TextDecoder();
  return decoder.decode(decryptedData);
}

window.encryptData = encryptData
window.decryptData = decryptData
window.saveDataToCSV = saveDataToCSV;
window.addUser = addUser;
window.addProduct = addProduct;
window.disableProduct = disableProduct;
window.createSale = createSale;
window.modifySale = modifySale;
window.deleteSale = deleteSale;


