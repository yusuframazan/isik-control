// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

// Your web app's Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function toggleLight(status) {
  set(ref(database, 'lightStatus'), status);
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

function setupEventListeners() {
  document.getElementById('onButton').addEventListener('click', () => {
    toggleLight('on');
  });
  document.getElementById('offButton').addEventListener('click', () => {
    toggleLight('off');
  });
}

// Setup event listeners and initial status check
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  updateLightStatus(); // Initial status check
});
