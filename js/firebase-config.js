// Substitua pelos dados do seu projeto Firebase.
// Firebase Console > Configurações do projeto > Seus apps > Web.
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA_XXdAoipcIEVvooJSnSbMdutypDSX3FY",
  authDomain: "twd-rpg.firebaseapp.com",
  projectId: "twd-rpg",
  storageBucket: "twd-rpg.firebasestorage.app",
  messagingSenderId: "416242092731",
  appId: "1:416242092731:web:2e78df5d96f8f8c611379e",
  measurementId: "G-YN6EYXRJG3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
