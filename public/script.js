let db;

const request = window.indexedDB.open("budget", 1);

request.onupgradeneeded = ({ target }) => {
  // const db = target.result;
  db = target.result;
  const objectStore = db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = e => {
  console.log(request.result);

  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (e) {
  console.log(`Oops! ${e.target.errorCode}`);
};

const checkDatabase = () => {
  console.log('checking on the database');

}

// function to add to pending item indexedDB
const saveRecord = (record) => {
  console.log('Saved record called');
  const transaction = db.transaction(['pending'], 'readwrite');
  const store = transaction.objectStore('pending');
  store.add(record);
}

// listen for app to come back online
window.addEventListener('online', checkDatabase);