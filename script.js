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
let manualOverride = false;
const overrideTimeout = 30 * 60 * 1000; // 30 dakika

function toggleLight(status) {
  if (isProcessing) return;

  isProcessing = true;
  manualOverride = status === 'on'; // Manuel açma işlemi yapıldıysa bayrağı ayarla

  set(ref(database, 'lightStatus'), status)
    .finally(() => {
      isProcessing = false;
      if (status === 'on') resetManualOverride(); // Işık açıldığında zaman aşımını başlat
    });
}

function updateLightStatus() {
  const statusElement = document.getElementById('status');
  const lightStatusRef = ref(database, 'lightStatus');
  const lightImage = document.getElementById('lightImage');

  onValue(lightStatusRef, (snapshot) => {
    const status = snapshot.val();
    
    if (status === 'on') {
      statusElement.textContent = 'Işık açık';  
      statusElement.style.color = '#4CAF50'; // Yeşil renk
      lightImage.src = 'images/isik1.png'; // Beyaz ampul resmi
      lightImage.classList.remove('off');
      lightImage.classList.add('on', 'fade-in');
    } else {
      statusElement.textContent = 'Işık kapalı';
      statusElement.style.color = '#f44336'; // Kırmızı renk
      lightImage.src = 'images/kapali2.png'; // Siyah ampul resmi
      lightImage.classList.remove('on');
      lightImage.classList.add('off', 'fade-out');
    }
    
    lightImage.classList.add('loaded');
  });
}

function saveLightTimes() {
  if (isProcessing) return;

  isProcessing = true;
  const daySelect = document.getElementById('day').value;
  const startTimeInput = document.getElementById('startTime').value;
  const endTimeInput = document.getElementById('endTime').value;

  const lightTimes = { day: daySelect, start: startTimeInput, end: endTimeInput };

  set(ref(database, 'lightTimes/' + daySelect), lightTimes)
    .then(() => showMessage('Saatler kaydedildi', '#4CAF50'))
    .catch(error => showMessage('Saatler kaydedilirken bir hata oluştu: ' + error.message, '#f44336'))
    .finally(() => isProcessing = false);
}

function clearLightTimes() {
  if (isProcessing) return;

  isProcessing = true;
  const daySelect = document.getElementById('day').value;

  remove(ref(database, 'lightTimes/' + daySelect))
    .then(() => {
      showMessage('Saatler temizlendi', '#f44336');
      document.getElementById('startTime').value = '';
      document.getElementById('endTime').value = '';
    })
    .catch(error => showMessage('Saatler temizlenirken bir hata oluştu: ' + error.message, '#f44336'))
    .finally(() => isProcessing = false);
}

function loadSavedTimes() {
  const daySelect = document.getElementById('day').value;
  const startTimeInput = document.getElementById('startTime');
  const endTimeInput = document.getElementById('endTime');

  onValue(ref(database, 'lightTimes/' + daySelect), (snapshot) => {
    const { start, end } = snapshot.val() || {};
    if (start && end) {
      startTimeInput.value = start;
      endTimeInput.value = end;
    }
  });
}

function checkTimeAndToggleLight() {
  if (manualOverride) return; // Manuel müdahale varsa otomatik kontrol yapma

  const now = new Date();
  const currentDay = now.toLocaleDateString('tr-TR', { weekday: 'long' }).toLowerCase(); // Günün ismi küçük harflerle
  const currentTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

  onValue(ref(database, 'lightTimes/' + currentDay), (snapshot) => {
    const { start, end } = snapshot.val() || {};
    toggleLight(currentTime >= start && currentTime <= end ? 'on' : 'off');
  });
}

function resetManualOverride() {
  setTimeout(() => {
    manualOverride = false;
    console.log('Manuel müdahale süresi doldu, otomatik ayarlar tekrar devreye girdi.');
  }, overrideTimeout);
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
  document.getElementById('lightControl').addEventListener('click', () => {
    const lightImage = document.getElementById('lightImage');
    const newStatus = lightImage.src.includes('kapali2.png') ? 'on' : 'off';
    toggleLight(newStatus);
  });

  document.getElementById('saveTimeButton').addEventListener('click', saveLightTimes);
  document.getElementById('clearTimeButton').addEventListener('click', clearLightTimes);
  document.getElementById('day').addEventListener('change', loadSavedTimes); // Gün seçimi değiştiğinde ayarları yükle
}

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  updateLightStatus();
  loadSavedTimes();
  setInterval(checkTimeAndToggleLight, 60 * 1000); // 1 dakika
});
