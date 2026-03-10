// ==========================================
// 1. VOCABULARY DATA CONFIGURATION
// ==========================================
const vocabulary = [
    { kanji: "加工", reading: "かこう", meaning: "Gia công", example: "プラスチックを加工する (Gia công nhựa)." },
    { kanji: "合格", reading: "ごうかく", meaning: "Đỗ / Vượt qua", example: "N2試験に合格する (Đỗ kỳ thi N2)." },
    { kanji: "改善", reading: "かいぜん", meaning: "Cải thiện (Kaizen)", example: "作業工程を改善する (Cải thiện quy trình làm việc)." }
];
let currentIndex = 0;

// ==========================================
// 2. DOM ELEMENTS SELECTION
// ==========================================
const cardInner = document.getElementById('card-inner');
const kanjiDisplay = document.getElementById('kanji');
const readingDisplay = document.getElementById('reading');
const meaningDisplay = document.getElementById('meaning');
const exampleDisplay = document.getElementById('example');
const nextButton = document.getElementById('btn-next');
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
    idFront.innerText = displayId;
    idBack.innerText = displayId;
    kanjiDisplay.innerText = vocabulary[currentIndex].kanji;
    readingDisplay.innerText = vocabulary[currentIndex].reading;
    meaningDisplay.innerText = vocabulary[currentIndex].meaning;
    if (exampleDisplay) exampleDisplay.innerText = vocabulary[currentIndex].example;
    updateProgress();
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

// ==========================================
// 4. INTERACTIVE LOGIC & HAPTIC FEEDBACK
// ==========================================

/**
 * Handle card flip animation and trigger haptic feedback.
 */
cardInner.addEventListener('click', () => {
    // Provide a subtle tactile confirmation (15ms)
    if (navigator.vibrate) {
        navigator.vibrate(15); 
    }
    cardInner.classList.toggle('is-flipped');
});

/**
 * Reset card state, trigger vibration, and load the next vocabulary item.
 */
nextButton.addEventListener('click', (event) => {
    event.stopPropagation();
    // 1. Trigger a stronger vibration (30ms) for transition confirmation
    if (navigator.vibrate) {
        navigator.vibrate(30); 
    }

    // 2. Flip the card back to the front side first
    cardInner.classList.remove('is-flipped');

    // 3. Wait for the flip-back animation (200ms) before updating content
    setTimeout(() => {
        currentIndex = (currentIndex + 1) % vocabulary.length;
        updateUI();
        console.log(`Current Card Index: ${currentIndex}`);
    }, 200); 
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
