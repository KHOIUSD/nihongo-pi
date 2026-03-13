// ==========================================
// 1. DỮ LIỆU TỪ VỰNG
// ==========================================
const vocabulary = [
    { kanji: "加工", reading: "かこう", meaning: "Gia công", example: "プラスチックを加工する (Gia công nhựa)." },
    { kanji: "合格", reading: "ごうかく", meaning: "Đỗ / Vượt qua", example: "N2試験に合格する (Đỗ kỳ thi N2)." },
    { kanji: "改善", reading: "かいぜん", meaning: "Cải thiện / Cải tiến", example: "作業工程を改善する." },
    { kanji: "準備", reading: "じゅんび", meaning: "Chuẩn bị", example: "会議の準備をする (Chuẩn bị họp)." },
    { kanji: "確認", reading: "かくにん", meaning: "Xác nhận", example: "メールを確認してください." },
    { kanji: "連絡", reading: "れんらく", meaning: "Liên lạc", example: "後で連絡します." },
    { kanji: "報告", reading: "ほうこく", meaning: "Báo cáo", example: "進捗を報告する." },
    { kanji: "相談", reading: "そうだん", meaning: "Thảo luận", example: "上司に相談する." },
    { kanji: "注意", reading: "ちゅうい", meaning: "Chú ý", example: "足元に注意してください." },
    { kanji: "安全", reading: "あんぜん", meaning: "An toàn", example: "安全第一 (An toàn là trên hết)." }
];

let currentIndex = parseInt(localStorage.getItem("nihongo_progress")) || 0;

// ==========================================
// 2. CHỌN PHẦN TỬ DOM
// ==========================================
const menuToggle = document.getElementById("menu-toggle");
const menuClose = document.getElementById("menu-close");
const sideMenu = document.getElementById("side-menu");
const menuOverlay = document.getElementById("menu-overlay");
const cardInner = document.getElementById("card-inner");
const kanjiDisplay = document.getElementById("kanji");
const readingDisplay = document.getElementById("reading");
const meaningDisplay = document.getElementById("meaning");
const exampleDisplay = document.getElementById("example");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");

// ==========================================
// 3. XỬ LÝ SIDEBAR MENU
// ==========================================
const openMenu = () => {
    menuOverlay.classList.remove("hidden");
    void menuOverlay.offsetWidth;
    sideMenu.classList.add("active");
    menuOverlay.classList.add("active");
    if (navigator.vibrate) navigator.vibrate(10);
};

const closeMenu = () => {
    sideMenu.classList.remove("active");
    menuOverlay.classList.remove("active");
    setTimeout(() => { if (!sideMenu.classList.contains("active")) menuOverlay.classList.add("hidden"); }, 300);
};

menuToggle.addEventListener("click", openMenu);
menuClose.addEventListener("click", closeMenu);
menuOverlay.addEventListener("click", closeMenu);

// ==========================================
// 4. XỬ LÝ FLASHCARD & ÂM THANH
// ==========================================
function updateUI() {
    const word = vocabulary[currentIndex];
    kanjiDisplay.innerText = word.kanji;
    readingDisplay.innerText = word.reading;
    meaningDisplay.innerText = word.meaning;
    exampleDisplay.innerText = word.example;
    
    document.getElementById("card-id-front").innerText = currentIndex + 1;
    document.getElementById("card-id-back").innerText = currentIndex + 1;
    
    const progress = ((currentIndex + 1) / vocabulary.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.innerText = `${currentIndex + 1}/${vocabulary.length}`;
}

function speakJapanese(text) {
    const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&le=jap`;
    const audio = new Audio(audioUrl);
    audio.play().catch(() => {});
}

cardInner.addEventListener("click", function() {
    this.classList.toggle("is-flipped");
    if (this.classList.contains("is-flipped")) {
        speakJapanese(vocabulary[currentIndex].kanji);
    }
    if (navigator.vibrate) navigator.vibrate(15);
});

document.getElementById("audio-hint").addEventListener("click", (e) => {
    e.stopPropagation();
    speakJapanese(vocabulary[currentIndex].kanji);
});

// Điều hướng Next/Prev
function handleNavigation(isNext) {
    cardInner.classList.remove("is-flipped");
    setTimeout(() => {
        if (isNext) currentIndex = (currentIndex + 1) % vocabulary.length;
        else currentIndex = (currentIndex - 1 + vocabulary.length) % vocabulary.length;
        localStorage.setItem("nihongo_progress", currentIndex);
        updateUI();
    }, 300);
}

document.getElementById("next-btn").addEventListener("click", () => handleNavigation(true));
document.getElementById("prev-btn").addEventListener("click", () => handleNavigation(false));

// ==========================================
// 5. PI NETWORK SDK
// ==========================================
if (window.Pi) {
    window.Pi.init({ version: "2.0", sandbox: true });
}

async function unlockPremiumContent() {
    try {
        const paymentData = { amount: 3.14, memo: "Mở khóa Premium", metadata: { id: "001" } };
        const callbacks = {
            onReadyForServerApproval: (pId) => console.log("Approved", pId),
            onReadyForServerCompletion: (pId, tx) => alert("Thành công!"),
            onCancel: (pId) => console.log("Hủy"),
            onError: (err) => console.error(err)
        };
        await Pi.createPayment(paymentData, callbacks);
    } catch (err) { console.error(err); }
}

// Khởi chạy
updateUI();
