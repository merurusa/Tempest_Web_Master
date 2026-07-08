import { castImageUrl, escapeHtml, loadCasts } from "./tempest-cast-data.js";
import { inferStoreIdFromPath } from "./tempest-firebase.js";

const storeId = inferStoreIdFromPath();
const grid = document.querySelector(".admin-cast-select-grid");

function thumb(cast) {
  const imageUrl = castImageUrl(cast, "list");
  if (!imageUrl || cast.visible === false) return '<div class="admin-cast-thumb">?</div>';
  return `<div class="admin-cast-thumb"><img src="${escapeHtml(imageUrl)}" alt=""></div>`;
}

async function render() {
  if (!grid) return;
  const casts = await loadCasts(storeId);
  grid.innerHTML = casts.map((cast) => `
    <a class="admin-cast-select-card" href="${storeId}-cast-${cast.slot}-edit.html">
      ${thumb(cast)}
      <div><span>${escapeHtml(cast.role || "Cast")}</span><strong>${escapeHtml(cast.name || "Coming soon")}</strong></div>
    </a>
  `).join("");
}

render().catch((error) => console.error(error));
