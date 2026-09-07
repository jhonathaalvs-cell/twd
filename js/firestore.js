import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { doc, getDoc, setDoc, collection, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

export function requireUser(callback) {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      unsubscribe();
      if (!user) {
        window.location.href = location.pathname.includes("/pages/") ? "../index.html" : "index.html";
        reject(new Error("Usuário não autenticado"));
      } else {
        callback?.(user);
        resolve(user);
      }
    });
  });
}

export function sheetRef(uid, id) {
  return doc(db, "users", uid, "fichas", id);
}

export async function loadSheet(uid, id, defaults = {}) {
  const snap = await getDoc(sheetRef(uid, id));
  return snap.exists() ? snap.data() : defaults;
}

export async function saveSheet(uid, id, data) {
  await setDoc(sheetRef(uid, id), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function listSheets(uid) {
  const snap = await getDocs(collection(db, "users", uid, "fichas"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function debounce(fn, delay = 700) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
