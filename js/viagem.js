import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { loadSheet, saveSheet, debounce } from "./firestore.js";

const form = document.querySelector("#travelForm");
const status = document.querySelector("#saveStatus");
const id = new URLSearchParams(location.search).get("id") || "principal";

const fields = ["coordenadas","data","terreno","ameaca","comentarios"];
document.querySelector("#travelRows").innerHTML = Array.from({length:15}, (_, i) =>
  `<tr>${fields.map(f => `<td><input name="${f}${i}"></td>`).join("")}</tr>`
).join("");

function setForm(data) { for (const el of form.elements) if (el.name) el.value = data[el.name] ?? ""; }
function collect() { return Object.fromEntries(Array.from(form.elements).filter(e => e.name).map(e => [e.name, e.value])); }
const save = debounce(async user => {
  status.textContent = "● Salvando...";
  try { await saveSheet(user.uid, `viagem_${id}`, collect()); status.textContent = "● Salvo agora"; }
  catch { status.textContent = "● Erro ao salvar"; }
}, 700);

onAuthStateChanged(auth, async user => {
  if (!user) return location.href = "../index.html";
  setForm(await loadSheet(user.uid, `viagem_${id}`, {}));
  form.addEventListener("input", () => save(user));
  document.querySelector("#logout").addEventListener("click", () => signOut(auth));
});
