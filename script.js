import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getDatabase, ref, set, remove, onValue } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDLyuomuSnuom0NQVMZtRet55MHqZMdB6Y",
  authDomain: "isik-kontrol-7e804.firebaseapp.com",
  databaseURL: "https://isik-kontrol-7e804-default-rtdb.firebaseio.com",
  projectId: "isik-kontrol-7e804",
  storageBucket: "isik-kontrol-7e804.appspot.com",
  messagingSenderId: "1007306433265",
  appId: "1:1007306433265:web:e31012263b90874da0ff50",
  measurementId: "G-RKR3WT430H"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let isProcessing = false;
let messageElement = null;

function toggleLight(status) {
  if (isProcessing) return;

  isProcessing = true;
  set(ref(database, 'lightStatus'), status).finally(() => {
    isProcessing = false;
  });
}

function updateLightStatus() {
  const statusElement = document.getElementById('status');
  const lightStatusRef = ref(database, 'lightStatus');

  onValue(lightStatusRef, (snapshot) => {
    const status = snapshot.val();

    if (status === 'on') {
      statusElement.textContent = 'Işık açık';
      statusElement.style.color = '#4CAF50';
    } else if (status === 'off') {
      statusElement.textContent = 'Işık kapalı';
      statusElement.style.color = '#f44336';
    } else {
      statusElement.textContent = 'Durum bilinmiyor';
      statusElement.style.color = '#999';
    }
  });
}

function saveLightTimes() {
  if (isProcessing) return;

  isProcessing = true;

  const startTimeInput = document.getElementById('startTime').value;
  const endTimeInput = document.getElementById('endTime').value;

  const lightTimes = { start: startTimeInput, end: endTimeInput };

  set(ref(database, 'lightTimes'), lightTimes).then(() => {
    showMessage('Saatler kaydedildi', '#4CAF50');
  }).catch((error) => {
    console.error('Saatler kaydedilirken bir hata oluştu:', error);
  }).finally(() => {
    isProcessing = false;
  });
}

function clearLightTimes() {
  if (isProcessing) return;

  isProcessing = true;

  remove(ref(database, 'lightTimes')).then(() => {
    showMessage('Saatler temizlendi', '#f44336');
    // Saat alanlarını temizle
    document.getElementById('startTime').value = '';
    document.getElementById('endTime').value = '';
  }).catch((error) => {
    console.error('Saatler temizlenirken bir hata oluştu:', error);
  }).finally(() => {
    isProcessing = false;
  });
}

function loadSavedTimes() {
  const startTimeInput = document.getElementById('startTime');
  const endTimeInput = document.getElementById('endTime');

  const lightTimesRef = ref(database, 'lightTimes');
  onValue(lightTimesRef, (snapshot) => {
    const { start, end } = snapshot.val();

    if (start && end) {
      startTimeInput.value = start;
      endTimeInput.value = end;
    }
  });
}

function checkTimeAndToggleLight() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

  const lightTimesRef = ref(database, 'lightTimes');
  onValue(lightTimesRef, (snapshot) => {
    const { start, end } = snapshot.val();

    if (currentTime >= start && currentTime <= end) {
      toggleLight('on');
    } else {
      toggleLight('off');
    }
  });
}

function showMessage(message, color) {
  if (messageElement) {
    messageElement.remove();
  }

  messageElement = document.createElement('p');
  messageElement.textContent = message;
  messageElement.style.color = color;
  messageElement.style.fontWeight = 'bold';
  messageElement.style.marginTop = '10px';

  document.body.appendChild(messageElement);

  setTimeout(() => {
    if (messageElement) {
      messageElement.remove();
      messageElement = null;
    }
  }, 3000);
}

function setupEventListeners() {
  document.getElementById('onButton').addEventListener('click', () => {
    toggleLight('on');
  });
  document.getElementById('offButton').addEventListener('click', () => {
    toggleLight('off');
  });
  document.getElementById('saveTimeButton').addEventListener('click', saveLightTimes);
  document.getElementById('clearTimeButton').addEventListener('click', clearLightTimes);
}

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  updateLightStatus();
  loadSavedTimes();
  setInterval(checkTimeAndToggleLight, 60 * 1000); // 1 dakika
});
