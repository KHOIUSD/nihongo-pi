// ==========================================
// 1. DATA & STATE
// ==========================================
const vocabulary = [
    { kanji: "加工", reading: "かこう", meaning: "Gia công", example: "プラスチックを加工する (Gia công nhựa)." },
    { kanji: "合格", reading: "ごうかく", meaning: "Đỗ / Vượt qua", example: "N2試験に合格する (Đỗ kỳ thi N2)." },
    { kanji: "改善", reading: "かいぜん", meaning: "Cải thiện / Cải tiến", example: "作業工程を改善する (Cải thiện quy trình)." },
    { kanji: "準備", reading: "じゅんび", meaning: "Chuẩn bị", example: "会議の準備をする (Chuẩn bị họp)." },
    { kanji: "確認", reading: "かくにん", meaning: "Xác nhận", example: "メールを確認してください (Kiểm tra email)." },
    { kanji: "連絡", reading: "れんらく", meaning: "Liên lạc", example: "後で連絡します (Tôi sẽ liên lạc sau)." },
    { kanji: "報告", reading: "ほうこく", meaning: "Báo cáo", example: "進捗を報告する (Báo cáo tiến độ)." },
    { kanji: "相談", reading: "そうだん", meaning: "Thảo luận", example: "上司に相談する (Thảo luận với cấp trên)." },
    { kanji: "注意", reading: "ちゅうい", meaning: "Chú ý", example: "足元に注意してください (Hãy chú ý dưới chân)." },
    { kanji: "安全", reading: "あんぜん", meaning: "An toàn", example: "安全第一 (An toàn là trên hết)." }
];

let currentIndex = parseInt(localStorage.getItem("nihongo_progress")) || 0;
let isTransitioning = false;

// ==========================================
// 2. SELECTORS
// ==========================================
const cardInner = document.getElementById("card-inner");
const kanjiDisplay = document.getElementById("kanji");
const readingDisplay = document.getElementById("reading");
const meaningDisplay = document.getElementById("meaning");
const exampleDisplay = document.getElementById("example");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const idFront = document.getElementById("card-id-front");
const idBack = document.getElementById("card-id-back");

const menuToggle = document.getElementById("menu-toggle");
const menuClose = document.getElementById("menu-close");
const sideMenu = document.getElementById("side-menu");
const menuOverlay = document.getElementById("menu-overlay");

// ==========================================
// 3. MENU LOGIC
// ==========================================
const openMenu = () => {
    menuOverlay.classList.remove("hidden");
    void menuOverlay.offsetWidth; // Trigger reflow
    sideMenu.classList.add("active");
    menuOverlay.classList.add("active");
    if (navigator.vibrate) navigator.vibrate(10);
};

const closeMenu = () => {
    sideMenu.classList.remove("active");
    menuOverlay.classList.remove("active");
    setTimeout(() => {
        if (!sideMenu.classList.contains("active")) menuOverlay.classList.add("hidden");
    }, 300);
};

menuToggle.addEventListener("click", openMenu);
menuClose.addEventListener("click", closeMenu);
menuOverlay.addEventListener("click", closeMenu);

// ==========================================
// 4. CORE FUNCTIONS (UI & AUDIO)
// ==========================================
function updateUI() {
    const word = vocabulary[currentIndex];
    const displayId = currentIndex + 1;

    // Smooth Fade
    [kanjiDisplay, readingDisplay, meaningDisplay, exampleDisplay].forEach(el => el.style.opacity = "0.3");

    setTimeout(() => {
        idFront.innerText = displayId;
        idBack.innerText = displayId;
        kanjiDisplay.innerText = word.kanji;
        readingDisplay.innerText = word.reading;
        meaningDisplay.innerText = word.meaning;
        exampleDisplay.innerText = word.example;

        [kanjiDisplay, readingDisplay, meaningDisplay, exampleDisplay].forEach(el => el.style.opacity = "1");
        updateProgress();
    }, 100);
}

function updateProgress() {
    const current = currentIndex + 1;
    const percentage = (current / vocabulary.length) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.innerText = `${current}/${vocabulary.length}`;
}

function speakJapanese(text) {
    if (window.currentAudio) window.currentAudio.pause();
    const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&le=jap`;
    const audio = new Audio(audioUrl);
    window.currentAudio = audio;
    audio.play().catch(e => console.warn("Audio blocked"));
}

// ==========================================
// 5. INTERACTION LOGIC
// ==========================================
cardInner.addEventListener("click", function() {
    this.classList.toggle("is-flipped");
    speakJapanese(vocabulary[currentIndex].kanji);
    if (navigator.vibrate) navigator.vibrate(15);
});

document.getElementById("audio-hint").addEventListener("click", (e) => {
    e.stopPropagation();
    speakJapanese(vocabulary[currentIndex].kanji);
    if (navigator.vibrate) navigator.vibrate(10);
});

function handleNavigation(isNext) {
    if (isTransitioning) return;
    isTransitioning = true;

    cardInner.classList.remove("is-flipped");

    setTimeout(() => {
        if (isNext) currentIndex = (currentIndex + 1) % vocabulary.length;
        else currentIndex = (currentIndex - 1 + vocabulary.length) % vocabulary.length;

        localStorage.setItem("nihongo_progress", currentIndex);
        updateUI();
        isTransitioning = false;
    }, 300);
}

document.getElementById("next-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    handleNavigation(true);
});

document.getElementById("prev-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    handleNavigation(false);
});

// ==========================================
// 6. PI SDK INITIALIZATION
// ==========================================
const Pi = window.Pi;
Pi.init({ version: "2.0", sandbox: true });

async function unlockPremiumContent() {
    try {
        const payment = await Pi.createPayment({
            amount: 3.14,
            memo: "Mở khóa Premium N2",
            metadata: { packageId: "n2_premium" }
        }, {
            onReadyForServerApproval: (id) => console.log("Approved", id),
            onReadyForServerCompletion: (id, tx) => alert("Thành công!"),
            onCancel: (id) => console.log("Canceled"),
            onError: (err) => console.error(err)
        });
    } catch (err) { console.error(err); }
}

// Boot
updateUI();
