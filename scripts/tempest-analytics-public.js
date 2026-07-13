import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { db } from "./tempest-firebase.js";

const STORE_IDS = ["various", "solomon", "lively", "charme", "strive", "ebichanchi"];

function getStoreId() {
  const fileName = location.pathname.split("/").pop() || "index.html";
  const firstPart = fileName.split("-")[0].replace(".html", "").toLowerCase();
  if (STORE_IDS.includes(firstPart)) return firstPart;

  const path = location.pathname.toLowerCase();
  return STORE_IDS.find((storeId) => path.includes(`${storeId}`)) || "top";
}

function getDeviceType() {
  const ua = navigator.userAgent || "";
  if (/ipad|tablet/i.test(ua)) return "tablet";
  if (/iphone|android.+mobile|mobile/i.test(ua)) return "mobile";
  return "desktop";
}

function getSource(urlParams) {
  const utmSource = urlParams.get("utm_source");
  if (utmSource) return utmSource;

  const referrer = document.referrer;
  if (!referrer) return "direct";

  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (host.includes("instagram")) return "instagram";
    if (host.includes("x.com") || host.includes("twitter")) return "x";
    if (host.includes("tiktok")) return "tiktok";
    if (host.includes("google")) return "google";
    if (host.includes("yahoo")) return "yahoo";
    return host;
  } catch {
    return "unknown";
  }
}

function shouldSkip() {
  if (location.pathname.includes("/admin/")) return true;
  if (sessionStorage.getItem(`analytics:${location.pathname}`)) return true;
  return false;
}

async function trackPageView() {
  if (shouldSkip()) return;

  const params = new URLSearchParams(location.search);
  const today = new Date();
  const dateKey = today.toISOString().slice(0, 10);

  try {
    await addDoc(collection(db, "siteAnalytics"), {
      path: location.pathname,
      pageTitle: document.title || "",
      storeId: getStoreId(),
      referrer: document.referrer || "",
      source: getSource(params),
      medium: params.get("utm_medium") || "",
      campaign: params.get("utm_campaign") || "",
      device: getDeviceType(),
      language: navigator.language || "",
      dateKey,
      createdAt: serverTimestamp()
    });
    sessionStorage.setItem(`analytics:${location.pathname}`, "1");
  } catch (error) {
    console.warn("Analytics tracking skipped.", error);
  }
}

trackPageView();
