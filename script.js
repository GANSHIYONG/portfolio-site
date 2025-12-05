// 首頁按鈕：重新整理頁面
const homeLink = document.querySelector(".home-link");
if (homeLink) {
  homeLink.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.reload();
  });
}

// Hero 背景輪播：改成向左滑動切換
const heroSlider = document.querySelector(".hero-slider");
const heroSlides = document.querySelectorAll(".hero-slide");
let heroIndex = 0;

function slideHero() {
  if (!heroSlider || heroSlides.length === 0) return;
  heroIndex = (heroIndex + 1) % heroSlides.length;
  heroSlider.style.transform = `translateX(-${heroIndex * 100}%)`;
}

// 每 4 秒滑動一次
setInterval(slideHero, 4000);

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

/* =========================
   關卡輪播：一次顯示 1 張
   左右按鈕 + 5 秒自動切換
   ========================= */

const stageTrack = document.querySelector(".stage-track");
const stageCards = document.querySelectorAll(".stage-card");
const stageDots = document.querySelectorAll(".stage-dot");
const stagePrev = document.querySelector(".stage-arrow-left");
const stageNext = document.querySelector(".stage-arrow-right");

let currentStageIndex = 0;
let stageTimer = null;

// 更新位移＆藍點
function updateStageSlider() {
  if (!stageTrack || stageCards.length === 0) return;

  const offset = currentStageIndex * 100;
  stageTrack.style.transform = `translateX(-${offset}%)`;

  stageDots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === currentStageIndex);
  });
}

// 切換到指定關卡（含首尾循環）
function goToStage(index) {
  const total = stageCards.length;
  if (total === 0) return;

  if (index < 0) {
    currentStageIndex = total - 1; // 從第一關往左 → 跳到最後一關
  } else if (index >= total) {
    currentStageIndex = 0; // 從最後一關往右 → 回到第一關
  } else {
    currentStageIndex = index;
  }

  updateStageSlider();
}

// 自動輪播（5 秒）
function startStageAutoSlide() {
  stopStageAutoSlide();
  stageTimer = setInterval(() => {
    goToStage(currentStageIndex + 1);
  }, 5000);
}

function stopStageAutoSlide() {
  if (stageTimer) {
    clearInterval(stageTimer);
    stageTimer = null;
  }
}

// 點藍點切換
stageDots.forEach((dot, idx) => {
  dot.addEventListener("click", () => {
    goToStage(idx);
    startStageAutoSlide(); // 手動後重新計時
  });
});

// 左右按鈕
if (stagePrev) {
  stagePrev.addEventListener("click", () => {
    // 左按鈕 → 卡片向右移動，看到上一關
    goToStage(currentStageIndex - 1);
    startStageAutoSlide();
  });
}

if (stageNext) {
  stageNext.addEventListener("click", () => {
    // 右按鈕 → 卡片向左移動，看到下一關
    goToStage(currentStageIndex + 1);
    startStageAutoSlide();
  });
}

// 視窗尺寸改變時，重新套用 transform
window.addEventListener("resize", updateStageSlider);

// 初始化
goToStage(0);
startStageAutoSlide();

/* =========================
   角色卡片輪播（3 張一組，原本的保留）
   ========================= */

const charTrack = document.querySelector(".character-track");
const charCards = document.querySelectorAll(".character-card");
const btnPrev = document.querySelector(".char-arrow-left");
const btnNext = document.querySelector(".char-arrow-right");

const VISIBLE_COUNT = 3; // 一次顯示 3 張
let charIndex = 0;
let charTimer = null;

// 更新角色卡片位置（自動計算寬度 + gap）
function updateCharacterSlider() {
  if (!charTrack || charCards.length === 0) return;

  const trackStyle = window.getComputedStyle(charTrack);
  const gap = parseInt(trackStyle.gap || trackStyle.columnGap || "0", 10);
  const cardWidth = charCards[0].offsetWidth;
  const moveX = (cardWidth + gap) * charIndex;

  charTrack.style.transform = `translateX(-${moveX}px)`;
}

// 切換到指定角色組
function goToCharacter(index) {
  const totalCards = charCards.length;
  const maxIndex = totalCards - VISIBLE_COUNT;

  if (index < 0) {
    charIndex = maxIndex;
  } else if (index > maxIndex) {
    charIndex = 0;
  } else {
    charIndex = index;
  }

  updateCharacterSlider();
}

// 自動輪播（5 秒）
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

// 左右按鈕事件
if (btnPrev) {
  btnPrev.addEventListener("click", () => {
    goToCharacter(charIndex - 1);
    startCharacterAutoSlide();
  });
}

if (btnNext) {
  btnNext.addEventListener("click", () => {
    goToCharacter(charIndex + 1);
    startCharacterAutoSlide();
  });
}

// RWD：視窗改變大小時，自動重新對齊
window.addEventListener("resize", () => {
  updateCharacterSlider();
  updateStageSlider();
});

// 初始化角色輪播
updateCharacterSlider();
startCharacterAutoSlide();
