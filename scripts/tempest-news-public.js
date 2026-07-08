import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { db, inferStoreIdFromPath } from "./tempest-firebase.js";

const storeId = inferStoreIdFromPath();
const panel = document.querySelector("#news .panel");

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function cardTemplate(post) {
  const style = post.imageUrl ? ` style="background-image:url('${escapeHtml(post.imageUrl)}')"` : "";
  const date = post.date ? `<time>${escapeHtml(post.date)}</time>` : "";
  const body = post.body ? `<small>${escapeHtml(post.body).replace(/\n/g, "<br>")}</small>` : "";

  return `
    <article class="news-thumb-card db-news-card"${style}>
      <span class="news-thumb-title">${escapeHtml(post.title || "Latest News")}</span>
      <span class="db-news-meta">${date}${body}</span>
    </article>
  `;
}

function renderEmpty() {
  if (!panel) return;
  const list = panel.querySelector(".news-card-list");
  if (list && list.children.length) return;
  if (list) {
    list.innerHTML = '<article class="news-thumb-card db-news-card"><span class="news-thumb-title">Coming soon</span></article>';
  }
}

async function renderNews() {
  if (!panel) return;
  const list = panel.querySelector(".news-card-list");
  if (!list) return;

  const snap = await getDocs(query(collection(db, "stores", storeId, "newsPosts"), orderBy("createdAt", "desc")));
  const posts = snap.docs
    .map((docSnap) => docSnap.data())
    .filter((post) => post.visible !== false)
    .slice(0, 3);

  if (!posts.length) {
    renderEmpty();
    return;
  }

  list.innerHTML = posts.map(cardTemplate).join("");
}

renderNews().catch((error) => {
  console.error(error);
  renderEmpty();
});
