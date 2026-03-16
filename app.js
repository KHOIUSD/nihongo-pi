// 1. DỮ LIỆU VÀ TRẠNG THÁI
const vocabulary = [
    { word: "加工", reading: "かこう", meaning: "Gia công", example: "プラスチックを加工する (Gia công nhựa)." },
    { word: "合格", reading: "ごうかく", meaning: "Đỗ / Vượt qua", example: "N2試験に合格する (Đỗ kỳ thi N2)." },
    { word: "改善", reading: "かいぜん", meaning: "Cải thiện / Cải tiến", example: "作業工程を改善する (Cải thiện quy trình)." },
    { word: "準備", reading: "じゅんび", meaning: "Chuẩn bị", example: "会議の準備をする (Chuẩn bị họp)." },
    { word: "確認", reading: "かくにん", meaning: "Xác nhận", example: "メールを確認してください (Hãy check mail)." },
    { word: "連絡", reading: "れんらく", meaning: "Liên lạc", example: "後で連絡します (Tôi sẽ liên lạc sau)." },
    { word: "報告", reading: "ほうこく", meaning: "Báo cáo", example: "進捗を報告する (Báo cáo tiến độ)." },
    { word: "相談", reading: "そうだん", meaning: "Thảo luận", example: "上司に相談する (Thảo luận với sếp)." },
    { word: "注意", reading: "ちゅうい", meaning: "Chú ý", example: "足元に注意してください (Chú ý dưới chân)." },
    { word: "安全", reading: "あんぜん", meaning: "An toàn", example: "安全第一 (An toàn là trên hết)." }
];

let currentIndex = parseInt(localStorage.getItem("nihongo_progress")) || 0;
let isFlipped = false;
let globalAudio = new Audio();

// 2. PHẦN TỬ DOM
const dom = {
    cardInner: document.getElementById('card-inner'),
    word: document.getElementById('word'),
    reading: document.getElementById('reading'),
    meaning: document.getElementById('meaning'),
    example: document.getElementById('example'),
    idFront: document.getElementById('card-id-front'),
    idBack: document.getElementById('card-id-back'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn'),
    finishBtn: document.getElementById('finish-btn'),
    progressBar: document.getElementById('progress-bar'),
    progressText: document.getElementById('progress-text'),
    sideMenu: document.getElementById('side-menu'),
    overlay: document.getElementById('menu-overlay')
};

// 3. HÀM XỬ LÝ CHÍNH
function updateUI() {
    const data = vocabulary[currentIndex];
    const total = vocabulary.length;

    // Cập nhật nội dung thẻ với hiệu ứng mờ nhẹ
    [dom.word, dom.reading, dom.meaning, dom.example].forEach(el => el.style.opacity = 0);
    
    setTimeout(() => {
        dom.word.innerText = data.word;
        dom.reading.innerText = data.reading;
        dom.meaning.innerText = data.meaning;
        dom.example.innerText = data.example;
        dom.idFront.innerText = currentIndex + 1;
        dom.idBack.innerText = currentIndex + 1;
        [dom.word, dom.reading, dom.meaning, dom.example].forEach(el => el.style.opacity = 1);
    }, 150);

    // Cập nhật thanh tiến độ
    const percent = ((currentIndex + 1) / total) * 100;
    dom.progressBar.style.width = `${percent}%`;
    dom.progressText.innerText = `${currentIndex + 1}/${total}`;

    // Điều hướng nút bấm
    dom.prevBtn.classList.toggle('invisible', currentIndex === 0);
    if (currentIndex === total - 1) {
        dom.nextBtn.classList.add('hidden');
        dom.finishBtn.classList.remove('hidden');
    } else {
        dom.nextBtn.classList.remove('hidden');
        dom.finishBtn.classList.add('hidden');
    }

    // Reset trạng thái lật
    dom.cardInner.classList.remove('is-flipped');
    isFlipped = false;

    // Lưu tiến độ
    localStorage.setItem("nihongo_progress", currentIndex);
}

function playAudio(text) {
    if (!text) return;
    const cleanText = text.trim();
    globalAudio.pause();
    globalAudio.currentTime = 0;
    globalAudio.src = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&le=jap`;
    globalAudio.play().catch(e => {
        console.error("Lỗi phát âm thanh:", e.message);
    });
}

// 4. SỰ KIỆN TƯƠNG TÁC
document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo Pi SDK
    if (window.Pi) {
        window.Pi.init({ version: "2.0", sandbox: true });
        document.getElementById('user-status-dot').classList.replace('bg-gray-300', 'bg-green-500');
    }

    // Lật thẻ
    dom.cardInner.addEventListener('click', function(e) {
        if (e.target.closest('#audio-hint')) return;
        this.classList.toggle('is-flipped');
        const isFlippedNow = this.classList.contains('is-flipped');
        if (isFlippedNow) {
            playAudio(vocabulary[currentIndex].word);
            if (navigator.vibrate) navigator.vibrate(10);
        }
    });

    // Nút loa
    document.getElementById('audio-hint').onclick = (e) => {
        e.stopPropagation();
        playAudio(vocabulary[currentIndex].word);
    };

    // Điều hướng
    dom.nextBtn.onclick = () => {
        if (currentIndex < vocabulary.length - 1) {
            currentIndex++;
            updateUI();
        }
    };

    dom.prevBtn.onclick = () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateUI();
        }
    };

    // Menu toggle
    const toggleMenu = () => {
        dom.sideMenu.classList.toggle('active');
        dom.overlay.classList.toggle('active');
    };
    document.getElementById('menu-toggle').onclick = toggleMenu;
    document.getElementById('menu-close').onclick = toggleMenu;
    dom.overlay.onclick = toggleMenu;

    // Hoàn thành
    dom.finishBtn.onclick = () => {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.7 } });
        setTimeout(() => {
            alert("おめでとうございます！Bạn đã hoàn thành bộ thẻ này! 🏆");
            currentIndex = 0;
            updateUI();
        }, 1000);
    };

    // Pi Auth
    document.getElementById('btn-auth').onclick = async () => {
        try {
            const auth = await window.Pi.authenticate(['username', 'payments'], (p) => {});
            document.getElementById('username').innerText = auth.user.username;
            document.getElementById('user-initial').innerText = auth.user.username.charAt(0).toUpperCase();
            document.getElementById('user-info').classList.remove('hidden');
            document.getElementById('btn-auth').classList.add('hidden');
        } catch (err) {
            alert("Vui lòng truy cập từ Pi Browser!");
        }
    };

    updateUI();
});

// 5. THANH TOÁN PI
async function unlockPremiumContent() {
    try {
        await window.Pi.createPayment({
            amount: 3.14,
            memo: "Mở khóa kho từ vựng tiếng Nhật Premium",
            metadata: { package: "N1_N5_FULL" }
        }, {
            onReadyForServerApproval: (id) => console.log("Chờ server duyệt:", id),
            onReadyForServerCompletion: (id, txid) => {
                document.getElementById('premium-badge').classList.remove('hidden');
                document.getElementById('premium-section').style.display = 'none';
                alert("Nâng cấp thành công!");
            },
            onCancel: (id) => {},
            onError: (err) => alert("Lỗi thanh toán!"),
        });
    } catch (e) {
        console.error(e);
    }
}
