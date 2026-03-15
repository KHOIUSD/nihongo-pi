const vocabulary = [
    { word: "加工", reading: "かこう", meaning: "Gia công", example: "プラスチックを加工する (Gia công nhựa)." },
    { word: "合格", reading: "ごうかく", meaning: "Đỗ / Vượt qua", example: "N2試験に合格する (Đỗ kỳ thi N2)." },
    { word: "改善", reading: "かいぜん", meaning: "Cải thiện", example: "作業工程を改善する (Cải thiện quy trình)." },
    { word: "準備", reading: "じゅんび", meaning: "Chuẩn bị", example: "会議の準備をする (Chuẩn bị họp)." },
    { word: "確認", reading: "かくにん", meaning: "Xác nhận", example: "メールを確認してください (Hãy check mail)." },
    { word: "連絡", reading: "れんらく", meaning: "Liên lạc", example: "後で連絡します (Tôi sẽ liên lạc sau)." },
    { word: "報告", reading: "ほうこく", meaning: "Báo cáo", example: "進捗を報告する (Báo cáo tiến độ)." },
    { word: "相談", reading: "そうだん", meaning: "Thảo luận", example: "上司に相談する (Bàn bạc với sếp)." },
    { word: "注意", reading: "ちゅうい", meaning: "Chú ý", example: "足元に注意してください (Hãy chú ý dưới chân)." },
    { word: "安全", reading: "あんぜん", meaning: "An toàn", example: "安全第一 (An toàn là trên hết)." }
];

let currentIndex = parseInt(localStorage.getItem("pi_vocab_idx")) || 0;

function updateUI() {
    const data = vocabulary[currentIndex];
    
    // Cập nhật nội dung
    document.getElementById('word').innerText = data.word;
    document.getElementById('reading').innerText = data.reading;
    document.getElementById('meaning').innerText = data.meaning;
    document.getElementById('example').innerText = data.example;
    document.getElementById('card-id-front').innerText = currentIndex + 1;
    document.getElementById('card-id-back').innerText = currentIndex + 1;

    // Thanh tiến độ
    const total = vocabulary.length;
    document.getElementById('progress-text').innerText = `${currentIndex + 1}/${total}`;
    document.getElementById('progress-bar').style.width = `${((currentIndex + 1) / total) * 100}%`;

    // Điều hướng
    document.getElementById('prev-btn').classList.toggle('invisible', currentIndex === 0);
    const isLast = currentIndex === total - 1;
    document.getElementById('next-btn').classList.toggle('hidden', isLast);
    document.getElementById('finish-btn').classList.toggle('hidden', !isLast);

    // Reset lật thẻ
    document.getElementById('card-inner').classList.remove('is-flipped');
    localStorage.setItem("pi_vocab_idx", currentIndex);
}

function playAudio() {
    const text = vocabulary[currentIndex].word;
    const audio = new Audio(`https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&le=jap`);
    audio.play().catch(e => console.log("Audio play blocked"));
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.Pi) {
        window.Pi.init({ version: "2.0", sandbox: true });
        document.getElementById('status-dot').classList.replace('bg-gray-300', 'bg-green-500');
    }

    // Lật thẻ
    const cardInner = document.getElementById('card-inner');
    cardInner.onclick = () => {
        cardInner.classList.toggle('is-flipped');
        if (cardInner.classList.contains('is-flipped')) playAudio();
        if (navigator.vibrate) navigator.vibrate(10);
    };

    // Nút loa chủ động
    document.getElementById('audio-hint').onclick = (e) => {
        e.stopPropagation(); // Không cho lật thẻ khi bấm loa
        playAudio();
    };

    // Nút điều hướng
    document.getElementById('next-btn').onclick = () => { if(currentIndex < vocabulary.length-1) { currentIndex++; updateUI(); } };
    document.getElementById('prev-btn').onclick = () => { if(currentIndex > 0) { currentIndex--; updateUI(); } };

    // Side Menu
    document.getElementById('menu-toggle').onclick = () => {
        document.getElementById('side-menu').classList.add('active');
        document.getElementById('menu-overlay').classList.add('active');
    };
    document.getElementById('menu-close').onclick = document.getElementById('menu-overlay').onclick = () => {
        document.getElementById('side-menu').classList.remove('active');
        document.getElementById('menu-overlay').classList.remove('active');
    };

    // Hoàn thành
    document.getElementById('finish-btn').onclick = () => {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.7 } });
        setTimeout(() => { alert("Xuất sắc! Bạn đã hoàn thành bài học."); location.reload(); }, 1000);
    };

    updateUI();
});

async function unlockPremiumContent() {
    try {
        await window.Pi.createPayment({
            amount: 3.14,
            memo: "Mở khóa kho từ vựng N2 Premium",
            metadata: { pack: "N2_FULL" }
        }, {
            onReadyForServerApproval: (id) => console.log("Approved:", id),
            onReadyForServerCompletion: (id, txid) => alert("Thành công! Gói Premium đã được mở khóa."),
            onCancel: (id) => {},
            onError: (err) => {},
        });
    } catch (e) { console.error(e); }
}
