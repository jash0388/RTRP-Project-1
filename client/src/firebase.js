import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDeophMrlPw4U-tazVmm2rndS6lZzog8DI",
  authDomain: "rtrp-a11b1.firebaseapp.com",
  projectId: "rtrp-a11b1",
  storageBucket: "rtrp-a11b1.firebasestorage.app",
  messagingSenderId: "867308287348",
  appId: "1:867308287348:web:2807f64642c3b4c9f5a821",
  measurementId: "G-SB8N3TQWGT"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
