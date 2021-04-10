let db;
let budgetVersion;

// const request = window.indexedDB.open("budget", 1);
// const request = indexedDB.open('budget', budgetVersion || 21);
const request = indexedDB.open('BudgetDB', budgetVersion || 21);

request.onupgradeneeded = function (e) {
  console.log('Upgrade needed in IndexDB');

  const { oldVersion } = e;
  const newVersion = e.newVersion || db.version;

  console.log(`DB Updated from version ${oldVersion} to ${newVersion}`);

  db = e.target.result;

  if (db.objectStoreNames.length === 0) {
    // db.createObjectStore('pending', { autoIncrement: true });
    db.createObjectStore('BudgetStore', { autoIncrement: true });
  }
};

request.onerror = function (e) {
  console.log(`Oops! ${e.target.errorCode}`);
};

const checkDatabase = () => {
  console.log('checked on the database');
  // let transaction = db.transaction(['pending'], 'readwrite');
  let transaction = db.transaction(['BudgetStore'], 'readwrite');
  // console.log('this is the transaction: ', transaction);

  // const store = transaction.objectStore('pending');
  const store = transaction.objectStore('BudgetStore');

  const getAll = store.getAll();

  getAll.onsuccess = function () {
    // If there are items in the store, we need to bulk add them when we are back online
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.length !== 0) {
            // transaction = db.transaction(['pending'], 'readwrite');
            transaction = db.transaction(['BudgetStore'], 'readwrite');

            // const currentStore = transaction.objectStore('pending');
            const currentStore = transaction.objectStore('BudgetStore');

            currentStore.clear();
            console.log('Clearing store 🧹');
          }
        });
    }
  };
}

request.onsuccess = (e) => {
  console.log(request.result);
  db = e.target.result;

  if (navigator.onLine) {
    console.log('Backend online! 🗄️');
    checkDatabase();
  }
};

// function to add to pending item indexedDB
const saveRecord = (record) => {
  console.log('Saved record called');
  // const transaction = db.transaction(['pending'], 'readwrite');
  const transaction = db.transaction(['BudgetStore'], 'readwrite');
  // const store = transaction.objectStore('pending');
  const store = transaction.objectStore('BudgetStore');
  store.add(record);
}

// listen for app to come back online
window.addEventListener('online', checkDatabase);