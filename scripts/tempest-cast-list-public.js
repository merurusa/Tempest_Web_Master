import { castImageUrl, escapeHtml, loadCasts } from "./tempest-cast-data.js";
import { inferStoreIdFromPath } from "./tempest-firebase.js";

const storeId = inferStoreIdFromPath();
const layout = document.querySelector(".cast-layout");

function imageBlock(cast) {
  const imageUrl = castImageUrl(cast, "list");
  const position = cast.imagePosition || "image-pos-center";
  if (!imageUrl || cast.visible === false) {
    return `<div class="cast-photo-placeholder coming-soon">?</div>`;
  }
  return `<div class="cast-photo-placeholder ${escapeHtml(position)}"><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(cast.name)}"></div>`;
}

function card(cast, isManager = false) {
  const disabled = cast.visible === false || cast.linkEnabled === false;
  const role = cast.role && cast.role !== "Cast" && cast.role !== "Coming soon"
    ? `<span class="cast-role">${escapeHtml(cast.role)}</span>`
    : "";
  const inner = `${imageBlock(cast)}<div class="cast-name">${role}<strong>${escapeHtml(cast.name || "Coming soon")}</strong></div>`;
  if (disabled) {
    return `<div class="cast-card cast-card-disabled ${isManager ? "manager" : ""}" aria-disabled="true">${inner}</div>`;
  }
  return `<a class="cast-card ${isManager ? "manager" : ""}" href="${storeId}-cast-${cast.slot}.html">${inner}</a>`;
}

async function render() {
  if (!layout) return;
  const casts = await loadCasts(storeId);
  const active = casts.filter((cast) => cast.visible !== false);
  const manager = active.find((cast) => cast.role === "Manager") || active[0] || casts[0];
  const rest = casts.filter((cast) => cast.slot !== manager.slot);
  layout.innerHTML = `<div class="cast-manager">${card(manager, true)}</div><div class="cast-grid">${rest.map((cast) => card(cast)).join("")}</div>`;
}

render().catch((error) => console.error(error));
