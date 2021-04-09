const request = window.indexedDB.open("budget", 1);

request.onsuccess = event => {
  console.log(request.result);
};

request.onupgradeneeded = ({ target }) => {
  const db = target.result;
  const objectStore = db.createObjectStore("pending", { autoIncrement: true });
};

