import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { adminAccounts } from "./firebase-config.js";
import { app } from "./tempest-firebase.js";

const form = document.getElementById("admin-login-form");
const idInput = document.getElementById("admin-id");
const passwordInput = document.getElementById("admin-password");
const message = document.getElementById("admin-login-message");

function setMessage(text) {
  if (message) {
    message.textContent = text;
  }
}

if (form && idInput && passwordInput) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = idInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();
    const account = adminAccounts[id];

    if (!account) {
      setMessage("IDが正しくありません。");
      return;
    }

    if (password.length < 6) {
      setMessage("パスワードは6文字以上で入力してください。");
      return;
    }

    try {
      setMessage("ログイン中...");
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, account.email, password);
      window.location.href = account.redirect;
    } catch (error) {
      console.error(error);
      setMessage("ログインに失敗しました。IDとパスワードを確認してください。");
    }
  });
}
