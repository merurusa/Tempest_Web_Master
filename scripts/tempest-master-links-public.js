import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { db } from "./tempest-firebase.js";

function setHref(selector, url) {
  const link = document.querySelector(selector);
  if (!link || !url) return;
  link.href = url;
  link.removeAttribute("aria-disabled");
  link.classList.remove("coming-soon");
  link.target = "_blank";
  link.rel = "noopener";
}

async function renderLinks() {
  const snap = await getDoc(doc(db, "stores", "master", "settings", "links"));
  if (!snap.exists()) return;
  const data = snap.data();
  setHref(".top-social-links .social-button.x", data.xUrl);
  setHref(".top-social-links .social-button.instagram", data.instagramUrl);
  setHref(".top-social-links .social-button.tiktok", data.tiktokUrl);
  setHref(".app-store-links .store-button:nth-child(1)", data.appStoreUrl);
  setHref(".app-store-links .store-button:nth-child(2)", data.googlePlayUrl);
}

renderLinks().catch((error) => console.error(error));
