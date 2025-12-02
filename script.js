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