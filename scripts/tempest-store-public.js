import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { db, inferStoreIdFromPath } from "./tempest-firebase.js";
import { storeDefaults } from "./tempest-store-defaults.js";

const storeId = inferStoreIdFromPath();

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function priceRows(priceText = "") {
  return priceText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split("/");
      const price = rest.join("/") || "";
      return `<div class="price-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(price)}</strong></div>`;
    })
    .join("");
}

async function renderStore() {
  const base = storeDefaults[storeId] || storeDefaults.various;
  const snap = await getDoc(doc(db, "stores", storeId, "storeInfo", "main"));
  const data = snap.exists() ? { ...base, ...snap.data() } : base;
  const lead = document.querySelector(".hero .lead");
  const open = document.querySelector("#open h2");
  const prices = document.querySelector("#price .price-list");

  if (lead) {
    lead.innerHTML = `住所：${escapeHtml(data.address || "準備中")}<br>TEL：${escapeHtml(data.tel || "準備中")}`;
  }
  if (open) {
    open.textContent = `${data.openStart || ""}〜${data.openEnd || ""}`;
  }
  if (prices) {
    prices.innerHTML = priceRows(data.priceText);
  }
}

renderStore().catch((error) => console.error(error));
