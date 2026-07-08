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
    : "画像なし";
  const visible = post.visible === false ? "Hide" : "Show";

  return `
    <article class="admin-archive-post" data-post-id="${escapeHtml(id)}">
      <div class="admin-archive-image">${image}</div>
      <div class="admin-archive-body"><time>${escapeHtml(post.date || "")}</time><strong>${escapeHtml(post.title || "無題")}</strong></div>
      <label class="admin-archive-status"><span>表示設定</span><select name="visible"><option value="Show" ${visible === "Show" ? "selected" : ""}>表示</option><option value="Hide" ${visible === "Hide" ? "selected" : ""}>非表示</option></select></label>
      <button type="button" class="admin-secondary-button admin-archive-save">保存</button>
    </article>
  `;
}

async function renderArchive() {
  if (!list) return;
  const snap = await getDocs(query(collection(db, "stores", storeId, "newsPosts"), orderBy("createdAt", "desc")));
  if (snap.empty) {
    list.innerHTML = '<article class="admin-archive-post"><div class="admin-archive-body"><strong>投稿はまだありません。</strong></div></article>';
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
    showInlineMessage(post, "ログインしてから保存してください。", true);
    return;
  }

  try {
    button.disabled = true;
    await updateDoc(doc(db, "stores", storeId, "newsPosts", postId), {
      visible: post.querySelector('[name="visible"]')?.value !== "Hide"
    });
    showInlineMessage(post, "保存しました。");
  } catch (error) {
    console.error(error);
    const code = error?.code ? ` (${error.code})` : "";
    showInlineMessage(post, `保存に失敗しました${code}。`, true);
  } finally {
    button.disabled = false;
  }
});

renderArchive().catch((error) => {
  console.error(error);
  if (list) list.innerHTML = '<article class="admin-archive-post"><div class="admin-archive-body"><strong>読み込みに失敗しました。</strong></div></article>';
});
