import { addDoc, collection, serverTimestamp, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDownloadURL, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";
import { app, db, inferStoreIdFromPath, showInlineMessage, storage } from "./tempest-firebase.js";

const storeId = inferStoreIdFromPath();
const auth = getAuth(app);
const form = document.querySelector(".admin-news-form");
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

async function uploadNewsImage(docRef) {
  const file = field("newsImage")?.files?.[0];
  if (!file) return {};

  const safeName = file.name.replace(/[^\w.-]/g, "_");
  const storagePath = `stores/${storeId}/newsPosts/${docRef.id}/${Date.now()}-${safeName}`;
  const fileRef = ref(storage, storagePath);
  await uploadBytes(fileRef, file);
  return {
    imageUrl: await getDownloadURL(fileRef),
    imagePath: storagePath
  };
}

async function saveNews() {
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
    const docRef = await addDoc(collection(db, "stores", storeId, "newsPosts"), {
      title: value("newsTitle"),
      body: value("newsBody"),
      date: value("newsDate") || new Date().toISOString().slice(0, 10),
      visible: field("newsVisible")?.value !== "Hide",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const imageData = await uploadNewsImage(docRef);
    if (imageData.imageUrl) {
      await updateDoc(docRef, imageData);
    }

    form.reset();
    showInlineMessage(form, "保存しました。");
  } catch (error) {
    console.error(error);
    const code = error?.code ? ` (${error.code})` : "";
    showInlineMessage(form, `保存に失敗しました${code}。Firebase設定を確認してください。`, true);
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = originalText;
    }
  }
}

form?.querySelector(".admin-confirm-button")?.addEventListener("click", saveNews);
