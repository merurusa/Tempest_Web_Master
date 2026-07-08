import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";
import { firebaseConfig } from "./firebase-config.js";

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export { app };

export function inferStoreIdFromPath() {
  const page = location.pathname.split("/").pop() || "";
  const fileStore = page.split("-")[0].replace(".html", "");
  const bodyStore = [...document.body.classList]
    .find((className) => className.startsWith("shop-") || className.startsWith("admin-"))
    ?.replace("shop-", "")
    ?.replace("admin-", "");

  return bodyStore || fileStore || "various";
}

export function showInlineMessage(target, text, isError = false) {
  let message = target.querySelector(".admin-save-message");
  if (!message) {
    message = document.createElement("p");
    message.className = "admin-save-message";
    target.appendChild(message);
  }
  message.textContent = text;
  message.dataset.status = isError ? "error" : "ok";
}
