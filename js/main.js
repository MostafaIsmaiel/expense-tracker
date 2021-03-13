const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const date = document.getElementById('date');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "" || date.value === "") {
    alert('Please add a text, amount & date value');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
      date: date.value.toLocaleString()
    }

    transactions.push(transaction);

    addTransactionDOM(transaction);

    updateValues();

    updateLocalStorage();

    text.value = '';
    amount.value = '';
    date.value = '';
  }
}

//  Generat random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

//  Add transaction to DOM list
function addTransactionDOM(transaction) {
  //  Get sign
  const sign = transaction.amount < 0 ? '-' : '+';

  const item = document.createElement('li');

  // Add class based on value
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span class="date">${transaction.date}</span> <span>${sign}${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">X</button>
  `;
  list.appendChild(item);
};

// Update the balance, income and expense
function updateValues() {
  const amounts = transactions.map(transaction =>
    transaction.amount);

  const total = amounts.reduce((accumulator, item) => accumulator += item, 0)
    .toFixed(2);


  const income = amounts.filter(item => item > 0)
    .reduce((accumulator, item) => accumulator += item, 0)
    .toFixed(2);

  const expense = (amounts.filter(item => item < 0)
    .reduce((accumulator, item) => accumulator += item, 0) * -1)
    .toFixed(2);

  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
};

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);

  updateLocalStorage();
  init();
}

// Update localStorage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

// Init app
function init() {
  list.innerHTML = "";

  transactions.forEach(addTransactionDOM);
  updateValues();
};
init();

// Add event listner
form.addEventListener('submit', addTransaction);
