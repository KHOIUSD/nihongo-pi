// ==========================================
// 1. INITIALIZATION & DATA CONFIGURATION
// ==========================================
if (window.Pi) {
   const Pi = window.Pi;
   // Tiến hành các thao tác Web3
} else {
   console.warn("Vui lòng mở ứng dụng trong Pi Browser để sử dụng tính năng thanh toán.");
}
const vocabulary = [{
		word: "加工",
		reading: "かこう",
		meaning: "Gia công",
		example: "プラスチックを加工する (Gia công nhựa)."
	},
	{
		word: "合格",
		reading: "ごうかく",
		meaning: "Đỗ / Vượt qua",
		example: "N2試験に合格する (Đỗ kỳ thi N2)."
	},
	{
		word: "改善",
		reading: "かいぜん",
		meaning: "Cải thiện / Cải tiến (Kaizen)",
		example: "作業工程を改善する (Cải thiện quy trình làm việc)."
	},
	{
		word: "準備",
		reading: "じゅんび",
		meaning: "Chuẩn bị",
		example: "会議の準備をする (Chuẩn bị cho cuộc họp)."
	},
	{
		word: "確認",
		reading: "かくにん",
		meaning: "Xác nhận",
		example: "メールを確認してください (Hãy kiểm tra email)."
	},
	{
		word: "連絡",
		reading: "れんらく",
		meaning: "Liên lạc",
		example: "後で連絡します (Tôi sẽ liên lạc sau)."
	},
	{
		word: "報告",
		reading: "ほうこく",
		meaning: "Báo cáo",
		example: "進捗を報告する (Báo cáo tiến độ)."
	},
	{
		word: "相談",
		reading: "そうだん",
		meaning: "Thảo luận/Bàn bạc",
		example: "上司に相談する (Thảo luận với cấp trên)."
	},
	{
		word: "注意",
		reading: "ちゅうい",
		meaning: "Chú ý/Cẩn thận",
		example: "足元に注意してください (Hãy chú ý dưới chân)."
	},
	{
		word: "安全",
		reading: "あんぜん",
		meaning: "An toàn",
		example: "安全第一 (An toàn là trên hết)."
	}
];

// Load saved progress
let currentIndex = parseInt(localStorage.getItem("nihongo_progress")) || 0;
let isTransitioning = false;
document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 2. DOM ELEMENTS SELECTION
    // ==========================================
    const menuToggle = document.getElementById("menu-toggle");
    const menuClose = document.getElementById("menu-close");
    const sideMenu = document.getElementById("side-menu");
    const menuOverlay = document.getElementById("menu-overlay");

    const cardInner = document.getElementById("card-inner");
    const wordDisplay = document.getElementById("word");
    const readingDisplay = document.getElementById("reading");
    const meaningDisplay = document.getElementById("meaning");
    const exampleDisplay = document.getElementById("example");

    const prevButton = document.getElementById("prev-btn");
    const nextButton = document.getElementById("next-btn");
    const finishButton = document.getElementById('finish-btn');
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");
    const idFront = document.getElementById("card-id-front");
    const idBack = document.getElementById("card-id-back");
    const audioHintBtn = document.getElementById("audio-hint");
    const totalCards = 10;

	// ==========================================
	// 3. UI & PROGRESS FUNCTIONS
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
		// 1. Xử lý nút QUAY LẠI
		if (currentIndex === 0) {
			prevButton.classList.add('invisible'); // Ẩn nhưng giữ chỗ để logo không lệch
		} else {
			prevButton.classList.remove('invisible');
		}
		// 2. Xử lý nút TIẾP THEO và HOÀN THÀNH
		if (currentIndex === total - 1) {
			// Nếu là thẻ CUỐI CÙNG
			nextButton.classList.add('hidden'); // Mất hẳn nút Tiếp theo
			finishButton.classList.remove('hidden'); // Hiện nút Hoàn thành rực rỡ
		} else {
			// Nếu chưa đến thẻ cuối
			nextButton.classList.remove('hidden');
			finishButton.classList.add('hidden');
		}
	}
	function updateUI() {
	    const word = vocabulary[currentIndex];
		const displayId = `${currentIndex + 1}`;
		const elements = [wordDisplay, readingDisplay, meaningDisplay, exampleDisplay];
		// 3.1 Lưu tiến độ vào máy người dùng
        localStorage.setItem("nihongo_progress", currentIndex);
		// 3.2 Hiệu ứng mờ dần khi đổi nội dung
		elements.forEach(el => {if (el) el.style.opacity = "0.3";});
		// 3.3 Đợi một chút (khoảng 200ms) rồi mới thay đổi chữ, số thứ tự và hiện lên lại
		setTimeout(() => {
			// 3.3.1 Nội dung chữ
			if (wordDisplay) wordDisplay.innerText = word.word;
            if (readingDisplay) readingDisplay.innerText = word.reading;
            if (meaningDisplay) meaningDisplay.innerText = word.meaning;
            if (exampleDisplay) exampleDisplay.innerText = word.example;
			// 3.3.2 Số thứ tự trên thẻ (Punch hole)
            const cardIdFront = document.getElementById('card-id-front');
            const cardIdBack = document.getElementById('card-id-back');
            if (cardIdFront) cardIdFront.innerText = displayId;
            if (cardIdBack) cardIdBack.innerText = displayId;
			// 3.3.3 Trả lại độ rõ nét
			elements.forEach(el => {if (el) el.style.opacity = "1";});
			// 3.3.4 Tự động lật thẻ về mặt trước nếu người dùng đang ở mặt sau
            const cardInner = document.getElementById('card-inner');
            if (cardInner && cardInner.classList.contains('is-flipped')) {
                cardInner.classList.remove('is-flipped');
            }
			// 3.3.5 Cập nhật Thanh tiến độ & Các nút điều hướng (Next/Prev/Finish)
            updateProgress();
			updateNavigationDisplay(); 
		}, 200);
	}
    updateUI();
	
	// ==========================================
	// 4. AUDIO & TTS ENGINE (Text-To-Speech Engine)
	// ==========================================
	function speakJapanese(text) {
		if (!text) return; // Phòng hờ nếu text rỗng
		// 4.1 Dừng âm thanh cũ
		if (window.currentAudio) {
			window.currentAudio.pause();
			window.currentAudio.currentTime = 0;
		}
		// 4.2 Sử dụng API của Youdao để chuyển văn bản (Text) thành giọng nói (Speech)
		const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&le=jap`;
		const audio = new Audio(audioUrl);
		window.currentAudio = audio;
		audio.volume = 0.9;
		// 4.3. Xử lý lỗi nếu không tải được âm thanh
    audio.onerror = () => console.error("Không thể tải giọng đọc cho:", text);
		// 4.4 Tạo khoảng nghỉ tự nhiên (200ms)
		setTimeout(() => {
			audio.play().catch(err => console.warn("Audio blocked:", err));
		}, 200);
	}

	// ==========================================
	// 5. INTERACTIVE LOGIC (Card & Nav)
	// ==========================================
	// Flip Card
	cardInner.addEventListener("click", function() {
		this.classList.toggle("is-flipped");
		if (this.classList.contains("is-flipped")) {
		    const currentWord = vocabulary[currentIndex].word;
		    speakJapanese(currentWord);}
		if (navigator.vibrate) navigator.vibrate(15);
	});
	// Navigation logic
	function handleNavigation(isNext) {
		if (isTransitioning) return;
		isTransitioning = true;
		if (navigator.vibrate) {
			navigator.vibrate(isNext ? [30, 10, 30] : 20);
		}
		cardInner.classList.remove("is-flipped");
		setTimeout(() => {
			if (isNext) {
                if (currentIndex < vocabulary.length - 1) currentIndex++;
            } else {
                if (currentIndex > 0) currentIndex--;
            }
			localStorage.setItem("nihongo_progress", currentIndex);
			updateUI();
			setTimeout(() => {
				isTransitioning = false;
			}, 100);
		}, 300);
	}
	nextButton.addEventListener("click", (event) => {
		event.stopPropagation();
		handleNavigation(true);
	});
	prevButton.addEventListener("click", (event) => {
		event.stopPropagation();
		handleNavigation(false);
	});
	finishButton.onclick = () => {
		// 1. Tạo hiệu ứng pháo hoa bắn từ hai góc màn hình
		const duration = 3 * 1000; // Pháo bắn trong 3 giây
		const animationEnd = Date.now() + duration;
		const defaults = {
			startVelocity: 30,
			spread: 360,
			ticks: 60,
			zIndex: 3000
		};
		const randomInRange = (min, max) => Math.random() * (max - min) + min;
		const interval = setInterval(function() {
			const timeLeft = animationEnd - Date.now();
			if (timeLeft <= 0) {
				return clearInterval(interval);
			}
			const particleCount = 50 * (timeLeft / duration);
			// Bắn pháo từ bên trái
			confetti(Object.assign({}, defaults, {
				particleCount,
				origin: {
					x: randomInRange(0.1, 0.3),
					y: Math.random() - 0.2
				}
			}));
			// Bắn pháo từ bên phải
			confetti(Object.assign({}, defaults, {
				particleCount,
				origin: {
					x: randomInRange(0.7, 0.9),
					y: Math.random() - 0.2
				}
			}));
		}, 250);
		// 2. Hiện thông báo chúc mừng sau khi bắn pháo một chút
		setTimeout(() => {
			alert("おめでとうございます! Bạn đã hoàn thành xuất sắc bài học! 🏆");
		}, 1000);
		setTimeout(() => { location.reload(); }, 5000);
	};
	updateNavigationDisplay();
	// Audio Hint Button
	audioHintBtn.addEventListener("click", (event) => {
		event.stopPropagation();
		event.preventDefault();
		const currentWord = vocabulary[currentIndex].word;
		speakJapanese(currentWord);
		if (navigator.vibrate) navigator.vibrate(10);
		audioHintBtn.style.transform = "scale(0.9)";
    　　setTimeout(() => {
    　　　　audioHintBtn.style.transform = "scale(1)";
    　　}, 100);
	}, {
		passive: false
	});

	// ==========================================
	// 6. SIDE MENU LOGIC
	// ==========================================
	const toggleMenu = () => {
        const isActive = sideMenu.classList.toggle("active");
        menuOverlay.classList.toggle("active");
        if (isActive) {
        menuOverlay.classList.remove("hidden");
        } else {
            // Chờ hiệu ứng fade-out xong rồi mới ẩn hẳn
            setTimeout(() => {
                if (!sideMenu.classList.contains("active")) {
                    menuOverlay.classList.add("hidden");
                }
            }, 300); 
        }
    };
	// ==========================================
	// 7. PI NETWORK WEB3 INTEGRATION
	// ==========================================
	async function unlockPremiumContent() {
		try {
			const paymentData = {
				amount: 3.14,
				memo: "Mở khóa kho từ vựng tiếng Nhật Premium",
				metadata: {
					packageId: "premium_n2_vocab_001"
				},
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

			await Pi.createPayment(paymentData, callbacks);
		} catch (err) {
			console.error("Payment initiation failed:", err);
		}
	}

	function enablePremiumFeatures() {
		const badge = document.getElementById("premium-badge");
		const premiumSection = document.getElementById("premium-section");
		if (badge) badge.classList.remove("hidden");
		if (premiumSection) premiumSection.style.display = "none";
		alert("Thành công! Gói Premium đã được mở khóa.");
	}
updateUI();
});
