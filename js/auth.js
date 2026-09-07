import { auth } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const form = document.querySelector("#authForm");
const message = document.querySelector("#authMessage");
const toggle = document.querySelector("#toggleAuth");
const title = document.querySelector("#authTitle");
const subtitle = document.querySelector("#authSubtitle");
const button = document.querySelector("#authButton");

let registerMode = false;

onAuthStateChanged(auth, user => {
  if (user) window.location.href = "dashboard.html";
});

toggle.addEventListener("click", () => {
  registerMode = !registerMode;
  title.textContent = registerMode ? "Criar conta" : "Entrar";
  subtitle.textContent = registerMode ? "Crie seu acesso para sua ficha." : "Acesse sua campanha e suas fichas.";
  button.textContent = registerMode ? "Criar conta" : "Entrar";
  toggle.textContent = registerMode ? "Já tenho uma conta" : "Ainda não tenho conta";
  message.textContent = "";
});

form.addEventListener("submit", async event => {
  event.preventDefault();
  message.textContent = "Processando...";
  try {
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value;
    if (registerMode) await createUserWithEmailAndPassword(auth, email, password);
    else await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    const messages = {
      "auth/invalid-credential": "E-mail ou senha incorretos.",
      "auth/email-already-in-use": "Este e-mail já possui uma conta.",
      "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
      "auth/invalid-email": "Digite um e-mail válido."
    };
    message.textContent = messages[error.code] || "Não foi possível concluir. Verifique a configuração do Firebase.";
  }
});
