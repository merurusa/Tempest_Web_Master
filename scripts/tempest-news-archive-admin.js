import { collection, doc, getDocs, orderBy, query, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { app, db, inferStoreIdFromPath, showInlineMessage } from "./tempest-firebase.js";

const storeId = inferStoreIdFromPath();
const auth = getAuth(app);
const list = document.querySelector(".admin-archive-list");
let currentUser = auth.currentUser;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function postTemplate(id, post) {
  const image = post.imageUrl
    ? `<img src="${escapeHtml(post.imageUrl)}" alt="">`
    : "No Image";
  const visible = post.visible === false ? "Hide" : "Show";

  return `
    <article class="admin-archive-post" data-post-id="${escapeHtml(id)}">
      <div class="admin-archive-image">${image}</div>
      <div class="admin-archive-body"><time>${escapeHtml(post.date || "")}</time><strong>${escapeHtml(post.title || "Untitled")}</strong></div>
      <label class="admin-archive-status"><span>Status</span><select name="visible"><option ${visible === "Show" ? "selected" : ""}>Show</option><option ${visible === "Hide" ? "selected" : ""}>Hide</option></select></label>
      <button type="button" class="admin-secondary-button admin-archive-save">Save</button>
    </article>
  `;
}

async function renderArchive() {
  if (!list) return;
  const snap = await getDocs(query(collection(db, "stores", storeId, "newsPosts"), orderBy("createdAt", "desc")));
  if (snap.empty) {
    list.innerHTML = '<article class="admin-archive-post"><div class="admin-archive-body"><strong>No posts yet.</strong></div></article>';
    return;
  }
  list.innerHTML = snap.docs.map((docSnap) => postTemplate(docSnap.id, docSnap.data())).join("");
}

list?.addEventListener("click", async (event) => {
  const button = event.target.closest(".admin-archive-save");
  if (!button) return;
  const post = button.closest(".admin-archive-post");
  const postId = post?.dataset.postId;
  if (!postId) return;
  if (!currentUser) {
    showInlineMessage(post, "Not logged in. Open /admin/ and login first.", true);
    return;
  }

  try {
    button.disabled = true;
    await updateDoc(doc(db, "stores", storeId, "newsPosts", postId), {
      visible: post.querySelector('[name="visible"]')?.value !== "Hide"
    });
    showInlineMessage(post, "Saved.");
  } catch (error) {
    console.error(error);
    const code = error?.code ? ` (${error.code})` : "";
    showInlineMessage(post, `Save failed${code}.`, true);
  } finally {
    button.disabled = false;
  }
});

renderArchive().catch((error) => {
  console.error(error);
  if (list) list.innerHTML = '<article class="admin-archive-post"><div class="admin-archive-body"><strong>Load failed.</strong></div></article>';
});
