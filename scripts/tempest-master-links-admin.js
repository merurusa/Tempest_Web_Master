import { doc, getDoc, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { app, db, showInlineMessage } from "./tempest-firebase.js";

const form = document.querySelector(".admin-links-form");
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

async function loadLinks() {
  if (!form) return;
  const snap = await getDoc(doc(db, "stores", "master", "settings", "links"));
  if (!snap.exists()) return;
  const data = snap.data();
  Object.keys(data).forEach((key) => {
    if (field(key)) field(key).value = data[key] || "";
  });
}

async function saveLinks() {
  if (!currentUser) {
    showInlineMessage(form, "ログインしてから保存してください。", true);
    return;
  }
  try {
    await setDoc(doc(db, "stores", "master", "settings", "links"), {
      xUrl: value("xUrl"),
      instagramUrl: value("instagramUrl"),
      tiktokUrl: value("tiktokUrl"),
      appStoreUrl: value("appStoreUrl"),
      googlePlayUrl: value("googlePlayUrl"),
      updatedAt: serverTimestamp()
    }, { merge: true });
    showInlineMessage(form, "保存しました。");
  } catch (error) {
    console.error(error);
    const code = error?.code ? ` (${error.code})` : "";
    showInlineMessage(form, `保存に失敗しました${code}`, true);
  }
}

form?.querySelector(".admin-confirm-button")?.addEventListener("click", saveLinks);
loadLinks().catch((error) => console.error(error));
