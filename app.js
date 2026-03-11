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
 * Audio engine configuration
 */
// Initialize a subtle UI sound effect (Sfx) for better tactile feedback
const flipSfx = new Audio('https://www.soundjay.com/buttons/sounds/button-20.mp3'); 
flipSfx.volume = 0.3;

/**
 * Handles Japanese Text-to-Speech (TTS) with layered audio effects.
 * Includes a subtle click sound before the voice for a premium feel.
 * @param {string} text - The Japanese text to be pronounced.
 */
function speakJapanese(text) {
    // 1. Stop previous audio playback to prevent overlapping/echo
    if (window.currentAudio) {
        window.currentAudio.pause();
        window.currentAudio.currentTime = 0;
    }

    // 2. Play a brief UI feedback sound (Click effect)
    flipSfx.play().catch(() => {
        /* Silently handle cases where audio is blocked by browser policy */
    });

    // 3. Configure the Japanese TTS voice using a reliable CDN
    const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&le=jap`;
    const audio = new Audio(audioUrl);
    
    // Global reference to manage state across multiple interactions
    window.currentAudio = audio;
    
    // Set volume to 0.9 to prevent clipping/distortion on mobile speakers
    audio.volume = 0.9; 

    // 4. Slight 100ms delay to separate the click sound from the speech
    setTimeout(() => {
        audio.play().catch(error => {
            console.warn("Audio playback was prevented by browser security policy.", error);
        });
    }, 100);
}

// ==========================================
// 4. INTERACTIVE LOGIC & HAPTIC FEEDBACK
// ==========================================

/**
 * Handles the card flip interaction.
 * Implements "Active Recall" by only playing audio when the answer is revealed.
 */
cardInner.addEventListener('click', function() {
    // 1. Toggle the visual flip animation
    this.classList.toggle('is-flipped');

    // 2. Logic: Only play pronunciation when revealing the back side (The Answer)
    if (this.classList.contains('is-flipped')) {
        const currentKanji = vocabulary[currentIndex].kanji;
        
        // Play Japanese pronunciation as a confirmation of the user's guess
        speakJapanese(currentKanji); 
    } else {
        // If flipping back to the front (The Question) - play a subtle UI click
        flipSfx.play().catch(() => {
            /* Handle potential browser audio restrictions */
        });
    }

    // 3. Provide subtle Haptic Feedback for a tactile experience
    if (navigator.vibrate) {
        navigator.vibrate(15); 
    }
});

/**
 * Navigation logic with Debounce & Haptic
 */
let isTransitioning = false; // Prevents overlapping animations from rapid clicks

/**
 * Handles card navigation (Next/Prev) with haptic feedback and smooth transitions.
 * @param {boolean} isNext - Direction of navigation
 */
function handleNavigation(isNext) {
    if (isTransitioning) return; 
    isTransitioning = true;

    // 1. Trigger Haptic Feedback (Stronger for Next, lighter for Prev)
    if (navigator.vibrate) {
        navigator.vibrate(isNext ? [30, 10, 30] : 20); 
    }

    // 2. Reset card flip state before switching content
    cardInner.classList.remove('is-flipped');

    // 3. Wait for flip-back animation (300ms) for a premium feel
    setTimeout(() => {
        if (isNext) {
            currentIndex = (currentIndex + 1) % vocabulary.length;
        } else {
            currentIndex = (currentIndex - 1 + vocabulary.length) % vocabulary.length;
        }

        // Persist progress to LocalStorage
        localStorage.setItem('nihongo_progress', currentIndex);
        
        // Update User Interface
        updateUI();
        flipSfx.play().catch(() => {});
        
        // Unlock navigation after UI update is complete
        setTimeout(() => { isTransitioning = false; }, 100);
    }, 300);
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
// 5. AUDIO HINT LOGIC (Listen without Flipping)
// ==========================================

/**
 * Allows users to hear the pronunciation as a hint while staying on the front side.
 * This supports different learning styles (Auditory Hinting).
 */
const audioHintBtn = document.getElementById('audio-hint');

audioHintBtn.addEventListener('click', function(event) {
    // Prevent the card from flipping when clicking the speaker icon
    event.stopPropagation();
    // 2. Prevent default behavior
    event.preventDefault();

    const currentWord = vocabulary[currentIndex].kanji;

    // Provide the audio feedback while keeping the answer hidden
    speakJapanese(currentWord);

    // Haptic feedback for hint activation
    if (navigator.vibrate) navigator.vibrate(10);}, { passive: false 
});

// ==========================================
// 6. PI WEB3 & PAYMENT INTEGRATION
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
