import { doc, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { castDefaults } from "./tempest-cast-defaults.js";
import { db } from "./tempest-firebase.js";

export const castSlots = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];

export function defaultCasts(storeId) {
  return castDefaults[storeId] || castDefaults.various;
}

export function defaultCast(storeId, slot) {
  return defaultCasts(storeId).find((cast) => cast.slot === slot) || defaultCasts(storeId)[0];
}

export async function loadCast(storeId, slot) {
  const base = defaultCast(storeId, slot);
  const snap = await getDoc(doc(db, "stores", storeId, "casts", slot));
  return snap.exists() ? { ...base, ...snap.data(), slot } : base;
}

export async function loadCasts(storeId) {
  const base = defaultCasts(storeId);
  const bySlot = Object.fromEntries(base.map((cast) => [cast.slot, cast]));
  const snap = await getDocs(collection(db, "stores", storeId, "casts"));
  snap.forEach((docSnap) => {
    const slot = docSnap.id;
    bySlot[slot] = { ...(bySlot[slot] || { slot }), ...docSnap.data(), slot };
  });
  return castSlots.map((slot) => bySlot[slot] || defaultCast(storeId, slot));
}

export function castSlotFromPath() {
  const page = location.pathname.split("/").pop() || "";
  const match = page.match(/-cast-([a-i])(?:-edit)?\.html$/);
  return match ? match[1] : "a";
}

export function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

export function castImageUrl(cast, type = "list") {
  return cast.imageUrl || (type === "profile" ? cast.profileImageUrl : cast.listImageUrl) || "";
}
