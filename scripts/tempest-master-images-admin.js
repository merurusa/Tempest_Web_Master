import { doc, getDoc, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDownloadURL, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";
import { app, db, showInlineMessage, storage } from "./tempest-firebase.js";

const form = document.querySelector(".admin-images-form");
const auth = getAuth(app);
let currentUser = auth.currentUser;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

function field(name) {
  return form?.querySelector(`[name="${name}"]`);
}

async function saveImage() {
  if (!currentUser) {
    showInlineMessage(form, "ログインしてから保存してください。", true);
    return;
  }
  const key = field("imageKey")?.value;
  const file = field("imageFile")?.files?.[0];
  if (!key || !file) {
    showInlineMessage(form, "変更場所と画像を選んでください。", true);
    return;
  }
  try {
    const safeName = file.name.replace(/[^\w.-]/g, "_");
    const storagePath = `stores/master/images/${key}/${Date.now()}-${safeName}`;
    const fileRef = ref(storage, storagePath);
    await uploadBytes(fileRef, file);
    const imageUrl = await getDownloadURL(fileRef);
    await setDoc(doc(db, "stores", "master", "images", key), {
      imageUrl,
      storagePath,
      updatedAt: serverTimestamp()
    }, { merge: true });
    showInlineMessage(form, "保存しました。");
    await loadCurrentImage();
  } catch (error) {
    console.error(error);
    const code = error?.code ? ` (${error.code})` : "";
    showInlineMessage(form, `保存に失敗しました${code}`, true);
  }
}

async function loadCurrentImage() {
  const key = field("imageKey")?.value;
  const preview = document.querySelector(".admin-image-live-preview");
  if (!key || !preview) return;
  const snap = await getDoc(doc(db, "stores", "master", "images", key));
  preview.innerHTML = snap.exists() && snap.data().imageUrl
    ? `<img src="${snap.data().imageUrl}" alt="">`
    : "<span>現在の登録画像はありません</span>";
}

form?.querySelector(".admin-confirm-button")?.addEventListener("click", saveImage);
field("imageKey")?.addEventListener("change", () => loadCurrentImage().catch((error) => console.error(error)));
loadCurrentImage().catch((error) => console.error(error));
