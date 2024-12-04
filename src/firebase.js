// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBAE_API_KEY,
  authDomain: "mern--estate-72b37.firebaseapp.com",
  projectId: "mern--estate-72b37",
  storageBucket: "mern--estate-72b37.appspot.com",
  messagingSenderId: "903158976170",
  appId: "1:903158976170:web:0da84807dac34442bc8ad3",
  measurementId: "G-S2T03P9FBG"
};
console.log(import.meta.env.VITE_FIREBAE_API_KEY);


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);