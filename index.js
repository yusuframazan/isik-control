// Firebase SDK'sını ve gerekli modülleri import etm
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

// Firebase yapılandırma bilgileri
const firebaseConfig = {
  apiKey: "AIzaSyDB24ndSkGlaz9pvGjRuBEHzHaNH5uh7rk",
  authDomain: "isik-kontrol-a0a97.firebaseapp.com",
  databaseURL: "https://isik-kontrol-a0a97-default-rtdb.firebaseio.com",
  projectId: "isik-kontrol-a0a97",
  storageBucket: "isik-kontrol-a0a97.appspot.com",
  messagingSenderId: "86535051838",
  appId: "1:86535051838:web:f8d8af1aded74f9b988f6f",
  measurementId: "G-06S1SL5GH7"
};

// Firebase'i başlatma
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Işık durumunu güncelleme fonksiyonu
function updateLightStatus(status) {
  const lightRef = ref(db, 'lightStatus');
  set(lightRef, status)
    .then(() => {
      console.log('Işık durumu güncellendi:', status);
    })
    .catch((error) => {
      console.error('Işık durumu güncellenirken bir hata oluştu:', error);
    });
}

// Işık durumunu dinleme fonksiyonu
function listenToLightStatus() {
  const lightRef = ref(db, 'lightStatus');
  onValue(lightRef, (snapshot) => {
    const status = snapshot.val();
    console.log('Işık durumu:', status);
    updateUI(status);
  });
}

// UI'yi güncelleme fonksiyonu
function updateUI(status) {
  const lightStatusElement = document.getElementById('lightStatus');
  lightStatusElement.textContent = `Işık durumu: ${status}`;
}

// Butonlara olay dinleyicileri ekleme
document.getElementById('turnOn').addEventListener('click', () => {
  updateLightStatus('on');
});

document.getElementById('turnOff').addEventListener('click', () => {
  updateLightStatus('off');
});

// Işık durumunu dinleme
listenToLightStatus();
