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
    { title: "未成年工讀生工時限制", content: "青少年（未滿 18 歲）每日工作不得超過 8 小時，且禁止夜間工作（22:00～06:00），雇主不可安排危險性或勞力過度負荷的工作。" },
    { title: "強制書面勞動契約", content: "雇主必須提供「書面契約」載明薪資、工時、休假、工作內容。未簽契約可能造成青少年權益不清楚，發生爭議也不易舉證。" },
    { title: "勞健保投保義務", content: "只要受僱工作（非短期零星），雇主就必須替工讀生投保勞保、健保及勞退，即使是高中生或剛成年的大學生也不能例外。" },
    { title: "蒐集證據與保留紀錄", content: "遇到欠薪、違法調班、強迫加班等情況時，需保留 LINE 對話、工時紀錄、班表截圖等，作為日後提出申訴的證明。" },
    { title: "優先向主管反映並尋求協調", content: "若發現薪資計算有誤、未給休息時間或工時異常，應先向店長或主管反映；若未改善，則可採取正式申訴程序。" },
    { title: "向勞工諮詢單位求助", content: "包括各縣市勞工局、1955 勞工申訴專線、勞動部網站。這些單位能提供免費諮詢，必要時協助調查與裁罰雇主。" },
    { title: "未投保或拒絕投保", content: "部分雇主會說「工讀生不用勞保、健保」或「保了會扣薪水」，但這完全違法。沒有投保會導致職災時無法獲得補償。" },
    { title: "違法延長工時、未給休息", content: "若未成年工讀每日超過 8 小時，或未提供每 4 小時至少 30 分鐘休息，屬違反勞基法。休息時間不可要求繼續工作。" }
  ],
  2: [
    { title: "未成年工不得從事危險性工作", content: "法律禁止未滿 18 歲的工讀生從事危險性作業，如重機具、尖銳刀具、高溫油鍋、化學品等，雇主若安排即屬違法。" },
    { title: "雇主必須提供安全教育與訓練", content: "青少年工作者須接受完整的安全講解，例如機器操作、環境風險、緊急處理流程等。未提供訓練造成受傷，雇主須負責。" },
    { title: "勞工職業安全衛生法的基本保障", content: "職安法要求工作場所必須安全、設備維護正常，並避免讓勞工暴露在危險環境。青少年更被列為「特殊保護對象」。" },
    { title: "職災認定與就醫流程", content: "只要在工作中或因工作受傷，都屬職業災害。應立即就醫、請主管記錄事件、保留醫療證明與受傷證據。" },
    { title: "職災補償申請權益", content: "受傷的工讀生可申請補償，包括醫療費、薪資補償（傷病給付）、失能補償等。雇主不得阻擋、拖延或要求自行負擔。" },
    { title: "職災40條：雇主不得要求員工自行承擔", content: "若主管說「不小心就自己付」或「不要報職災」，都是違法行為。勞保職災給付屬於法定權益，不能被要求放棄。" },
    { title: "風險評估與改善義務", content: "雇主需定期檢查設備、地面防滑、機器安全裝置、照明、通道阻塞等，並修繕危險環境。若未改善而造成事故，需負法律責任。" },
    { title: "提供必要的安全設備", content: "包含手套、防割器具、防滑鞋、防護面罩等。若雇主未提供，就要求員工「自己想辦法」，屬不符合法規。" },
    { title: "建立事故通報與補償流程", content: "雇主需在工讀生受傷後協助填寫職災表單、協助就醫、通知勞保單位與主管機關。故意隱瞞或要求不通報屬違法。" }
  ],
  3: [
    { title: "不合理高薪誘騙", content: "短時數卻極高薪、無需經驗卻待遇超優，是詐騙最常見的標記。若內容敘述模糊、未標明公司資訊，更需警戒。" },
    { title: "要求提前支付費用", content: "任何要求先匯押金、保證金、制服費、手續費的職缺都極可能是詐騙。合法雇主不會要求員工在工作前先付款。" },
    { title: "公司資訊不透明", content: "找不到公司地址、網站、負責人資料，或面試地點與公司地點不一致，都屬重大警訊。若要求於僻靜處面試更須避免。" },
    {
      title: "「三要七不」防詐騙口訣",
      content: `三要
要查證雇主資訊：上網查評價、Google 地址、查看是否為合法登記公司。
要保持與家人朋友聯繫：讓可信任的人知道面試地點、時間、內容。
要保留求職過程證據：如工作說明、對話截圖、薪資條件等。`
    },
    {
      title: "「三要七不」防詐騙口訣",
      content: `七不
不繳費、不轉帳：不支付任何名義的費用。
不購買公司指定商品或裝備：制服、教材等若強制購買多為詐騙。
不交出個人證件：身分證、提款卡、印章等不可交付他人保存。
不夜間單獨面試：尤其是青少年，應避免深夜陌生地點。
不簽署不明文件：合約內容若模糊或沒時間閱讀，應拒絕簽署。
不提供銀行帳戶資料：若要求提供帳戶供款項轉手，可能涉及詐騙洗錢。
不接受異常高額獎金的職務：常是誘使上當的陷阱。`
    },
    { title: "未依法投保勞健保", content: "工讀生即使是未成年，也要依法投保勞保與健保。若雇主拒保或要求自行負擔，是違法行為。" },
    { title: "工時過長、未給休息", content: "工作超過法定工時、未給法定休息、要求長時間站立不休息，皆屬違法，也可能危害健康。" },
    { title: "不給薪資或計算不實", content: "如延遲發薪、扣薪、未給加班費、國定假日不加倍給薪等，都是常見的勞動權益侵害行為。" }
  ],
  4: [
    { title: "不當詢問個人隱私", content: "面試時詢問婚姻、懷孕、交往狀況、生育計畫、家庭背景等，與工作無關，都屬違法歧視。" },
    { title: "外貌或身材要求與工作無關", content: "以容貌、身高、體重、膚色、刺青與否作為錄取標準，若非必要（例如模特兒），即屬容貌歧視。" },
    { title: "年齡限制（不合理條件）", content: "標註「限 18～25 歲」、「不錄用 40 歲以上」等皆屬違法。除非工作性質有確切年齡需求（少見），否則一律為歧視。" },
    { title: "性別角色刻板印象", content: "例如「女性不適合做主管」、「男性不適合做櫃檯」、「女生比較會服務人」等，均屬性別歧視。" },
    { title: "工會身分遭拒絕", content: "雇主不得因求職者或員工的工會身分（加入、未加入、參與活動等）而拒錄、拒升遷或惡意調職。" },
    { title: "無正當理由區隔待遇", content: "包含給不同薪資、指定不同休假制度、拒絕升遷等，只因員工有某些身分特質，都屬不當差別待遇。" },
    {
      title: "年齡歧視",
      content: `主題說明：
以年齡多寡作為錄取與否或排班安排依據。`
    },
    {
      title: "性別歧視",
      content: `主題說明：
因求職者或員工的性別影響錄取、升遷或薪資。`
    },
    {
      title: "容貌與身材歧視",
      content: `主題說明：
以外貌、膚色、身高、刺青、身材等作為錄取或工作分配的標準。`
    },
    {
      title: "種族或國籍歧視",
      content: `主題說明：
因學生的種族、膚色、語言、國籍而拒錄或給予較差待遇。`
    },
    {
      title: "宗教歧視",
      content: `主題說明：
因宗教信仰而排班不當、強迫佩戴物品、禁止穿著宗教服飾。`
    },
    {
      title: "工會身分歧視",
      content: `主題說明：
因加入工會、參與活動而遭排擠、威脅或減班。`
    }
  ],
  5: [
    { title: "蒐集證據與案件說明", content: "申訴人需先整理相關資訊，例如對話紀錄、工作證明、拒錄原因、歧視言論、職場處遇差別等，作為後續調查依據。" },
    {
      title: "流程步驟（六大階段）",
      content: `以下六個主題對應臺北市政府勞動局處理歧視案件的實際流程脈絡。
收件 → 審查 → 事實調查 → 召開評議委員會 → 做成審定書 → 行政處分。`
    },
    {
      title: "諮詢服務與後續追蹤",
      content: `勞動局會提供：
法律諮詢，工作權保障建議，持續追蹤雇主改善狀況，申訴人亦可在必要時提出行政救濟或相關法律程序。`
    },
    { title: "歧視申訴不需害怕", content: "勞動局提供免費且保密的協助，青少年也能單獨申訴。" },
    { title: "整個流程是有系統、分階段的", content: "從收件 → 審查 → 調查 → 評議 → 判定 → 行政處分，每一階段都有明確目標。" },
    { title: "證據越完整，越能保障自身權益", content: "保留訊息、錄音、制度文件、排班、薪資紀錄等，都能大幅提升案件清楚度。" }
  ],
  6: [
    {
      title: "不合理高薪與模糊職缺內容",
      content: `若職缺敘述含糊、工作內容未載明，卻開出異常高薪，通常是詐騙或非法仲介常用手法。
警訊：「日薪 4000」、「不限學歷，工作超簡單」等。`
    },
    {
      title: "先付款、先購買的陷阱",
      content: `要求「押金、教材費、設備費、制服費」等，都是詐騙常見前兆。
警訊：合法工作不會要求求職者先匯款或購買物品。`
    },
    {
      title: "要求提供個人證件或銀行帳戶",
      content: `詐騙常以「薪水入帳」、「資料驗證」為名要求身分證、提款卡、銀行帳號，後續可能涉及洗錢。
警訊：雇主無權代保管個人證件。`
    },
    {
      title: "不正常的面試流程",
      content: `例如深夜通知、地點偏僻、臨時換地點、無公司名稱或招牌等。
警訊：環境過於隱密、受訪者無明確身份。`
    },
    {
      title: "查證來源與公司合法性",
      content: `透過 Google 評價、公司登記資料、官方網站、電話、社群等進行交叉查證。
防護措施：一定要確認「公司是否存在」。`
    },
    {
      title: "保留所有求職過程紀錄",
      content: `包含工作說明、對話截圖、薪資談判內容、對方身分資訊等。
防護措施：必要時做為警示或申訴依據。`
    },
    {
      title: "永遠不要先匯款與購買商品",
      content: `詐騙常以「錄取前必須購買設備」為由進行誘導。
防護措施：拒絕任何形式的事前支付。`
    },
    {
      title: "面試需告知親友並保持聯繫",
      content: `面試地點、時間、公司名稱應讓家人知道。
防護措施：避免落入誘導至偏僻地點的陷阱。`
    },
    {
      title: "主動查證職缺資訊的三步驟",
      content: `步驟 1：查公司資訊（地址、統編、網站、評價）
步驟 2：查工作是否合法（薪資是否合規、是否屬非法仲介）
步驟 3：查對方身分是否一致（面試者是否為公司人員）`
    },
    {
      title: "任何理由的「先付款」都必須拒絕",
      content: `詐騙會包裝為：押金、保證金、機器費、教材費、訓練費。
原則：「只要要你付錢，那就是有問題。」`
    },
    {
      title: "識別可疑訊號，學會先停下來",
      content: `例如工作條件突然更動、對方催促決定、不願說明薪資結構等。
做法：遇到不明確資訊，應停止、查證後再決定。`
    }
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


