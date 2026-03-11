// ==========================================
// 1. VOCABULARY DATA CONFIGURATION
// ==========================================
const vocabulary = [
    { kanji: "加工", reading: "かこう", meaning: "Gia công", example: "プラスチックを加工する (Gia công nhựa)." },
    { kanji: "合格", reading: "ごうかく", meaning: "Đỗ / Vượt qua", example: "N2試験に合格する (Đỗ kỳ thi N2)." },
    { kanji: "改善", reading: "かいぜん", meaning: "Cải thiện / Cải tiến (Kaizen)", example: "作業工程を改善する (Cải thiện quy trình làm việc)." },
    { kanji: "準備", reading: "じゅんび", meaning: "Chuẩn bị", example: "会議の準備をする (Chuẩn bị cho cuộc họp)." },
    { kanji: "確認", reading: "かくにん", meaning: "Xác nhận", example: "メールを確認してください (Hãy kiểm tra email)." },
    { kanji: "連絡", reading: "れんらく", meaning: "Liên lạc", example: "後で連絡します (Tôi sẽ liên lạc sau)." },
    { kanji: "報告", reading: "ほうこく", meaning: "Báo cáo", example: "進捗を報告する (Báo cáo tiến độ)." },
    { kanji: "相談", reading: "そうだん", meaning: "Thảo luận/Bàn bạc", example: "上司に相談する (Thảo luận với cấp trên)." },
    { kanji: "注意", reading: "ちゅうい", meaning: "Chú ý/Cẩn thận", example: "足元に注意してください (Hãy chú ý dưới chân)." },
    { kanji: "安全", reading: "あんぜん", meaning: "An toàn", example: " 安全第一 (An toàn là trên hết)." }
];
// Load saved progress or start from 0
let currentIndex = parseInt(localStorage.getItem('nihongo_progress')) || 0;

// ==========================================
// 2. DOM ELEMENTS SELECTION
// ==========================================
const cardInner = document.getElementById('card-inner');
const kanjiDisplay = document.getElementById('kanji');
const readingDisplay = document.getElementById('reading');
const meaningDisplay = document.getElementById('meaning');
const exampleDisplay = document.getElementById('example');
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const idFront = document.getElementById('card-id-front');
const idBack = document.getElementById('card-id-back');

// ==========================================
// 3. AUXILIARY FUNCTIONS PROGRESS
// ==========================================
function updateUI() {
    const word = vocabulary[currentIndex];
    const displayId = `#${currentIndex + 1}`;
    const elements = [kanjiDisplay, readingDisplay, meaningDisplay, exampleDisplay];
    elements.forEach(el => { if(el) el.style.opacity = '0.3'; });

    setTimeout(() => {
        idFront.innerText = displayId;
        idBack.innerText = displayId;
        kanjiDisplay.innerText = word.kanji;
        readingDisplay.innerText = word.reading;
        meaningDisplay.innerText = word.meaning;
        if (exampleDisplay) exampleDisplay.innerText = word.example;
        
        elements.forEach(el => { if(el) el.style.opacity = '1'; });
        updateProgress();
    }, 50);
}
/**
 * Updates the learning progress UI.
 */
function updateProgress() {
    const total = vocabulary.length;
    const current = currentIndex + 1;
    const percentage = (current / total) * 100;
    
    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressText) progressText.innerText = `${current}/${total}`;
}
/**
 * Audio Engine
 * High-compatibility audio logic used by Pi Network Apps
 */
function speakJapanese(text) {
    // We use a reliable TTS service that returns a direct audio stream
    const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&le=jap`;
    
    const audio = new Audio(audioUrl);
    audio.volume = 1.0;

    // Play the sound
    audio.play().catch(error => {
        console.warn("Audio playback was prevented. Ensure user interaction first.", error);
    });
}

// ==========================================
// 4. INTERACTIVE LOGIC & HAPTIC FEEDBACK
// ==========================================

/**
 * Handle card flip animation and trigger haptic + audio feedback.
 */
cardInner.addEventListener('click', function() {
    // 1. Play Audio immediately on user touch
    const currentKanji = vocabulary[currentIndex].kanji;
    speakJapanese(currentKanji);

    // 2. Trigger Haptic
    if (navigator.vibrate) {
        navigator.vibrate(15); 
    }

    // 3. Toggle Card Flip
    this.classList.toggle('is-flipped');
});

/**
 * Reset card state, trigger vibration, and load the next vocabulary item.
 */
    // 1. Trigger a stronger vibration (30ms) for transition confirmation
    function handleNavigation(isNext) {
    if (navigator.vibrate) navigator.vibrate(isNext ? 25 : 15); 
    // 2. Flip the card back to the front side first
    cardInner.classList.remove('is-flipped');

    // 3. Wait for the flip-back animation (200ms) before updating content
    setTimeout(() => {
        if (isNext) {
            currentIndex = (currentIndex + 1) % vocabulary.length;
        } else {
            currentIndex = (currentIndex - 1 + vocabulary.length) % vocabulary.length;
        }
        // Save current index to localStorage
        localStorage.setItem('nihongo_progress', currentIndex);
        updateUI();
        console.log(`Current Card Index: ${currentIndex}`);
    }, 200); 
}
nextButton.addEventListener('click', (event) => {
    event.stopPropagation();
    handleNavigation(true); // true = Next
});
prevButton.addEventListener('click', (event) => {
    event.stopPropagation();
    handleNavigation(false); // false = Prev
});

// ==========================================
// 5. PI WEB3 & PAYMENT INTEGRATION
// ==========================================

/**
 * Initiate Pi Payment flow for Premium content access.
 */
async function unlockPremiumContent() {
    try {
        const paymentData = {
            amount: 3.14,
            memo: "Mở khóa kho từ vựng tiếng Nhật Premium",
            metadata: { packageId: "premium_n2_vocab_001" },
        };

        const callbacks = {
            onReadyForServerApproval: (paymentId) => console.log("Payment approved. ID:", paymentId),
            onReadyForServerCompletion: (paymentId, txid) => console.log("Payment completed. TXID:", txid),
            onCancel: (paymentId) => console.log("Người dùng đã hủy thanh toán."),
            onError: (error) => console.error("Lỗi thanh toán:", error),
        };

        const payment = await Pi.createPayment(paymentData, callbacks);
        
        if (payment) {
            alert("Thành công! Gói Premium đã được mở khóa.");
            enablePremiumFeatures();
        }
    } catch (err) {
        console.error("Không thể khởi tạo thanh toán:", err);
    }
}

/**
 * Update UI elements to reflect Premium status.
 */
function enablePremiumFeatures() {
    const badge = document.getElementById('premium-badge');
    const premiumSection = document.getElementById('premium-section');

    if (badge) badge.classList.remove('hidden');
    if (premiumSection) premiumSection.style.display = 'none';
    
    console.log("Tính năng Premium đã được kích hoạt.");
}

updateUI();
