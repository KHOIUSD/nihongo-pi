// 1. DỮ LIỆU CHUẨN 
const vocabulary = [
    { word: "加工", reading: "かこう", meaning: "Gia công", example: "プラスチックを加工する (Gia công nhựa)." },
    { word: "合格", reading: "ごうかく", meaning: "Đỗ / Vượt qua", example: "N2試験に合格する (Đỗ kỳ thi N2)." },
    { word: "改善", reading: "かいぜん", meaning: "Cải thiện", example: "作業工程を改善する (Cải thiện quy trình)." },
    { word: "準備", reading: "じゅんび", meaning: "Chuẩn bị", example: "会議の準備をする (Chuẩn bị họp)." },
    { word: "確認", reading: "かくにん", meaning: "Xác nhận", example: "メールを確認してください (Hãy kiểm tra mail)." },
    { word: "連絡", reading: "れんらく", meaning: "Liên lạc", example: "後で連絡します (Tôi sẽ liên lạc sau)." },
    { word: "報告", reading: "ほうこく", meaning: "Báo cáo", example: "進捗を報告する (Báo cáo tiến độ)." },
    { word: "相談", reading: "そうだん", meaning: "Thảo luận", example: "上司に相談する (Thảo luận với sếp)." },
    { word: "注意", reading: "ちゅうい", meaning: "Chú ý", example: "足元に注意してください (Hãy chú ý dưới chân)." },
    { word: "安全", reading: "あんぜん", meaning: "An toàn", example: "安全第一 (An toàn là trên hết)." }
];

let currentIndex = parseInt(localStorage.getItem("pi_nihongo_idx")) || 0;
let isFlipped = false;

// 2. DOM ELEMENTS
const cardInner = document.getElementById('card-inner');
const wordText = document.getElementById('word');
const readingText = document.getElementById('reading');
const meaningText = document.getElementById('meaning');
const exampleText = document.getElementById('example');
const progressText = document.getElementById('progress-text');
const progressBar = document.getElementById('progress-bar');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const finishBtn = document.getElementById('finish-btn');
const audioBtn = document.getElementById('audio-btn');

// 3. LOGIC HÀNH VI
function updateUI() {
    const data = vocabulary[currentIndex];
    
    // Cập nhật nội dung thẻ
    wordText.innerText = data.word;
    readingText.innerText = data.reading;
    meaningText.innerText = data.meaning;
    exampleText.innerText = data.example;
    
    // Số thứ tự punch hole
    document.getElementById('card-num-f').innerText = currentIndex + 1;
    document.getElementById('card-num-b').innerText = currentIndex + 1;

    // Tiến độ
    const total = vocabulary.length;
    progressText.innerText = `${currentIndex + 1}/${total}`;
    progressBar.style.width = `${((currentIndex + 1) / total) * 100}%`;

    // Điều hướng nút bấm
    prevBtn.classList.toggle('invisible', currentIndex === 0);
    if (currentIndex === total - 1) {
        nextBtn.classList.add('hidden');
        finishBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        finishBtn.classList.add('hidden');
    }

    // Reset trạng thái lật thẻ khi qua từ mới
    cardInner.classList.remove('is-flipped');
    isFlipped = false;
    
    localStorage.setItem("pi_nihongo_idx", currentIndex);
}

function playAudio() {
    const word = vocabulary[currentIndex].word;
    const audio = new Audio(`https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&le=jap`);
    audio.play().catch(e => console.log("Audio play blocked"));
}

// 4. KHỞI TẠO SỰ KIỆN
document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo Pi SDK
    if (window.Pi) {
        window.Pi.init({ version: "2.0", sandbox: true });
        document.getElementById('auth-status').classList.replace('bg-gray-300', 'bg-green-500');
    }

    // Lật thẻ
    cardInner.addEventListener('click', () => {
        isFlipped = !isFlipped;
        cardInner.classList.toggle('is-flipped', isFlipped);
        if (isFlipped) playAudio();
        if (navigator.vibrate) navigator.vibrate(10);
    });

    // Nút âm thanh (Ngăn chặn lật thẻ khi bấm)
    audioBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playAudio();
    });

    // Chuyển từ
    nextBtn.onclick = () => { if(currentIndex < vocabulary.length - 1) { currentIndex++; updateUI(); } };
    prevBtn.onclick = () => { if(currentIndex > 0) { currentIndex--; updateUI(); } };

    // Kết thúc
    finishBtn.onclick = () => {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.7 } });
        setTimeout(() => { alert("Bạn thật tuyệt vời! Đã hoàn thành bài học hôm nay."); location.reload(); }, 1000);
    };

    // Menu Logic
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('overlay');
    document.getElementById('menu-toggle').onclick = () => { menu.classList.add('active'); overlay.classList.add('active'); };
    document.getElementById('menu-close').onclick = () => { menu.classList.remove('active'); overlay.classList.remove('active'); };
    overlay.onclick = () => { menu.classList.remove('active'); overlay.classList.remove('active'); };

    // Auth Pi
    document.getElementById('btn-auth').onclick = async () => {
        try {
            const auth = await window.Pi.authenticate(['username', 'payments'], (p) => {});
            document.getElementById('username').innerText = `Konnichiwa, ${auth.user.username}`;
            document.getElementById('user-info').classList.remove('hidden');
            document.getElementById('btn-auth').classList.add('hidden');
        } catch (err) { alert("Hãy mở trong Pi Browser!"); }
    };

    updateUI();
});

// 5. THANH TOÁN PI (WEB3)
async function handlePayment() {
    try {
        await window.Pi.createPayment({
            amount: 3.14,
            memo: "Mở khóa Premium Nihongo Flashcards",
            metadata: { pack: "full_jlpt" }
        }, {
            onReadyForServerApproval: (id) => console.log("Pending server approval:", id),
            onReadyForServerCompletion: (id, txid) => {
                document.getElementById('premium-tag').classList.remove('hidden');
                document.getElementById('premium-box').style.display = 'none';
                alert("Thanh toán thành công! Gói Premium đã được kích hoạt.");
            },
            onCancel: (id) => {},
            onError: (err) => alert("Giao dịch bị gián đoạn."),
        });
    } catch (e) { console.error(e); }
}
