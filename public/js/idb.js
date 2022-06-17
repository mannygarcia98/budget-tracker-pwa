/*
// create a variable to hold db connection
let db;

// establish a connection to IndexedDB database called 'budget'
const request = indexedDB.open("budget", 1);

// this event will emit if the database version changes
request.onupgradeneeded = function (event) {
  // save a reference to the database
  const db = event.target.result;
  // create an object store (table) called 'offlineTransaction'
  db.createObjectStore("offlineTransaction", { autoIncrement: true });
};

// upon a successful
request.onsuccess = function (event) {
  // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
  db = event.target.result;

  // check if app is online, if yes run uploadTransactions() function to send all local db data to api
  if (navigator.onLine) {
    // we haven't created this yet, but we will soon, so let's comment it out for now
    //insert many
    // uploadTransactions();
  }
};

request.onerror = function (event) {
  // log error here
  console.log(event.target.errorCode);
};

// This function will be executed if we attempt to submit a new pizza and there's no internet connection
function saveRecord(record) {
  // open a new transaction with the database with read and write permissions
  const transaction = db.transaction(["offlineTransaction"], "readwrite");

  // access the object store for `budget`
  const budgetObjectStore = transaction.objectStore("offlineTransaction");

  // add record to your store with add method
  budgetObjectStore.add(record);
}
*/

let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore("new_transaction", { autoIncrement: true });
};

request.onsuccess = function (event) {
  // when db is successfully created with its object store (from onupgradedneeded event above), save reference to db in global variable
  db = event.target.result;

  // check if app is online, if yes run checkDatabase() function to send all local db data to api
  if (navigator.onLine) {
    // uploadPizza();
  }
};

request.onerror = function (event) {
  // log error here
  console.log(event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["new_transaction"], "readwrite");

  const transactionsObjectStore = transaction.objectStore("new_transaction");

  // add record to your store with add method.
  transactionsObjectStore.add(record);
}

// function uploadPizza() {
//   // open a transaction on your pending db
//   const transaction = db.transaction(["new_pizza"], "readwrite");

//   // access your pending object store
//   const pizzaObjectStore = transaction.objectStore("new_pizza");

//   // get all records from store and set to a variable
//   const getAll = pizzaObjectStore.getAll();

//   getAll.onsuccess = function () {
//     // if there was data in indexedDb's store, let's send it to the api server
//     if (getAll.result.length > 0) {
//       fetch("/api/pizzas", {
//         method: "POST",
//         body: JSON.stringify(getAll.result),
//         headers: {
//           Accept: "application/json, text/plain, */*",
//           "Content-Type": "application/json",
//         },
//       })
//         .then((response) => response.json())
//         .then((serverResponse) => {
//           if (serverResponse.message) {
//             throw new Error(serverResponse);
//           }

//           const transaction = db.transaction(["new_pizza"], "readwrite");
//           const pizzaObjectStore = transaction.objectStore("new_pizza");
//           // clear all items in your store
//           pizzaObjectStore.clear();
//         })
//         .catch((err) => {
//           // set reference to redirect back here
//           console.log(err);
//         });
//     }
//   };
// }

// listen for app coming back online

// window.addEventListener("online", uploadPizza);
