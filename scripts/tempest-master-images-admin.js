import { doc, getDoc, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDownloadURL, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";
import { app, db, showInlineMessage, storage } from "./tempest-firebase.js";

const imageForm = document.querySelector(".admin-images-form");
const sliderForms = [...document.querySelectorAll(".admin-slider-form")];
const auth = getAuth(app);
let currentUser = auth.currentUser;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

function field(form, name) {
  return form?.querySelector(`[name="${name}"]`);
}

function value(form, name) {
  return field(form, name)?.value.trim() || "";
}

async function uploadImage(file, storagePathBase) {
  const safeName = file.name.replace(/[^\w.-]/g, "_");
  const storagePath = `${storagePathBase}/${Date.now()}-${safeName}`;
  const fileRef = ref(storage, storagePath);
  await uploadBytes(fileRef, file);
  return {
    imageUrl: await getDownloadURL(fileRef),
    storagePath
  };
}

async function saveImage() {
  if (!currentUser) {
    showInlineMessage(imageForm, "ログインしてから保存してください。", true);
    return;
  }
  const key = field(imageForm, "imageKey")?.value;
  const file = field(imageForm, "imageFile")?.files?.[0];
  if (!key || !file) {
    showInlineMessage(imageForm, "変更場所と画像を選んでください。", true);
    return;
  }
  try {
    const imageData = await uploadImage(file, `stores/master/images/${key}`);
    await setDoc(doc(db, "stores", "master", "images", key), {
      ...imageData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    showInlineMessage(imageForm, "保存しました。");
    await loadCurrentImage();
  } catch (error) {
    console.error(error);
    const code = error?.code ? ` (${error.code})` : "";
    showInlineMessage(imageForm, `保存に失敗しました${code}`, true);
  }
}

async function loadCurrentImage() {
  const key = field(imageForm, "imageKey")?.value;
  const preview = document.querySelector(".admin-image-live-preview");
  if (!key || !preview) return;
  const snap = await getDoc(doc(db, "stores", "master", "images", key));
  preview.innerHTML = snap.exists() && snap.data().imageUrl
    ? `<img src="${snap.data().imageUrl}" alt="">`
    : "<span>現在の登録画像はありません</span>";
}

async function loadSlide(form) {
  const index = Number(form.dataset.slideIndex || 1);
  const preview = form.querySelector(".admin-slider-preview");
  const snap = await getDoc(doc(db, "stores", "master", "topSlides", `slide${index}`));
  if (!snap.exists()) return;
  const data = snap.data();
  field(form, "linkUrl").value = data.linkUrl || "";
  field(form, "visible").checked = data.visible !== false;
  preview.innerHTML = data.imageUrl ? `<img src="${data.imageUrl}" alt="">` : "<span>プレビュー</span>";
}

async function saveSlide(form) {
  if (!currentUser) {
    showInlineMessage(form, "ログインしてから保存してください。", true);
    return;
  }
  const index = Number(form.dataset.slideIndex || 1);
  const file = field(form, "slideImage")?.files?.[0];
  const existingSnap = await getDoc(doc(db, "stores", "master", "topSlides", `slide${index}`));
  const existing = existingSnap.exists() ? existingSnap.data() : {};
  const imageData = file ? await uploadImage(file, `stores/master/topSlides/slide${index}`) : {};

  try {
    await setDoc(doc(db, "stores", "master", "topSlides", `slide${index}`), {
      order: index,
      linkUrl: value(form, "linkUrl"),
      visible: field(form, "visible")?.checked !== false,
      imageUrl: imageData.imageUrl || existing.imageUrl || "",
      storagePath: imageData.storagePath || existing.storagePath || "",
      updatedAt: serverTimestamp()
    }, { merge: true });
    showInlineMessage(form, "保存しました。");
    await loadSlide(form);
  } catch (error) {
    console.error(error);
    const code = error?.code ? ` (${error.code})` : "";
    showInlineMessage(form, `保存に失敗しました${code}`, true);
  }
}

imageForm?.querySelector(".admin-confirm-button")?.addEventListener("click", saveImage);
field(imageForm, "imageKey")?.addEventListener("change", () => loadCurrentImage().catch((error) => console.error(error)));
loadCurrentImage().catch((error) => console.error(error));

sliderForms.forEach((form) => {
  form.querySelector(".admin-confirm-button")?.addEventListener("click", () => saveSlide(form));
  loadSlide(form).catch((error) => console.error(error));
});
