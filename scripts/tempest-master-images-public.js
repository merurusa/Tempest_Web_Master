import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { db } from "./tempest-firebase.js";

const targets = {
  topHero: ".top-hero",
  topVarious: ".shop-banner.various",
  topSolomon: ".shop-banner.solomon",
  topLively: ".shop-banner.lively",
  topCharme: ".shop-banner.charme",
  topStrive: ".shop-banner.strive",
  topEbichanchi: ".shop-banner.ebichan",
  appIcon: ".app-icon-slot"
};

async function applyImage(key, selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  const snap = await getDoc(doc(db, "stores", "master", "images", key));
  if (!snap.exists() || !snap.data().imageUrl) return;
  if (key === "appIcon") {
    el.innerHTML = `<img src="${snap.data().imageUrl}" alt="">`;
    return;
  }
  el.style.backgroundImage = `url("${snap.data().imageUrl}")`;
  el.classList.add("db-image-loaded");
}

Object.entries(targets).forEach(([key, selector]) => {
  applyImage(key, selector).catch((error) => console.error(error));
});
