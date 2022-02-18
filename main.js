'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
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
let sorted = false
//Creating Users
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  })
}
createUsernames(accounts);

//Displaying Movements
const displayMovements = function(acc, sort = false) {
  containerMovements.innerHTML = '';
  const mov = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
  mov.forEach(function(element, i) {
    const date = new Date(acc.movementsDates[i])
    const day = `${date.getDay()}`.padStart(2, '0');
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;
    
    let type = (element > 0) ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__date">${displayDate}</div>
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
const now = new Date();
const day = `${now.getDay()}`.padStart(2, '0');
const month = `${now.getMonth() + 1}`.padStart(2, '0');
const year = now.getFullYear();
const hour = now.getHours();
const min = now.getMinutes();
labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
btnLogin.addEventListener('click', function(e) {
  e.preventDefault()
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if(currentAccount?.pin === Number(inputLoginPin.value))
    {
      labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
      containerApp.style.opacity = 100;
      inputLoginUsername.value = inputLoginPin.value = '';
      displayMovements(currentAccount, false)
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
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date());
    receivedAccount.movementsDates.push(new Date());
    displayMovements(currentAccount, false);
    calcDisplayIncome(currentAccount.movements);
    calcDisplayOutcome(currentAccount.movements);
    calcDisplayInterest(currentAccount);
    calcDisplayBalance(currentAccount.movements);

    //Receiver
    receivedAccount.movements.push(amount);
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferAmount.blur();

    
  }
})

//Deleting Account
btnClose.addEventListener('click', function(e) {
  e.preventDefault()
  let deletedUsername = inputCloseUsername.value;
  let deletedPin = Number(inputClosePin.value);
  inputCloseUsername.value = inputClosePin.value = '';
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
    currentAccount.movementsDates.push(new Date());
    displayMovements(currentAccount, false);
    calcDisplayIncome(currentAccount.movements);
    calcDisplayOutcome(currentAccount.movements);
    calcDisplayInterest(currentAccount);
    calcDisplayBalance(currentAccount.movements);

  }
  inputLoanAmount.value = "";
  inputLoanAmount.blur();
})

//Sort


btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
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