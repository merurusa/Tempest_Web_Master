import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { db } from "./tempest-firebase.js";

const track = document.querySelector("[data-top-slider]");
const cards = [...document.querySelectorAll(".top-slide-card")];
const dots = [...document.querySelectorAll(".top-slide-dots button")];
let currentIndex = 0;
let timerId;

function setIndex(index) {
  if (!cards.length) return;
  currentIndex = (index + cards.length) % cards.length;
  cards.forEach((card) => {
    card.style.setProperty("--slide-index", currentIndex);
    card.classList.toggle("is-active", cards.indexOf(card) === currentIndex);
  });
  dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === currentIndex));
}

function startAutoSlide() {
  window.clearInterval(timerId);
  timerId = window.setInterval(() => setIndex(currentIndex + 1), 4200);
}

function attachControls() {
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      setIndex(index);
      startAutoSlide();
    });
  });

  let startX = 0;
  track?.addEventListener("pointerdown", (event) => {
    startX = event.clientX;
  });
  track?.addEventListener("pointerup", (event) => {
    const diff = event.clientX - startX;
    if (Math.abs(diff) < 32) return;
    setIndex(currentIndex + (diff < 0 ? 1 : -1));
    startAutoSlide();
  });
}

function applySlide(card, data) {
  if (!card || !data?.visible) {
    card?.setAttribute("aria-disabled", "true");
    return;
  }
  if (data.imageUrl) {
    card.style.backgroundImage = `url("${data.imageUrl}")`;
    card.classList.add("db-image-loaded");
  }
  if (data.linkUrl) {
    card.href = data.linkUrl;
    card.target = "_blank";
    card.rel = "noopener";
    card.removeAttribute("aria-disabled");
  }
}

async function loadSlides() {
  if (!cards.length) return;
  const slideQuery = query(collection(db, "stores", "master", "topSlides"), orderBy("order"));
  const snapshot = await getDocs(slideQuery);
  const slides = snapshot.docs.map((doc) => doc.data());

  slides.slice(0, 3).forEach((slide, index) => applySlide(cards[index], slide));
  setIndex(0);
  attachControls();
  startAutoSlide();
}

loadSlides().catch((error) => {
  console.error(error);
  setIndex(0);
  attachControls();
  startAutoSlide();
});
