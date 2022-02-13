'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
//Creating Users
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  })
}
createUsernames(accounts);

//Displaying Movements
const displayMovements = function(movements, sort = false) {
  containerMovements.innerHTML = '';
  const mov = sort ? movements.slice().sort((a, b) => a - b) : movements;
  mov.forEach(function(element, i) {
    let type = (element > 0) ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__value">${element}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  })
}
//calcSummaries
const calcDisplayIncome = function(movements) {
  const income = movements.filter(element => element > 0).reduce((acc, element) => element + acc);
  labelSumIn.innerHTML = `${income}$`;
}
const calcDisplayOutcome = function(movements) {
  const outcome = movements.filter(element => element < 0).length != 0 ? movements.filter(element => element < 0).reduce((acc, element) => acc + element) : 0;
  labelSumOut.innerHTML = `${Math.abs(outcome)}$`;
}
const calcDisplayInterest = function(account) {
  const interest = account.movements.filter(element => element > 0).map(element => (element * account.interestRate) / 100).filter(element => element >= 1).reduce((acc, element) => acc + element);
  labelSumInterest.innerHTML = `${interest}$`;
}
const calcDisplayBalance = function(movements) {
  const balance = movements.reduce((acc, element) => acc + element);
  labelBalance.innerHTML = `${balance}$`;
}

let currentAccount;
btnLogin.addEventListener('click', function(e) {
  e.preventDefault()
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if(currentAccount?.pin === Number(inputLoginPin.value))
    {
      labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
      containerApp.style.opacity = 100;
      inputLoginUsername.value = inputLoginPin.value = '';
      displayMovements(currentAccount.movements, false)
      calcDisplayIncome(currentAccount.movements)
      calcDisplayOutcome(currentAccount.movements)
      calcDisplayInterest(currentAccount)
      calcDisplayBalance(currentAccount.movements)
    }
    inputLoginPin.blur()
})

//Transfer
btnTransfer.addEventListener('click', function(e) {
  e.preventDefault()
  let receivedAccount = accounts.find(acc => acc.username === inputTransferTo.value);
  const amount = Number(inputTransferAmount.value);
  if(receivedAccount?.username !== currentAccount.username && amount > 0) {
    //Current
    currentAccount.movements.push(-amount)
    displayMovements(currentAccount.movements, false)
    calcDisplayIncome(currentAccount.movements)
    calcDisplayOutcome(currentAccount.movements)
    calcDisplayInterest(currentAccount)
    calcDisplayBalance(currentAccount.movements)

    //Receiver
    receivedAccount.movements.push(amount)
    inputTransferTo.value = inputTransferAmount.value = ''
    inputTransferAmount.blur()
  }
})

//Deleting Account
btnClose.addEventListener('click', function(e) {
  e.preventDefault()
  let deletedUsername = inputCloseUsername.value
  let deletedPin = Number(inputClosePin.value)
  inputCloseUsername.value = inputClosePin.value = ''
  if(deletedUsername === currentAccount.username && deletedPin === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username)
    accounts.splice(index, 1)
    containerApp.style.opacity = 0;
    console.log(accounts);
  }
})

//Loan
btnLoan.addEventListener('click', function(e) {
  e.preventDefault()
  const loan = Number(inputLoanAmount.value)
  if(loan > 0 && currentAccount.movements.some(mov => mov >= loan * 0.1)) {
    currentAccount.movements.push(loan);
    displayMovements(currentAccount.movements, false);
    calcDisplayIncome(currentAccount.movements);
    calcDisplayOutcome(currentAccount.movements);
    calcDisplayInterest(currentAccount);
    calcDisplayBalance(currentAccount.movements);
  }
  inputLoanAmount.value = "";
  inputLoanAmount.blur();
})

//Sort

let sorted = false
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
let mov = [5000, 3400, -150, -790, -3210, -1000, 8500, -30]

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
/////////////////////////////////////////////////////