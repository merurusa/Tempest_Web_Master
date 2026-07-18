import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { db, inferStoreIdFromPath } from "./tempest-firebase.js";

const storeId = inferStoreIdFromPath();

function setHref(link, url) {
  if (!link || !url) return;
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener";
  link.removeAttribute("aria-disabled");
}

function setActionLinks(data) {
  const actionLinks = document.querySelectorAll(".shop-action-links .action-card");
  setHref(actionLinks[0], data.recruitUrl);
}

function setSocialLinks(data) {
  setHref(document.querySelector(".shop-official-social .social-button.x"), data.xUrl);
  setHref(document.querySelector(".shop-official-social .social-button.instagram"), data.instagramUrl);
  setHref(document.querySelector(".shop-official-social .social-button.tiktok"), data.tiktokUrl);
}

async function renderOfficialInfo() {
  const snap = await getDoc(doc(db, "stores", storeId, "officialInfo", "main"));
  if (!snap.exists()) return;

  const data = snap.data();
  setActionLinks(data);
  setSocialLinks(data);
}

renderOfficialInfo().catch((error) => console.error(error));
