import { doc, getDoc, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { app, db, inferStoreIdFromPath, showInlineMessage } from "./tempest-firebase.js";

const storeId = inferStoreIdFromPath();
const form = document.querySelector(".admin-official-form");
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

async function loadOfficialInfo() {
  if (!form) return;
  const snap = await getDoc(doc(db, "stores", storeId, "officialInfo", "main"));
  if (!snap.exists()) return;
  const data = snap.data();
  ["recruitUrl", "xUrl", "instagramUrl", "tiktokUrl"].forEach((key) => setValue(key, data[key]));
}

async function saveOfficialInfo() {
  if (!form) return;
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
    await setDoc(doc(db, "stores", storeId, "officialInfo", "main"), {
      recruitUrl: value("recruitUrl"),
      xUrl: value("xUrl"),
      instagramUrl: value("instagramUrl"),
      tiktokUrl: value("tiktokUrl"),
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

form?.querySelector(".admin-confirm-button")?.addEventListener("click", saveOfficialInfo);
loadOfficialInfo().catch((error) => {
  console.error(error);
  showInlineMessage(form, "読み込みに失敗しました。", true);
});
