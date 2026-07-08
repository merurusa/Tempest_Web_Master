import { castImageUrl, castSlotFromPath, escapeHtml, loadCast } from "./tempest-cast-data.js";
import { inferStoreIdFromPath } from "./tempest-firebase.js";

const storeId = inferStoreIdFromPath();
const slot = castSlotFromPath();

function linkButton(className, href, label) {
  const url = href || "#";
  return `<a class="social-button ${className}" href="${escapeHtml(url)}" target="_blank" rel="noopener"><span>${label}</span><small>Profile</small></a>`;
}

async function render() {
  const cast = await loadCast(storeId, slot);
  const title = cast.name || "Cast";
  document.title = `${title} | Tempest Cast`;
  document.querySelector(".hero h1")?.replaceChildren(document.createTextNode(title));
  document.querySelector(".hero .cast-role")?.remove();
  if (cast.role && cast.role !== "Cast" && cast.role !== "Coming soon") {
    document.querySelector(".hero-content")?.insertAdjacentHTML("beforeend", `<span class="cast-role">${escapeHtml(cast.role)}</span>`);
  }

  const photo = document.querySelector(".cast-profile-photo");
  const imageUrl = castImageUrl(cast, "profile");
  if (photo) {
    photo.className = `cast-profile-photo ${escapeHtml(cast.imagePosition || "image-pos-center")}`;
    photo.innerHTML = imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(title)}">` : "<span>?</span>";
  }

  const info = document.querySelector(".cast-profile-info");
  if (info) {
    info.innerHTML = `
      <h2>${escapeHtml(title)}</h2>
      <div class="profile-list">
        <div><span>Height</span><strong>${escapeHtml(cast.height || "Coming soon")}</strong></div>
        <div><span>Birthday</span><strong>${escapeHtml(cast.birthday || "Coming soon")}</strong></div>
        <div><span>Hobby</span><strong>${escapeHtml(cast.hobby || "Coming soon")}</strong></div>
      </div>
      <nav class="top-social-links cast-profile-social" aria-label="Cast social links">
        ${linkButton("x", cast.xUrl, "X")}
        ${linkButton("instagram", cast.instagramUrl, "Instagram")}
        ${linkButton("tiktok", cast.tiktokUrl, "TikTok")}
      </nav>
    `;
  }
}

render().catch((error) => console.error(error));
