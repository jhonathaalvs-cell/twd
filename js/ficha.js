import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { loadSheet, saveSheet, debounce } from "./firestore.js";

const form = document.querySelector("#characterForm");
const status = document.querySelector("#saveStatus");
const params = new URLSearchParams(location.search);

const defaults = {
  nome:"", arquetipo:"", descricao:"", motivacao:"", pjAncora:"", pnjAncora:"",
  peculiaridades:"", anotacoes:"", talentos:"", lesoesCriticas:"",
  estresse:0, experiencia:0, sobrecarga:0, armaduraNome:"", armaduraProtecao:"",
  armaduraPenalidade:"", equipamentoArmazenado:"", itensMinusculos:"",
  vigorCombate:0, vigorTolerancia:0, vigorForca:0,
  agilidadeMobilidade:0, agilidadeDistancia:0, agilidadeFurtividade:0,
  perspicaciaReconhecimento:0, perspicaciaSobrevivencia:0, perspicaciaTecnologia:0,
  empatiaLideranca:0, empatiaManipulacao:0, empatiaMedicina:0
};

const weaponFields = ["nome","dano","bonus","alcance"];
const weaponRows = Array.from({length:5}, (_, i) => `
<tr>${weaponFields.map(field => `<td><input data-weapon="${i}" data-field="${field}"></td>`).join("")}</tr>
`).join("");
document.querySelector("#weaponsRows").innerHTML = weaponRows;

function getOrCreateId(user) {
  if (params.get("id")) return params.get("id");

  // Cada usuário ganha um ID persistente para a ficha aberta.
  // Assim, atualizar a página não cria uma ficha nova e vazia.
  const key = `twd-rpg-active-ficha-${user.uid}`;
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }

  const newUrl = `${location.pathname}?id=${encodeURIComponent(id)}`;
  history.replaceState(null, "", newUrl);
  return id;
}

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
    weaponFields.map(field => [
      field,
      document.querySelector(`[data-weapon="${i}"][data-field="${field}"]`)?.value || ""
    ])
  ));

  return data;
}

function setStatus(text, type = "") {
  status.textContent = `● ${text}`;
  status.classList.toggle("saving", type === "saving");
}

let currentUser = null;
let fichaId = null;

const save = debounce(async () => {
  if (!currentUser || !fichaId) return;

  setStatus("Salvando...", "saving");
  try {
    await saveSheet(currentUser.uid, fichaId, {
      ...collect(),
      tipo: "personagem"
    });
    setStatus("Salvo agora");
  } catch (error) {
    console.error("Erro ao salvar ficha:", error);
    setStatus(`Erro: ${error.code || "verifique o Firestore"}`);
  }
}, 500);

onAuthStateChanged(auth, async user => {
  if (!user) {
    location.href = "../index.html";
    return;
  }

  currentUser = user;
  fichaId = getOrCreateId(user);

  try {
    setStatus("Carregando...");
    const data = await loadSheet(user.uid, fichaId, defaults);
    setForm({ ...defaults, ...data });
    setStatus("Salvo");

    // Listener é adicionado somente depois de carregar os dados,
    // evitando salvar os campos vazios antes da ficha ser carregada.
    form.addEventListener("input", save);
    form.addEventListener("change", save);

    document.querySelector("#logout").addEventListener("click", () => signOut(auth));
  } catch (error) {
    console.error("Erro ao carregar ficha:", error);
    setStatus(`Erro: ${error.code || "verifique o Firebase"}`);
  }
});
