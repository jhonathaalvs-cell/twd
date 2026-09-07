import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { loadSheet, saveSheet, debounce } from "./firestore.js";

const form = document.querySelector("#refugeForm");
const status = document.querySelector("#saveStatus");
const id = new URLSearchParams(location.search).get("id") || "principal";

document.querySelector("#projectRows").innerHTML = Array.from({length:4}, (_, i) => `
<article class="repeat-card"><h3>Projeto ${i+1}</h3>
<label>Projeto<input name="projeto${i}"></label><label>Efeito<input name="efeito${i}"></label>
<div class="form-grid two"><label>For. de Trabalho<input name="forca${i}" type="number" min="0"></label><label>Prazo Final<input name="prazo${i}"></label></div></article>`).join("");

document.querySelector("#npcRows").innerHTML = Array.from({length:8}, (_, i) => `
<article class="repeat-card"><h3>Sobrevivente ${i+1}</h3><label>Nome<input name="npcNome${i}"></label><label>Descrição<textarea name="npcDescricao${i}" rows="2"></textarea></label><label>Perícias<textarea name="npcPericias${i}" rows="2"></textarea></label><label>Peculiaridade<textarea name="npcPeculiaridade${i}" rows="2"></textarea></label><label>Equipamento<input name="npcEquipamento${i}"></label></article>`).join("");

function setForm(data) {
  for (const el of form.elements) if (el.name) el.value = data[el.name] ?? "";
}
function collect() {
  return Object.fromEntries(Array.from(form.elements).filter(e => e.name).map(e => [e.name, e.value]));
}
const save = debounce(async user => {
  status.textContent = "● Salvando...";
  try { await saveSheet(user.uid, `refugio_${id}`, collect()); status.textContent = "● Salvo agora"; }
  catch { status.textContent = "● Erro ao salvar"; }
}, 700);

onAuthStateChanged(auth, async user => {
  if (!user) return location.href = "../index.html";
  setForm(await loadSheet(user.uid, `refugio_${id}`, {}));
  form.addEventListener("input", () => save(user));
  document.querySelector("#logout").addEventListener("click", () => signOut(auth));
});
