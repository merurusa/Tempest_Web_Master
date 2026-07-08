import { doc, getDoc, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { app, db, inferStoreIdFromPath, showInlineMessage } from "./tempest-firebase.js";
import { storeDefaults } from "./tempest-store-defaults.js";

const storeId = inferStoreIdFromPath();
const form = document.querySelector(".admin-store-form");
const auth = getAuth(app);
let currentUser = auth.currentUser;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

function field(name) {
  return form?.querySelector(`[name="${name}"]`);
}

function value(name) {
  return field(name)?.value.trim() || "";
}

function setValue(name, data) {
  const input = field(name);
  if (input) input.value = data || "";
}

async function loadStore() {
  if (!form) return;
  const base = storeDefaults[storeId] || storeDefaults.various;
  const snap = await getDoc(doc(db, "stores", storeId, "storeInfo", "main"));
  const data = snap.exists() ? { ...base, ...snap.data() } : base;
  ["address", "tel", "openStart", "openEnd", "priceText"].forEach((key) => setValue(key, data[key]));
}

async function saveStore() {
  if (!currentUser) {
    showInlineMessage(form, "ログインしてから保存してください。", true);
    return;
  }
  const button = form.querySelector(".admin-confirm-button");
  const originalText = button?.textContent || "保存";
  if (button) {
    button.disabled = true;
    button.textContent = "保存中...";
  }
  try {
    await setDoc(doc(db, "stores", storeId, "storeInfo", "main"), {
      address: value("address"),
      tel: value("tel"),
      openStart: value("openStart"),
      openEnd: value("openEnd"),
      priceText: value("priceText"),
      updatedAt: serverTimestamp()
    }, { merge: true });
    showInlineMessage(form, "保存しました。");
  } catch (error) {
    console.error(error);
    const code = error?.code ? ` (${error.code})` : "";
    showInlineMessage(form, `保存に失敗しました${code}`, true);
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = originalText;
    }
  }
}

form?.querySelector(".admin-confirm-button")?.addEventListener("click", saveStore);
loadStore().catch((error) => {
  console.error(error);
  showInlineMessage(form, "読み込みに失敗しました。", true);
});
