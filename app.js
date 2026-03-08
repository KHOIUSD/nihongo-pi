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
    document.getElementById('premium-badge').classList.remove('hidden');
    // Logic to load more advanced vocabulary from your database
}
