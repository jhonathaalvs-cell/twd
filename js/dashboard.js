import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { listSheets, sheetRef } from "./firestore.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const list = document.querySelector("#sheetList");
const count = document.querySelector("#sheetCount");
const email = document.querySelector("#userEmail");

onAuthStateChanged(auth, async user => {
  if (!user) return location.href = "index.html";
  email.textContent = user.email;
  const sheets = await listSheets(user.uid);
  count.textContent = sheets.length;
  if (!sheets.length) {
    list.innerHTML = '<div class="empty-state">Nenhuma ficha ainda. Abra “Nova ficha” para começar.</div>';
    return;
  }
  list.innerHTML = sheets.map(s => `
    <a class="sheet-card" href="pages/ficha.html?id=${encodeURIComponent(s.id)}">
      <div class="sheet-icon">♟</div>
      <div><strong>${escapeHtml(s.nome || "Sobrevivente sem nome")}</strong><span>${escapeHtml(s.arquetipo || "Arquétipo não definido")}</span></div>
      <b>→</b>
    </a>`).join("");
});

document.querySelector("#logout").addEventListener("click", () => signOut(auth));

window.escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
}[char]));
