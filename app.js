// ==========================================
// 1. DỮ LIỆU & CẤU HÌNH (GIỮ NGUYÊN 100%)
// ==========================================
const vocabulary = [
    { word: "加工", reading: "かこう", meaning: "Gia công", example: "プラスチックを加工する (Gia công nhựa)." },
    { word: "合格", reading: "ごうかく", meaning: "Đỗ / Vượt qua", example: "N2試験に合格する (Đỗ kỳ thi N2)." },
    { word: "改善", reading: "かいぜん", meaning: "Cải thiện / Cải tiến (Kaizen)", example: "作業工程を改善する (Cải thiện quy trình làm việc)." },
    { word: "準備", reading: "じゅんび", meaning: "Chuẩn bị", example: "会議の準備をする (Chuẩn bị cho cuộc họp)." },
    { word: "確認", reading: "かくにん", meaning: "Xác nhận", example: "メールを確認してください (Hãy kiểm tra email)." },
    { word: "連絡", reading: "れんらく", meaning: "Liên lạc", example: "後で連絡します (Tôi sẽ liên lạc sau)." },
    { word: "報告", reading: "ほうこく", meaning: "Báo cáo", example: "進捗を報告する (Báo cáo tiến độ)." },
    { word: "相談", reading: "そうだん", meaning: "Thảo luận/Bàn bạc", example: "上司に相談する (Thảo luận với cấp trên)." },
    { word: "注意", reading: "ちゅうい", meaning: "Chú ý/Cẩn thận", example: "足元에注意してください (Hãy chú ý dưới chân)." },
    { word: "安全", reading: "あんぜん", meaning: "An toàn", example: "安全第一 (An toàn là trên hết)." }
];

// Khởi tạo các biến trạng thái (Giữ nguyên logic localStorage)
let currentIndex = parseInt(localStorage.getItem("nihongo_progress")) || 0;
let isTransitioning = false;
let currentAudio = null;

// Biến giữ các phần tử DOM (Khai báo toàn cục để các hàm dùng chung)
let wordDisplay, readingDisplay, meaningDisplay, exampleDisplay;
let prevButton, nextButton, finishButton, progressBar, progressText;
let cardInner, sideMenu, menuOverlay, menuToggle, menuClose, audioHintBtn;

// ==========================================
// 2. CÁC HÀM UI & TIẾN ĐỘ (GIỮ NGUYÊN LOGIC)
// ==========================================
function updateProgress() {
    const total = vocabulary.length;
    const current = currentIndex + 1;
    const percentage = (current / total) * 100;
    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressText) progressText.innerText = `${current}/${total}`;
}

function updateNavigationDisplay() {
    const total = vocabulary.length;
    // Nút QUAY LẠI
    if (currentIndex === 0) {
        if (prevButton) prevButton.classList.add('invisible');
    } else {
        if (prevButton) prevButton.classList.remove('invisible');
    }
    // Nút TIẾP THEO và HOÀN THÀNH
    if (currentIndex === total - 1) {
        if (nextButton) nextButton.classList.add('hidden');
        if (finishButton) finishButton.classList.remove('hidden');
    } else {
        if (nextButton) nextButton.classList.remove('hidden');
        if (finishButton) finishButton.classList.add('hidden');
    }
}

function updateUI() {
    const wordData = vocabulary[currentIndex];
    const displayId = `${currentIndex + 1}`;
    const elements = [wordDisplay, readingDisplay, meaningDisplay, exampleDisplay];

    // Lưu tiến độ vào máy người dùng
    localStorage.setItem("nihongo_progress", currentIndex);

    // Hiệu ứng mờ dần (Opacity 0.2s như bạn đã viết)
    elements.forEach(el => { if (el) el.style.opacity = "0"; });

    setTimeout(() => {
        if (wordDisplay) wordDisplay.innerText = wordData.word;
        if (readingDisplay) readingDisplay.innerText = wordData.reading;
        if (meaningDisplay) meaningDisplay.innerText = wordData.meaning;
        if (exampleDisplay) exampleDisplay.innerText = wordData.example;

        // Số thứ tự Punch hole (Khớp ID trong HTML của bạn)
        const idFront = document.getElementById('card-id-front');
        const idBack = document.getElementById('card-id-back');
        if (idFront) idFront.innerText = displayId;
        if (idBack) idBack.innerText = displayId;

        // Hiện nội dung lại
        elements.forEach(el => { if (el) el.style.opacity = "1"; });

        // Tự động lật về mặt trước
        if (cardInner) cardInner.classList.remove('is-flipped');

        updateProgress();
        updateNavigationDisplay();
    }, 200);
}

// ==========================================
// 3. XỬ LÝ ÂM THANH (GIỮ NGUYÊN YOUDAO API)
// ==========================================
function speakJapanese(text) {
    if (!text) return;
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&le=jap`;
    const audio = new Audio(audioUrl);
    currentAudio = audio;
    audio.volume = 0.9;
    audio.onerror = () => console.error("Không thể tải giọng đọc cho:", text);
    
    setTimeout(() => {
        audio.play().catch(err => console.warn("Audio blocked:", err));
    }, 200);
}

// ==========================================
// 4. LOGIC TƯƠNG TÁC (GIỮ NGUYÊN VIBRATE & LOGIC)
// ==========================================
function handleNavigation(isNext) {
    if (isTransitioning) return;
    isTransitioning = true;

    if (navigator.vibrate) {
        navigator.vibrate(isNext ? [30, 10, 30] : 20);
    }

    if (cardInner) cardInner.classList.remove("is-flipped");

    setTimeout(() => {
        if (isNext) {
            if (currentIndex < vocabulary.length - 1) currentIndex++;
        } else {
            if (currentIndex > 0) currentIndex--;
        }
        updateUI();
        setTimeout(() => { isTransitioning = false; }, 100);
    }, 300);
}

// ==========================================
// 5. KHỞI TẠO KHI TRANG LOAD (DOMContentLoaded)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Gán các phần tử (Đã bỏ hoàn toàn 'const' bên trong hàm này)
    menuToggle = document.getElementById("menu-toggle");
    menuClose = document.getElementById("menu-close");
    sideMenu = document.getElementById("side-menu");
    menuOverlay = document.getElementById("menu-overlay");
    cardInner = document.getElementById("card-inner");
    wordDisplay = document.getElementById("word");
    readingDisplay = document.getElementById("reading");
    meaningDisplay = document.getElementById("meaning");
    exampleDisplay = document.getElementById("example");
    prevButton = document.getElementById("prev-btn");
    nextButton = document.getElementById("next-btn");
    finishButton = document.getElementById('finish-btn');
    progressBar = document.getElementById("progress-bar");
    progressText = document.getElementById("progress-text");
    audioHintBtn = document.getElementById("audio-hint");

    // Sự kiện Lật thẻ
    if (cardInner) {
        cardInner.addEventListener("click", function() {
            this.classList.toggle("is-flipped");
            if (this.classList.contains("is-flipped")) {
                const currentWord = vocabulary[currentIndex].word;
                speakJapanese(currentWord);
            }
            if (navigator.vibrate) navigator.vibrate(15);
        });
    }

    // Sự kiện Điều hướng
    if (nextButton) nextButton.onclick = (e) => { e.stopPropagation(); handleNavigation(true); };
    if (prevButton) prevButton.onclick = (e) => { e.stopPropagation(); handleNavigation(false); };

    // Nút Hoàn thành (Confetti & Alert giữ nguyên)
    if (finishButton) {
        finishButton.onclick = () => {
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, zIndex: 3000 });
            setTimeout(() => {
                alert("おめでとうございます! Bạn đã hoàn thành xuất sắc bài học! 🏆");
                location.reload();
            }, 1000);
        };
    }

    // Nút Loa
    if (audioHintBtn) {
        audioHintBtn.addEventListener("click", (event) => {
            // Ngăn chặn các sự kiện lồng nhau và mặc định
            event.stopPropagation();
            event.preventDefault();

            // Lấy từ hiện tại và đọc âm thanh
            const currentWord = vocabulary[currentIndex].word;
            speakJapanese(currentWord);

            // Hiệu ứng rung phản hồi (Haptic feedback)
            if (navigator.vibrate) navigator.vibrate(10);

            // Hiệu ứng hình ảnh: Thu nhỏ khi chạm và phóng to lại sau 100ms
            audioHintBtn.style.transform = "scale(0.9)";
            setTimeout(() => {
                audioHintBtn.style.transform = "scale(1)";
            }, 100);
        }, {
            passive: false // Đảm bảo preventDefault hoạt động mượt mà trên mobile
        });
    }

    // Side Menu Logic (Giữ nguyên hàm của bạn)
    const handleToggleMenu = () => {
        if (!sideMenu || !menuOverlay) return;
        const isActive = sideMenu.classList.toggle("active");
        menuOverlay.classList.toggle("active");
        if (isActive) {
            menuOverlay.classList.remove("hidden");
        } else {
            setTimeout(() => {
                if (!sideMenu.classList.contains("active")) {
                    menuOverlay.classList.add("hidden");
                }
            }, 300);
        }
    };
    if (menuToggle) menuToggle.onclick = handleToggleMenu;
    if (menuClose) menuClose.onclick = handleToggleMenu;
    if (menuOverlay) menuOverlay.onclick = handleToggleMenu;

    // Chạy cập nhật lần đầu
    updateUI();
});

// ==========================================
// 6. PI NETWORK WEB3 (GIỮ NGUYÊN)
// ==========================================
async function unlockPremiumContent() {
    try {
        const paymentData = {
            amount: 3.14,
            memo: "Mở khóa kho từ vựng tiếng Nhật Premium",
            metadata: { packageId: "premium_n2_vocab_001" },
        };
        const callbacks = {
            onReadyForServerApproval: (id) => console.log("Approved:", id),
            onReadyForServerCompletion: (id, txid) => {
                console.log("Completed:", txid);
                enablePremiumFeatures();
            },
            onCancel: (id) => console.log("Cancelled:", id),
            onError: (error) => console.error("Error:", error),
        };
        await window.Pi.createPayment(paymentData, callbacks);
    } catch (err) {
        console.error("Payment failed:", err);
    }
}

function enablePremiumFeatures() {
    const badge = document.getElementById("premium-badge");
    const section = document.getElementById("premium-section");
    if (badge) badge.classList.remove("hidden");
    if (section) section.style.display = "none";
    alert("Thành công! Gói Premium đã được mở khóa.");
}
