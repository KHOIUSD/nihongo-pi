// ==========================================
// 1. CONFIGURATION & DATA
// ==========================================
const vocabulary = [
    { kanji: "加工", reading: "かこう", meaning: "Gia công", example: "プラスチックを加工する。 (Gia công nhựa)" },
    { kanji: "合格", reading: "ごうかく", meaning: "Đỗ / Vượt qua", example: "N2試験に合格する。 (Đỗ kỳ thi N2)" },
    { kanji: "改善", reading: "かいぜん", meaning: "Cải thiện, cải tiến (Kaizen)", example: "作業工程を改善する (Cải thiện công đoạn làm việc)" }
];
let currentIndex = 0;

// ==========================================
// 2. DOM ELEMENTS
// ==========================================
const cardInner = document.getElementById('card-inner');
const kanjiDisplay = document.getElementById('kanji');
const readingDisplay = document.getElementById('reading');
const meaningDisplay = document.getElementById('meaning');
const exampleDisplay = document.getElementById('example');
const nextButton = document.getElementById('btn-next');

// ==========================================
// 3. CARD INTERACTION LOGIC
// ==========================================

// Flip card effect
cardInner.addEventListener('click', () => {
    if (navigator.vibrate) navigator.vibrate(15);
    cardInner.classList.toggle('is-flipped');
});

// Load next card with smooth transition
nextButton.addEventListener('click', () => {
    // 1. Trigger haptic feedback if supported by the browser
    if (navigator.vibrate) {
       // A 30ms vibration provides a subtle tactile confirmation for the card transition
       navigator.vibrate(30); 
    }
    // 2. Flip back to front first
    cardInner.classList.remove('is-flipped');

    // 3. Wait for flip animation (200ms), then update content
    setTimeout(() => {
        currentIndex = (currentIndex + 1) % vocabulary.length;
        
        kanjiDisplay.innerText = vocabulary[currentIndex].kanji;
        readingDisplay.innerText = vocabulary[currentIndex].reading;
        meaningDisplay.innerText = vocabulary[currentIndex].meaning;
        
        if (exampleDisplay) {
            exampleDisplay.innerText = vocabulary[currentIndex].example;
        }
        console.log("Current Card Index:", currentIndex);
    }, 200); 
});

// ==========================================
// 4. PI WEB3 & PAYMENT LOGIC
// ==========================================

async function unlockPremiumContent() {
    try {
        const paymentData = {
            amount: 3.14,
            memo: "Unlock Lifetime Japanese Vocabulary Access",
            metadata: { packageId: "premium_n2_vocab_001" },
        };

        const callbacks = {
            onReadyForServerApproval: (paymentId) => {
                console.log("Payment ready for approval. ID:", paymentId);
            },
            onReadyForServerCompletion: (paymentId, txid) => {
                console.log("Payment ready for completion. TXID:", txid);
            },
            onCancel: (paymentId) => {
                console.log("Payment cancelled. ID:", paymentId);
            },
            onError: (error) => {
                console.error("Payment error:", error);
            },
        };

        const payment = await Pi.createPayment(paymentData, callbacks);
        
        if (payment) {
            alert("Mở khóa thành công! Chào mừng bạn đến với kho từ vựng Premium.");
            enablePremiumFeatures();
        }
    } catch (err) {
        console.error("Payment initiation failed:", err);
    }
}

function enablePremiumFeatures() {
    const badge = document.getElementById('premium-badge');
    const premiumSection = document.getElementById('premium-section');

    if (badge) badge.classList.remove('hidden');
    if (premiumSection) premiumSection.style.display = 'none';
    
    console.log("Premium features activated successfully.");
}
