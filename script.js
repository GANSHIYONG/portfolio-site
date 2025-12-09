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

/* =====================================
   自訂滑動速度版本（可調整 duration）
   ===================================== */

function smoothScrollTo(targetY, duration = 800) {  
  const startY = window.pageYOffset;
  const distance = targetY - startY;
  const startTime = performance.now();

  function animation(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // ease-out 動畫
    const easing = 1 - Math.pow(1 - progress, 3);

    window.scrollTo(0, startY + distance * easing);

    if (progress < 1) requestAnimationFrame(animation);
  }
  requestAnimationFrame(animation);
}

const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (!href.startsWith("#")) return;

    e.preventDefault();

    const header = document.querySelector(".site-header");
    const headerHeight = header ? header.offsetHeight : 0;

    if (href === "#home") {
      smoothScrollTo(0, 800); 
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      const targetTop =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        headerHeight;

      smoothScrollTo(targetTop, 800);
    }
  });
});

// =======================
// 勞工知識資料（可自行增加）
// =======================
const knowledgeData = {
  1: [
    { title: "未簽勞動契約的風險", content: "雇主依法應提供書面契約，未簽約容易造成權益不明確，發生爭議也不易舉證。" },
    { title: "工讀生也要投保勞健保", content: "即使是打工，雇主也需依法替員工投保勞保與健保，避免職災時無法獲得補償。" },
    { title: "國定假日薪資計算", content: "國定假日出勤應加倍給薪，若未給付即屬違法，可向勞工局申訴。" }
  ],
  2: [
    { title: "職災通報義務", content: "員工受傷時，雇主必須通報並協助申請職災補償，不能推諉或延遲。" },
    { title: "未成年工不得從事危險工作", content: "雇主必須為未滿18歲的勞工提供安全環境，不得指派高危險性工作。" },
    { title: "職安設備的重要性", content: "雇主需提供必要的安全防護，如手套、防滑地板等，以保障勞工安全。" }
  ],
  3: [
    { title: "非法仲介詐騙", content: "以高薪誘騙、收取押金或要求事前付費的職缺，多數為非法詐騙。" },
    { title: "預扣工資是違法行為", content: "雇主不得隨意預扣薪資，除非符合法規，例如遲到或損害賠償等情況需符合法律要件。" },
    { title: "加班必須給付費用", content: "雇主要求加班時需支付加班費，否則屬違法。" }
  ],
  4: [
    { title: "就業歧視的類型", content: "包含容貌、年齡、性別、婚姻、身心障礙、工會身分等差別待遇。" },
    { title: "非法要求制服尺寸", content: "以體態或外型作為錄取標準屬違法歧視，可提出檢舉。" },
    { title: "面試過程的權益", content: "雇主不得詢問與工作無關的隱私問題，如懷孕、戀愛或家庭計畫等。" }
  ],
  5: [
    { title: "申訴流程說明", content: "包含受理、審查、調查、會議、裁罰等步驟，目的是保障勞工權益。" },
    { title: "勞工局的角色", content: "負責調查職場糾紛，提供協助與法律判定。" },
    { title: "證據的重要性", content: "申訴時需保留對話紀錄、影片、照片或證人證言等證據。" }
  ],
  6: [
    { title: "海外詐騙打工警訊", content: "高薪不合理、要求先匯款、未提供公司資料等都是詐騙警訊。" },
    { title: "避免落入陷阱的方法", content: "確認公司資料、保持聯絡、不要提前匯款是保護自己的基本方式。" },
    { title: "與家人保持聯繫", content: "出國工作必須讓家人知道地點與行程，避免失聯。" }
  ]
};

function renderKnowledgeCards(stage) {
  const container = document.getElementById("knowledgeCards");
  container.innerHTML = "";

  const cards = knowledgeData[stage] || [];

  cards.forEach((item) => {
    const card = document.createElement("div");
    card.className = "knowledge-card";

    card.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.content}</p>
    `;

    container.appendChild(card);
  });
}

const knowledgeSelect = document.getElementById("knowledgeSelect");

if (knowledgeSelect) {
  knowledgeSelect.addEventListener("change", () => {
    renderKnowledgeCards(knowledgeSelect.value);
  });

  // 一開始顯示第一關
  renderKnowledgeCards(1);
}


