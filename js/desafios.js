import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { loadSheet, saveSheet, debounce } from "./firestore.js";

const form = document.querySelector("#challengeForm");
const status = document.querySelector("#saveStatus");
const manualSaveButton = document.querySelector("#manualSave");
const id = new URLSearchParams(location.search).get("id") || "principal";

function setForm(data) { for (const el of form.elements) if (el.name) el.value = data[el.name] ?? ""; }
function collect() { return Object.fromEntries(Array.from(form.elements).filter(e => e.name).map(e => [e.name, e.value])); }
const save = debounce(async user => {
  status.textContent = "● Salvando...";
  try { await saveSheet(user.uid, `desafios_${id}`, collect()); status.textContent = "● Salvo agora"; }
  catch { status.textContent = "● Erro ao salvar"; }
}, 700);

manualSaveButton?.addEventListener("click", () => {
  if (window.__currentUser) save(window.__currentUser);
});

onAuthStateChanged(auth, async user => {
  if (!user) return location.href = "../index.html";
  window.__currentUser = user;
  setForm(await loadSheet(user.uid, `desafios_${id}`, {}));
  form.addEventListener("input", () => save(user));
  document.querySelector("#logout").addEventListener("click", () => signOut(auth));
});
