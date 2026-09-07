import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { loadSheet, saveSheet, debounce } from "./firestore.js";

const form = document.querySelector("#characterForm");
const status = document.querySelector("#saveStatus");
const params = new URLSearchParams(location.search);
const id = params.get("id") || crypto.randomUUID();

const defaults = {
  nome:"", arquetipo:"", descricao:"", motivacao:"", pjAncora:"", pnjAncora:"",
  peculiaridades:"", anotacoes:"", talentos:"", lesoesCriticas:"",
  estresse:0, experiencia:0, sobrecarga:0, armaduraNome:"", armaduraProtecao:"",
  armaduraPenalidade:"", equipamentoArmazenado:"", itensMinusculos:""
};

const weaponFields = ["nome","dano","bonus","alcance"];
const weaponRows = Array.from({length:5}, (_, i) => `
<tr>${weaponFields.map(field => `<td><input data-weapon="${i}" data-field="${field}"></td>`).join("")}</tr>
`).join("");
document.querySelector("#weaponsRows").innerHTML = weaponRows;

function setForm(data) {
  for (const el of form.elements) {
    if (!el.name) continue;
    if (el.type === "checkbox") el.checked = !!data[el.name];
    else el.value = data[el.name] ?? "";
  }
  (data.armas || []).forEach((weapon, i) => {
    Object.entries(weapon).forEach(([field, value]) => {
      const el = document.querySelector(`[data-weapon="${i}"][data-field="${field}"]`);
      if (el) el.value = value ?? "";
    });
  });
}

function collect() {
  const data = {};
  for (const el of form.elements) {
    if (!el.name) continue;
    data[el.name] = el.type === "checkbox" ? el.checked : el.value;
  }
  data.armas = Array.from({length:5}, (_, i) => Object.fromEntries(
    weaponFields.map(field => [field, document.querySelector(`[data-weapon="${i}"][data-field="${field}"]`)?.value || ""])
  ));
  return data;
}

const save = debounce(async user => {
  status.textContent = "● Salvando...";
  status.classList.add("saving");
  try {
    await saveSheet(user.uid, id, collect());
    status.textContent = "● Salvo agora";
  } catch (e) {
    status.textContent = "● Erro ao salvar";
  } finally {
    status.classList.remove("saving");
  }
}, 700);

onAuthStateChanged(auth, async user => {
  if (!user) return location.href = "../index.html";
  const data = await loadSheet(user.uid, id, defaults);
  setForm(data);
  form.addEventListener("input", () => save(user));
  document.querySelector("#logout").addEventListener("click", () => signOut(auth));
});
