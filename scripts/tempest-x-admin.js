import { doc, getDoc, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getDownloadURL, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { app, db, inferStoreIdFromPath, showInlineMessage, storage } from "./tempest-firebase.js";

const storeId = inferStoreIdFromPath();
const cards = [...document.querySelectorAll(".admin-x-card")];
const auth = getAuth(app);
let currentUser = auth.currentUser;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

function field(card, suffix) {
  return card.querySelector(`[name$="${suffix}"]`);
}

function cardId(index) {
  return `card${index + 1}`;
}

function collectCard(card, index) {
  return {
    visible: field(card, "Visible")?.value !== "Hide",
    order: Number(field(card, "Order")?.value || index + 1),
    date: field(card, "Date")?.value.trim() || "",
    text: field(card, "Text")?.value.trim() || "",
    url: field(card, "Url")?.value.trim() || "",
    updatedAt: serverTimestamp()
  };
}

async function uploadImageIfNeeded(card, index, data) {
  const input = field(card, "Image");
  const file = input?.files?.[0];
  if (!file) return data;

  const safeName = file.name.replace(/[^\w.-]/g, "_");
  const storagePath = `stores/${storeId}/xCards/${cardId(index)}/${Date.now()}-${safeName}`;
  const fileRef = ref(storage, storagePath);
  await uploadBytes(fileRef, file);
  return {
    ...data,
    imageUrl: await getDownloadURL(fileRef),
    imagePath: storagePath
  };
}

function setPreview(card, imageUrl) {
  const preview = card.querySelector(".admin-x-preview");
  if (!preview || !imageUrl) return;
  preview.innerHTML = `<img src="${imageUrl}" alt="">`;
}

function fillCard(card, data = {}) {
  if (field(card, "Visible")) field(card, "Visible").value = data.visible === false ? "Hide" : "Show";
  if (field(card, "Order")) field(card, "Order").value = data.order || "";
  if (field(card, "Date")) field(card, "Date").value = data.date || "";
  if (field(card, "Text")) field(card, "Text").value = data.text || "";
  if (field(card, "Url")) field(card, "Url").value = data.url || "";
  setPreview(card, data.imageUrl);
}

async function loadCards() {
  await Promise.all(cards.map(async (card, index) => {
    const snap = await getDoc(doc(db, "stores", storeId, "xCards", cardId(index)));
    if (snap.exists()) fillCard(card, snap.data());
  }));
}

async function saveCard(card, index) {
  const button = card.querySelector(".admin-x-update-button");
  const originalText = button?.textContent || "保存";

  if (!currentUser) {
    showInlineMessage(card, "ログインしてから保存してください。", true);
    return;
  }

  if (button) {
    button.disabled = true;
    button.textContent = "保存中...";
  }

  try {
    let data = collectCard(card, index);
    data = await uploadImageIfNeeded(card, index, data);
    await setDoc(doc(db, "stores", storeId, "xCards", cardId(index)), data, { merge: true });
    setPreview(card, data.imageUrl);
    showInlineMessage(card, "保存しました。");
  } catch (error) {
    console.error(error);
    const code = error?.code ? ` (${error.code})` : "";
    showInlineMessage(card, `保存に失敗しました${code}。Firebase設定を確認してください。`, true);
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = originalText;
    }
  }
}

cards.forEach((card, index) => {
  field(card, "Image")?.addEventListener("change", () => {
    const file = field(card, "Image")?.files?.[0];
    if (!file) return;
    setPreview(card, URL.createObjectURL(file));
  });

  card.querySelector(".admin-x-update-button")?.addEventListener("click", () => saveCard(card, index));
});

loadCards().catch((error) => {
  console.error(error);
  cards.forEach((card) => showInlineMessage(card, "読み込みに失敗しました。Firebase設定を確認してください。", true));
});
