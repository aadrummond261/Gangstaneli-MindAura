const DB_NAME = "mindaura_profile_media";
const DB_VERSION = 1;
const STORE_NAME = "captures";

function openProfileMediaDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });

        store.createIndex("type", "type");
        store.createIndex("createdAt", "createdAt");
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function runTransaction(mode, callback) {
  return openProfileMediaDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, mode);
        const store = transaction.objectStore(STORE_NAME);
        const request = callback(store);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        transaction.oncomplete = () => db.close();
        transaction.onerror = () => {
          db.close();
          reject(transaction.error);
        };
      })
  );
}

export async function saveProfileMedia(capture) {
  const record = {
    ...capture,
    createdAt: new Date().toISOString(),
  };

  const id = await runTransaction("readwrite", (store) => store.add(record));
  window.dispatchEvent(new CustomEvent("profile-media-saved"));
  return { ...record, id };
}

export async function getLatestProfileMedia(type) {
  const db = await openProfileMediaDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const index = transaction.objectStore(STORE_NAME).index("createdAt");
    const request = index.openCursor(null, "prev");

    request.onsuccess = () => {
      const cursor = request.result;

      if (!cursor) {
        resolve(null);
        return;
      }

      if (cursor.value.type === type) {
        resolve({ ...cursor.value, id: cursor.primaryKey });
        return;
      }

      cursor.continue();
    };

    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}
