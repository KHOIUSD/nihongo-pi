// 1. DỮ LIỆU
const vocabulary = [
    { word: "加工", reading: "かこう", meaning: "Gia công", example: "プラスチックを加工する (Gia công nhựa)." },
    { word: "合格", reading: "ごうかく", meaning: "Đỗ / Vượt qua", example: "N2試験に合格する (Đỗ kỳ thi N2)." },
    { word: "改善", reading: "かいぜん", meaning: "Cải thiện / Cải tiến", example: "作業工程を改善する (Cải thiện quy trình)." },
    { word: "準備", reading: "じゅんび", meaning: "Chuẩn bị", example: "会議の準備をする (Chuẩn bị họp)." },
    { word: "確認", reading: "かくnにん", meaning: "Xác nhận", example: "メールを確認してください (Hãy check mail)." },
    { word: "連絡", reading: "れんらく", meaning: "Liên lạc", example: "後で連絡します (Tôi sẽ liên lạc sau)." },
    { word: "報告", reading: "ほうこく", meaning: "Báo cáo", example: "進捗を報告する (Báo cáo tiến độ)." },
    { word: "相談", reading: "そうだん", meaning: "Thảo luận", example: "上司に相談する (Thảo luận với sếp)." },
    { word: "注意", reading: "chú ý", reading: "ちゅうい", meaning: "Chú ý", example: "足元に注意してください (Chú ý dưới chân)." },
    { word: "安全", reading: "あんぜん", meaning: "An toàn", example: "安全第一 (An toàn là trên hết)." }
];

// 2. TRẠNG THÁI TOÀN CỤC
let currentIndex = parseInt(localStorage.getItem("nihongo_progress")) || 0;
let isFlipped = false;
let globalAudio = new Audio();

// 3. ĐỊNH NGHĨA DOM (Thống nhất tên biến)
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
    overlay: document.getElementById('menu-overlay'),
    audioBtn: document.getElementById('audio-hint')
    dom.navItems = document.querySelectorAll('.pi-nav-item');
    dom.mainContent = document.querySelector('main > div:not(#profile-section)'); // Các phần tử chính
    dom.profileSection = document.getElementById('profile-section');
};

// 4. HÀM CẬP NHẬT GIAO DIỆN
function updateUI() {
    const data = vocabulary[currentIndex];
    
    // Reset lật thẻ về mặt trước ngay lập tức
    dom.cardInner.classList.remove('is-flipped');
    isFlipped = false;

    // Hiệu ứng Fade-out nội dung cũ
    const textEls = [dom.word, dom.reading, dom.meaning, dom.example];
    textEls.forEach(el => el.style.opacity = 0);
    
    // Cập nhật sau khi thẻ đã lật về mặt trước (200ms)
    setTimeout(() => {
        dom.word.innerText = data.word;
        dom.reading.innerText = data.reading;
        dom.meaning.innerText = data.meaning;
        dom.example.innerText = data.example;
        dom.idFront.innerText = currentIndex + 1;
        dom.idBack.innerText = currentIndex + 1;
        
        textEls.forEach(el => el.style.opacity = 1);
        updateProgress();
        updateNavigation();
    }, 250);

    localStorage.setItem("nihongo_progress", currentIndex);
    // Cứ mỗi khi chuyển từ, ta gọi hàm đồng bộ (có thể tối ưu bằng cách 5 từ gọi 1 lần)
    syncProgressToServer(currentIndex);
}

function updateProgress() {
    const total = vocabulary.length;
    const current = currentIndex + 1;
    const percent = (current / total) * 100;
    dom.progressBar.style.width = `${percent}%`;
    dom.progressText.innerText = `${current}/${total}`;
}

function updateNavigation() {
    const isLast = currentIndex === vocabulary.length - 1;
    dom.prevBtn.classList.toggle('invisible', currentIndex === 0);
    dom.nextBtn.classList.toggle('hidden', isLast);
    dom.finishBtn.classList.toggle('hidden', !isLast);
}

// 5. XỬ LÝ ÂM THANH
function playAudio(text) {
    if (!text) return;
    globalAudio.pause();
    globalAudio.currentTime = 0;
    const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text.trim())}&le=jap`;
    globalAudio.src = url;
    globalAudio.play().catch(e => console.warn("Audio play blocked by browser"));
}

// Hàm chuyển đổi Tab
function switchTab(tabName) {
    // 1. Reset màu icon
    dom.navItems.forEach(item => item.classList.remove('active'));
    
    if (tabName === 'profile') {
        // 2. Hiện hồ sơ, ẩn nội dung học
        document.querySelector('#card-container').parentElement.classList.add('hidden');
        dom.profileSection.classList.remove('hidden');
        dom.navItems[4].classList.add('active'); // Nút Hồ sơ là thứ 5 (index 4)
        
        // 3. Cập nhật con số thống kê
        const learned = currentIndex + 1;
        const total = vocabulary.length;
        document.getElementById('stat-learned').innerText = learned;
        document.getElementById('stat-percent').innerText = Math.round((learned/total)*100) + "%";
        
        // Kiểm tra Premium
        const isPremium = !document.getElementById('premium-badge').classList.contains('hidden');
        document.getElementById('stat-status').innerText = isPremium ? "PREMIUM" : "Miễn phí";
        document.getElementById('stat-status').className = isPremium ? "font-bold text-amber-500" : "font-bold text-gray-400";
        
    } else if (tabName === 'home') {
        // Hiện lại nội dung học
        document.querySelector('#card-container').parentElement.classList.remove('hidden');
        dom.profileSection.classList.add('hidden');
        dom.navItems[0].classList.add('active');
    }
}

// Gán sự kiện click cho các nút nav
dom.navItems[0].onclick = () => switchTab('home');
dom.navItems[4].onclick = () => switchTab('profile');

// 6. SỰ KIỆN KHỞI TẠO
document.addEventListener('DOMContentLoaded', () => {
    // Pi SDK Init
    if (window.Pi) {
        window.Pi.init({ version: "2.0", sandbox: true });
        const dot = document.getElementById('user-status-dot');
        if(dot) dot.classList.replace('bg-gray-300', 'bg-green-500');
    }

    // Lật thẻ (Fix lỗi click)
    dom.cardInner.addEventListener('click', function(e) {
        if (e.target.closest('#audio-hint')) return;
        this.classList.toggle('is-flipped');
        isFlipped = this.classList.contains('is-flipped');
        if (isFlipped) {
            playAudio(vocabulary[currentIndex].word);
            if (navigator.vibrate) navigator.vibrate(15);
        }
    });

    // Nút loa riêng biệt
    dom.audioBtn.onclick = (e) => {
        e.stopPropagation(); // Không cho thẻ lật khi bấm loa
        playAudio(vocabulary[currentIndex].word);
    };

    // Nút điều hướng
    dom.nextBtn.onclick = () => { if (currentIndex < vocabulary.length - 1) { currentIndex++; updateUI(); } };
    dom.prevBtn.onclick = () => { if (currentIndex > 0) { currentIndex--; updateUI(); } };

    // Menu Logic
    const toggleMenu = () => {
        dom.sideMenu.classList.toggle('active');
        dom.overlay.classList.toggle('active');
    };
    document.getElementById('menu-toggle').onclick = toggleMenu;
    document.getElementById('menu-close').onclick = toggleMenu;
    dom.overlay.onclick = toggleMenu;

    // Hoàn thành
    dom.finishBtn.onclick = () => {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        setTimeout(() => {
            alert("おめでとう！ Bạn đã hoàn thành bài học hôm nay! 🏆");
            currentIndex = 0;
            updateUI();
        }, 1000);
    };

    // Đăng nhập Pi
    document.getElementById('btn-auth').onclick = async () => {
        try {
            const auth = await window.Pi.authenticate(['username', 'payments'], (p) => {});
            document.getElementById('username').innerText = auth.user.username;
            document.getElementById('user-initial').innerText = auth.user.username.charAt(0).toUpperCase();
            document.getElementById('user-info').classList.remove('hidden');
            document.getElementById('btn-auth').classList.add('hidden');
        } catch (err) { alert("Hãy mở App trong Pi Browser!"); }
    };

    updateUI(); // Chạy lần đầu
});

// 7. THANH TOÁN PI
async function unlockPremiumContent() {
    try {
        await window.Pi.createPayment({
            amount: 3.14,
            memo: "Mở khóa Premium Nihongo Flashcards",
            metadata: { package: "JLPT_ALL_IN_ONE" }
        }, {
            onReadyForServerApproval: (id) => console.log("Payment ID:", id),
            onReadyForServerCompletion: (id, txid) => {
                document.getElementById('premium-badge')?.classList.remove('hidden');
                document.getElementById('premium-section').style.display = 'none';
                alert("Nâng cấp Premium thành công!");
            },
            onCancel: (id) => {},
            onError: (err) => alert("Lỗi thanh toán: " + err.message)
        });
    } catch (e) { console.error(e); }
}

// Hàm đồng bộ tiến độ lên Server (Pi Database)
async function syncProgressToServer(index) {
    // Kiểm tra xem người dùng đã đăng nhập Pi chưa
    const username = document.getElementById('username').innerText;
    if (username === "Username") return; // Chưa đăng nhập thì thôi

    try {
        // Giả sử bạn có một endpoint API trên server của mình
        const response = await fetch('https://your-api-server.com/save-progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pi_username: username,
                current_index: index,
                timestamp: Date.now()
            })
        });
        
        if (response.ok) {
            console.log("Đã đồng bộ tiến độ với Pi Network Server");
        }
    } catch (e) {
        console.error("Không thể kết nối server để lưu tiến độ:", e);
    }
}
