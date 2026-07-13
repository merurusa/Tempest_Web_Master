import { collection, getDocs, limit, orderBy, query } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { app, db } from "./tempest-firebase.js";

const auth = getAuth(app);
const statusEl = document.querySelector("[data-analytics-status]");
const summaryEl = document.querySelector("[data-analytics-summary]");
const storeEl = document.querySelector("[data-analytics-stores]");
const sourceEl = document.querySelector("[data-analytics-sources]");
const pageEl = document.querySelector("[data-analytics-pages]");
const recentEl = document.querySelector("[data-analytics-recent]");

const STORE_LABELS = {
  top: "TOP",
  various: "Various",
  solomon: "Solomon",
  lively: "Lively",
  charme: "Charme",
  strive: "Strive",
  ebichanchi: "えびちゃん家"
};

function setStatus(text) {
  if (statusEl) statusEl.textContent = text;
}

function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  return new Date(value);
}

function isSameDate(date, base) {
  return date && date.toDateString() === base.toDateString();
}

function withinDays(date, days) {
  if (!date) return false;
  const from = new Date();
  from.setDate(from.getDate() - days + 1);
  from.setHours(0, 0, 0, 0);
  return date >= from;
}

function countBy(items, keyFn) {
  const map = new Map();
  items.forEach((item) => {
    const key = keyFn(item) || "unknown";
    map.set(key, (map.get(key) || 0) + 1);
  });
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function renderSummary(items) {
  const now = new Date();
  const today = items.filter((item) => isSameDate(item.createdAtDate, now)).length;
  const sevenDays = items.filter((item) => withinDays(item.createdAtDate, 7)).length;
  const mobile = items.filter((item) => item.device === "mobile").length;
  const direct = items.filter((item) => item.source === "direct").length;

  summaryEl.innerHTML = [
    ["今日", today],
    ["7日間", sevenDays],
    ["読み込み件数", items.length],
    ["スマホ", mobile],
    ["直接アクセス", direct]
  ].map(([label, value]) => `<article class="analytics-kpi"><span>${label}</span><strong>${value}</strong></article>`).join("");
}

function renderRanking(target, rows, emptyText) {
  if (!target) return;
  if (!rows.length) {
    target.innerHTML = `<p class="analytics-empty">${emptyText}</p>`;
    return;
  }

  target.innerHTML = rows.slice(0, 10).map(([label, count]) => `
    <div class="analytics-row">
      <span>${label}</span>
      <strong>${count}</strong>
    </div>
  `).join("");
}

function renderRecent(items) {
  if (!recentEl) return;
  recentEl.innerHTML = items.slice(0, 20).map((item) => {
    const date = item.createdAtDate ? item.createdAtDate.toLocaleString("ja-JP") : "日時取得中";
    return `
      <div class="analytics-row analytics-row-stack">
        <span>${date}</span>
        <strong>${STORE_LABELS[item.storeId] || item.storeId || "unknown"} / ${item.source || "unknown"}</strong>
        <small>${item.path || ""}</small>
      </div>
    `;
  }).join("");
}

async function loadAnalytics() {
  setStatus("読み込み中...");
  try {
    const analyticsQuery = query(collection(db, "siteAnalytics"), orderBy("createdAt", "desc"), limit(1000));
    const snapshot = await getDocs(analyticsQuery);
    const items = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAtDate: toDate(data.createdAt)
      };
    });

    renderSummary(items);
    renderRanking(storeEl, countBy(items, (item) => STORE_LABELS[item.storeId] || item.storeId), "店舗別データはまだありません。");
    renderRanking(sourceEl, countBy(items, (item) => item.source), "流入元データはまだありません。");
    renderRanking(pageEl, countBy(items, (item) => item.path), "ページデータはまだありません。");
    renderRecent(items);
    setStatus(`最新${items.length}件を表示中`);
  } catch (error) {
    console.error(error);
    setStatus("読み込みに失敗しました。Firebaseのルールとログイン状態を確認してください。");
  }
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    setStatus("ログイン後に表示されます。");
    return;
  }
  loadAnalytics();
});
