let db;
// create a new db request for a "budget" database.
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
  // create object store called "new_transaction" and set autoIncrement to true
  const db = event.target.result;
  db.createObjectStore("new_transaction", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    uploadTransaction();
  }
};

request.onerror = function (event) {
  // log error here
  console.log(event.target.errorCode);
};

function saveRecord(record) {
  // create a transaction on the new_transaction db with readwrite access
  const transaction = db.transaction(["new_transaction"], "readwrite");

  // access your new_transaction object store
  const budgetObjectStore = transaction.objectStore("new_transaction");

  // add record to your store with add method.
  budgetObjectStore.add(record);
}

function uploadTransaction() {
  // open a transaction on your new_transaction db
  const transaction = db.transaction(["new_transaction"], "readwrite");

  // access your new_transaction object store
  const budgetObjectStore = transaction.objectStore("new_transaction");
  // get all records from store and set to a variable
  const getAll = budgetObjectStore.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          // if successful, open a transaction on your new_transaction db
          const transaction = db.transaction(["new_transaction"], "readwrite");

          // access your new_transaction object store
          const budgetObjectStore = transaction.objectStore("new_transaction");

          // clear all items in your store
          budgetObjectStore.clear();
        });
    }
  };
}

// listen for app coming back online
window.addEventListener("online", uploadTransaction);
