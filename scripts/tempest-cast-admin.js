import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDownloadURL, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";
import { castImageUrl, castSlotFromPath, loadCast } from "./tempest-cast-data.js";
import { app, db, inferStoreIdFromPath, showInlineMessage, storage } from "./tempest-firebase.js";

const storeId = inferStoreIdFromPath();
const slot = castSlotFromPath();
const auth = getAuth(app);
const form = document.querySelector(".admin-cast-form");
let currentUser = auth.currentUser;
let loadedCast = null;

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
  if (!input) return;
  if (input.type === "checkbox") {
    input.checked = Boolean(data);
  } else {
    input.value = data || "";
  }
}

function setPreview(cast) {
  const preview = document.querySelector(".admin-cast-preview-frame");
  if (!preview) return;
  const imageUrl = castImageUrl(cast, "profile");
  preview.className = `admin-cast-preview-frame ${cast.imagePosition || "image-pos-center"}`;
  preview.innerHTML = imageUrl ? `<img src="${imageUrl}" alt="">` : "<span>Preview</span>";
}

async function uploadImageIfNeeded(data) {
  const file = field("castImage")?.files?.[0];
  if (!file) return data;
  const safeName = file.name.replace(/[^\w.-]/g, "_");
  const storagePath = `stores/${storeId}/casts/${slot}/${Date.now()}-${safeName}`;
  const fileRef = ref(storage, storagePath);
  await uploadBytes(fileRef, file);
  return {
    ...data,
    imageUrl: await getDownloadURL(fileRef),
    imagePath: storagePath
  };
}

function collectCast() {
  return {
    role: value("role"),
    name: value("name"),
    height: value("height"),
    birthday: value("birthday"),
    hobby: value("hobby"),
    xUrl: value("xUrl"),
    instagramUrl: value("instagramUrl"),
    tiktokUrl: value("tiktokUrl"),
    imagePosition: value("imagePosition") || "image-pos-center",
    linkEnabled: Boolean(field("linkEnabled")?.checked),
    visible: value("role") !== "Coming soon",
    updatedAt: serverTimestamp()
  };
}

async function fillCast() {
  if (!form) return;
  const cast = await loadCast(storeId, slot);
  loadedCast = cast;
  setValue("role", cast.role);
  setValue("name", cast.name);
  setValue("height", cast.height);
  setValue("birthday", cast.birthday);
  setValue("hobby", cast.hobby);
  setValue("xUrl", cast.xUrl);
  setValue("instagramUrl", cast.instagramUrl);
  setValue("tiktokUrl", cast.tiktokUrl);
  setValue("imagePosition", cast.imagePosition);
  setValue("linkEnabled", cast.linkEnabled);
  document.querySelector(".admin-hero h1")?.replaceChildren(document.createTextNode(cast.name || "Cast"));
  setPreview(cast);
}

async function saveCast() {
  if (!currentUser) {
    showInlineMessage(form, "Not logged in. Open /admin/ and login first.", true);
    return;
  }

  const button = form.querySelector(".admin-confirm-button");
  const originalText = button?.textContent || "Save";
  if (button) {
    button.disabled = true;
    button.textContent = "Saving...";
  }

  try {
    let data = collectCast();
    data = await uploadImageIfNeeded(data);
    await setDoc(doc(db, "stores", storeId, "casts", slot), data, { merge: true });
    showInlineMessage(form, "Saved.");
    setPreview({ ...data });
  } catch (error) {
    console.error(error);
    const code = error?.code ? ` (${error.code})` : "";
    showInlineMessage(form, `Save failed${code}.`, true);
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = originalText;
    }
  }
}

field("castImage")?.addEventListener("change", () => {
  const file = field("castImage")?.files?.[0];
  if (!file) return;
  setPreview({ imageUrl: URL.createObjectURL(file), imagePosition: value("imagePosition") || "image-pos-center" });
});
field("imagePosition")?.addEventListener("change", () => {
  setPreview({ ...(loadedCast || {}), imagePosition: value("imagePosition") || "image-pos-center" });
});
form?.querySelector(".admin-confirm-button")?.addEventListener("click", saveCast);

fillCast().catch((error) => {
  console.error(error);
  showInlineMessage(form, "Load failed.", true);
});
