// 首頁按鈕：重新整理頁面
const homeLink = document.querySelector(".home-link");
if (homeLink) {
  homeLink.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.reload();
  });
}

// Hero 背景輪播
const hero = document.querySelector(".hero");

// 這裡換成你的遊戲截圖
const heroImages = [
  "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80"
];

let heroIndex = 0;

function setHeroBackground(index) {
  if (!hero) return;
  hero.style.backgroundImage = `url('${heroImages[index]}')`;
}

setHeroBackground(heroIndex);

setInterval(() => {
  heroIndex = (heroIndex + 1) % heroImages.length;
  setHeroBackground(heroIndex);
}, 4000);

// Hero 內按鈕捲動
const scrollToGameBtn = document.querySelector(".scroll-to-game");
const scrollToBackgroundBtn = document.querySelector(".scroll-to-background");

if (scrollToGameBtn) {
  scrollToGameBtn.addEventListener("click", () => {
    const target = document.querySelector("#game");
    target && target.scrollIntoView({ behavior: "smooth" });
  });
}

if (scrollToBackgroundBtn) {
  scrollToBackgroundBtn.addEventListener("click", () => {
    const target = document.querySelector("#background");
    target && target.scrollIntoView({ behavior: "smooth" });
  });
}

// 關卡輪播：兩組卡片，每 3 秒切換一次
const stageTrack = document.querySelector(".stage-track");
const stageDots = document.querySelectorAll(".stage-dot");
let currentStageSlide = 0;
const totalStageSlides = 2;
let stageTimer = null;

function goToStageSlide(index) {
  currentStageSlide = index;
  if (stageTrack) {
    stageTrack.style.transform = `translateX(-${index * 100}%)`;
  }
  stageDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

function startStageAutoSlide() {
  stopStageAutoSlide();
  stageTimer = setInterval(() => {
    const next = (currentStageSlide + 1) % totalStageSlides;
    goToStageSlide(next);
  }, 3000);
}

function stopStageAutoSlide() {
  if (stageTimer) {
    clearInterval(stageTimer);
    stageTimer = null;
  }
}

stageDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const index = Number(dot.dataset.slide || 0);
    goToStageSlide(index);
    startStageAutoSlide();
  });
});

goToStageSlide(0);
startStageAutoSlide();

/* =========================
   角色卡片輪播（3 張一組）
   ========================= */

const charTrack = document.querySelector(".character-track");
const charCards = document.querySelectorAll(".character-card");
const btnPrev = document.querySelector(".char-arrow-left");
const btnNext = document.querySelector(".char-arrow-right");

const VISIBLE_COUNT = 3; // 一次顯示 3 張
let charIndex = 0;
let charTimer = null;

// =========================
//  更新卡片位置（自動計算卡片寬度 + gap）
// =========================
function updateCharacterSlider() {
  if (!charTrack || charCards.length === 0) return;

  // 讀取 CSS 中的 gap
  const trackStyle = window.getComputedStyle(charTrack);
  const gap = parseInt(trackStyle.gap || trackStyle.columnGap || "0", 10);

  // 取得卡片實際寬度（RWD 自適應）
  const cardWidth = charCards[0].offsetWidth;

  // 位移距離 = （卡片寬度 + gap）× index
  const moveX = (cardWidth + gap) * charIndex;

  charTrack.style.transform = `translateX(-${moveX}px)`;
}

// =========================
//  循環切換卡片
// =========================
function goToCharacter(index) {
  const totalCards = charCards.length;
  const maxIndex = totalCards - VISIBLE_COUNT;

  if (index < 0) {
    // 從第一張往左 → 跳到最後一組
    charIndex = maxIndex;
  } else if (index > maxIndex) {
    // 從最後一組往右 → 回到第一組
    charIndex = 0;
  } else {
    charIndex = index;
  }

  updateCharacterSlider();
}

// =========================
//  自動輪播（5 秒）
// =========================
function startCharacterAutoSlide() {
  stopCharacterAutoSlide();
  charTimer = setInterval(() => {
    goToCharacter(charIndex + 1);
  }, 5000);
}

function stopCharacterAutoSlide() {
  if (charTimer) {
    clearInterval(charTimer);
    charTimer = null;
  }
}

// =========================
//  左右按鈕事件
// =========================
if (btnPrev) {
  btnPrev.addEventListener("click", () => {
    goToCharacter(charIndex - 1);
    startCharacterAutoSlide(); // 手動後重新計時
  });
}

if (btnNext) {
  btnNext.addEventListener("click", () => {
    goToCharacter(charIndex + 1);
    startCharacterAutoSlide();
  });
}

// RWD：視窗改變大小時，自動重新對齊
window.addEventListener("resize", updateCharacterSlider);

// 初始化
updateCharacterSlider();
startCharacterAutoSlide();
