// --- CONFIGURATION & DATA ---
const vocabulary = [
    { kanji: "加工", reading: "かこう", meaning: "Gia công", example: "プラスチックを加工する (Gia công nhựa)" },
    { kanji: "合格", reading: "ごうかく", meaning: "Đỗ / Vượt qua", example: "N2試験に合格する (Đỗ kỳ thi N2)" },
    { kanji: "改善", reading: "かいぜn", meaning: "Cải thiện (Kaizen)", example: "作業工程を改善する (Cải thiện công đoạn làm việc)" }
];
let currentIndex = 0;

// --- DOM ELEMENTS ---
const card = document.getElementById('card');
const kanjiText = document.getElementById('kanji');
const readingText = document.getElementById('reading');
const meaningText = document.getElementById('meaning');
const exampleText = document.getElementById('example'); 
const btnNext = document.getElementById('btn-next');

// --- CARD INTERACTION LOGIC ---

/**
 * Toggles the visibility of the answer (reading, meaning, and example).
 */
card.addEventListener('click', () => {
    if (readingText && meaningText) {
        readingText.classList.toggle('invisible');
        meaningText.classList.toggle('invisible');
        if (exampleText) exampleText.classList.toggle('invisible');
        
        // Visual feedback when flipped
        card.classList.toggle('bg-purple-50');
    }
});

/**
 * Loads the next vocabulary item and resets the card state.
 */
btnNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % vocabulary.length;
    
    // Update content
    kanjiText.innerText = vocabulary[currentIndex].kanji;
    readingText.innerText = vocabulary[currentIndex].reading;
    meaningText.innerText = vocabulary[currentIndex].meaning;
    if (exampleText) exampleText.innerText = vocabulary[currentIndex].example;

    // Reset visibility to "Hidden" for the new card
    readingText.classList.add('invisible');
    meaningText.classList.add('invisible');
    if (exampleText) exampleText.classList.add('invisible');
    card.classList.remove('bg-purple-50');
});

// --- PI WEB3 & PAYMENT LOGIC ---

/**
 * Handle the "Unlock Premium" payment process
 */
async function unlockPremiumContent() {
    try {
        const paymentData = {
            amount: 3.14,
            memo: "Mở khóa kho từ vựng tiếng Nhật Premium",
            metadata: { packageId: "premium_n2_vocab_001" },
        };

        const callbacks = {
            onReadyForServerApproval: (paymentId) => console.log("Approved ID:", paymentId),
            onReadyForServerCompletion: (paymentId, txid) => console.log("Completed TXID:", txid),
            onCancel: (paymentId) => console.log("Cancelled:", paymentId),
            onError: (error) => console.error("Error:", error),
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

/**
 * Updates UI to reflect Premium status
 */
function enablePremiumFeatures() {
    const badge = document.getElementById('premium-badge');
    const premiumSection = document.getElementById('premium-section');

    if (badge) badge.classList.remove('hidden');
    if (premiumSection) premiumSection.style.display = 'none';
    
    console.log("Premium features activated.");
}

// --- PI PAYMENT INTEGRATION ---

/**
 * Handle the "Unlock Premium" payment process
 */
async function unlockPremiumContent() {
    try {
        const paymentData = {
            amount: 3.14, // Amount of Pi to charge
            memo: "Unlock Lifetime Japanese Vocabulary Access", // Transaction description
            metadata: { packageId: "premium_n2_vocab_001" }, // Custom data for your database
        };

        const callbacks = {
            onReadyForServerApproval: (paymentId) => {
                /** * Step 1: Send paymentId to YOUR backend 
                 * Your backend should call Pi Server to approve the payment.
                 */
                console.log("Payment is ready for server approval. ID:", paymentId);
                // fetch('/api/approve-payment', { method: 'POST', body: JSON.stringify({ paymentId }) });
            },
            onReadyForServerCompletion: (paymentId, txid) => {
                /** * Step 2: Send txid to YOUR backend 
                 * Your backend should notify Pi Server that the transaction is complete.
                 */
                console.log("Payment is ready for completion. Transaction ID:", txid);
                // fetch('/api/complete-payment', { method: 'POST', body: JSON.stringify({ paymentId, txid }) });
            },
            onCancel: (paymentId) => {
                console.log("Payment cancelled by user. ID:", paymentId);
            },
            onError: (error, payment) => {
                console.error("Payment error occurred:", error);
            },
        };

        // Trigger the Pi Payment modal
        const payment = await Pi.createPayment(paymentData, callbacks);
        
        if (payment) {
            alert("Mở khóa thành công! Chào mừng bạn đến với kho từ vựng Premium.");
            enablePremiumFeatures();
        }
    } catch (err) {
        console.error("Could not initiate payment:", err);
    }
}

/**
 * Function to update UI after successful payment
 */
function enablePremiumFeatures() {
    const badge = document.getElementById('premium-badge');
    const premiumSection = document.getElementById('premium-section');

    // Show the premium badge if it exists
    if (badge) {
        badge.classList.remove('hidden');
    }

    // Hide the upgrade section to clean up the UI
    if (premiumSection) {
        premiumSection.style.display = 'none';
    }
    
    console.log("Premium features enabled successfully.");
}
