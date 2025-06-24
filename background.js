// IndexedDB setup
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('db_extensao', 1);

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('licencas')) {
                db.createObjectStore('licencas');
            }
        };

        request.onsuccess = function (event) {
            resolve(event.target.result);
        };

        request.onerror = function () {
            reject('Erro ao abrir o IndexedDB');
        };
    });
}

// Salva a licença com timestamp ou null
async function saveInfoPro30(timestamp = null) {
    const db = await openDatabase();
    const tx = db.transaction('licencas', 'readwrite');
    const store = tx.objectStore('licencas');
    store.put(timestamp, 'licenca_30');//⚠️ não mudar esse nome!
    return tx.complete;
}

async function savePlanoAnual(timestamp = null) {
    const db = await openDatabase();
    const tx = db.transaction('licencas', 'readwrite');
    const store = tx.objectStore('licencas');
    store.put(timestamp, 'licenca_ano');
    return tx.complete;
}

// Carrega a licença salva
async function loadInfoPro30() {
    const db = await openDatabase();
    const tx = db.transaction('licencas', 'readonly');
    const store = tx.objectStore('licencas');
    return new Promise((resolve) => {
        const request = store.get('licenca_30');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
    });
}

async function loadPlanoAnual() {
    const db = await openDatabase();
    const tx = db.transaction('licencas', 'readonly');
    const store = tx.objectStore('licencas');
    return new Promise((resolve) => {
        const request = store.get('licenca_ano');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'loadInfoPro30') {
        loadInfoPro30().then((licenca) => {
            sendResponse({ licenca_30: licenca ?? null });
        });
        return true; // permite resposta assíncrona
    }


    if (message.type === 'loadPlanoAnual') {
        loadPlanoAnual().then((licenca) => {
            sendResponse({ licenca_ano: licenca ?? null });
        });
        return true; // permite resposta assíncrona
    }

    if (message.type === 'saveInfoPro30') {
        saveInfoPro30(message.timestamp || null).then(() => {
            sendResponse({ status: 'ok' });
        });
        return true;
    }

    if (message.type === 'savePlanoAnual') {
        savePlanoAnual(message.timestamp || null).then(() => {
            sendResponse({ status: 'ok' });
        });
        return true;
    }
});

