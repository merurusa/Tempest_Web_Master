import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { db, inferStoreIdFromPath } from "./tempest-firebase.js";

const storeId = inferStoreIdFromPath();
const section = document.querySelector(".shop-x-section .panel");

function escapeHtml(value = "") {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function cardTemplate(card) {
  const image = card.imageUrl
    ? `<figure class="x-post-image"><img src="${escapeHtml(card.imageUrl)}" alt=""></figure>`
    : "";
  const text = card.text ? `<p class="x-post-text">${escapeHtml(card.text).replace(/\n/g, "<br>")}</p>` : "";
  const date = card.date ? `<time class="x-post-date">${escapeHtml(card.date)}</time>` : "";
  const href = card.url || "#";

  return `
    <a class="x-post-card rich-x-post-card" href="${escapeHtml(href)}" target="_blank" rel="noopener">
      <span class="x-post-badge">X</span>
      <strong>Official Post</strong>
      ${date}
      ${text}
      ${image}
      <small>View on X</small>
    </a>
  `;
}

function renderEmpty() {
  if (!section) return;
  const existing = section.querySelector(".shop-x-placeholder");
  if (existing) return;
  section.insertAdjacentHTML("beforeend", '<div class="shop-x-placeholder" data-x-url=""><span>Coming soon</span><small>X posts will appear here.</small></div>');
}

async function renderCards() {
  if (!section) return;

  const snap = await getDocs(query(collection(db, "stores", storeId, "xCards"), orderBy("order", "asc")));
  const cards = snap.docs
    .map((docSnap) => docSnap.data())
    .filter((card) => card.visible !== false && (card.text || card.imageUrl || card.url));

  if (!cards.length) {
    renderEmpty();
    return;
  }

  section.querySelector(".shop-x-placeholder")?.remove();
  section.querySelector(".x-post-list")?.remove();
  section.insertAdjacentHTML("beforeend", `<div class="x-post-list">${cards.map(cardTemplate).join("")}</div>`);
}

renderCards().catch((error) => {
  console.error(error);
  renderEmpty();
});
