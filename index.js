// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

// Your web app's Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const SECRET_KEY = "YOUR_SECRET_KEY";

// Turn light on
document.getElementById('lightOn').addEventListener('click', function() {
    set(ref(database, '/lightStatus'), SECRET_KEY);
});

// Turn light off
document.getElementById('lightOff').addEventListener('click', function() {
    set(ref(database, '/lightStatus'), "");
});

// Monitor light status
const lightStatusRef = ref(database, '/lightStatus');
onValue(lightStatusRef, (snapshot) => {
    const status = snapshot.val();
    console.log("Light status: ", status);
});
