// 資料庫 Key 值
const STORAGE_KEY = 'LAUNDRY_V4_CORE';

// 初始化：從瀏覽器儲存空間讀取資料，如果沒有則設定預設 3 台機器
let machines = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
    { name: '機台 A-01', status: 'idle', endTime: null },
    { name: '機台 A-02', status: 'idle', endTime: null },
    { name: '機台 A-03', status: 'idle', endTime: null }
];

function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(machines));
}

function render() {
    const grid = document.getElementById('machine-grid');
    grid.innerHTML = '';

    machines.forEach((m, index) => {
        const now = Date.now();
        const isWashing = m.status === 'washing';
        const isFinished = m.status === 'finished';

        // 邏輯檢查：如果洗滌時間已到，自動更新狀態為完成
        if (isWashing && now >= m.endTime) {
            m.status = 'finished';
            save();
        }

        // 計算倒數顯示
        let timerDisplay = "--:--";
        if (isWashing) {
            const diff = Math.max(0, m.endTime - now);
            const mm = Math.floor(diff / 60000);
            const ss = Math.floor((diff % 60000) / 1000);
            timerDisplay = `${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
        }

        const card = document.createElement('div');
        card.className = `machine-card bg-white rounded-[3rem] p-8 border-2 ${isWashing ? 'washing-active' : 'border-transparent shadow-xl'}`;

        card.innerHTML = `
            <div class="text-center">
                <p class="text-[10px] font-black tracking-widest text-slate-300 uppercase mb-2">
                    ${isWashing ? '● Washing Now' : (isFinished ? '● Ready to Collect' : '● Standby')}
                </p>
                <h2 class="text-3xl font-black text-slate-800 mb-6">${m.name}</h2>
                
                <div class="w-24 h-24 mx-auto mb-8 bg-slate-50 rounded-full flex items-center justify-center">
                    <i class="fas fa-sync-alt text-5xl ${isWashing ? 'spin-icon' : 'text-slate-100'}"></i>
                </div>

                <div class="${isWashing ? 'bg-blue-600' : (isFinished ? 'bg-emerald-500' : 'bg-slate-800')} text-white rounded-3xl py-4 mb-8 transition-colors duration-500">
                    <p class="text-[10px] uppercase opacity-50 tracking-widest font-bold">Remaining</p>
                    <p class="text-4xl font-mono font-bold">${isWashing ? timerDisplay : (isFinished ? 'DONE' : '--:--')}</p>
                </div>

                <div class="flex flex-col gap-3">
                    <button onclick="startLaundry(${index})" ${m.status !== 'idle' ? 'disabled' : ''} 
                        class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-100 active:scale-95 transition-all">
                        開始洗衣 (5m)
                    </button>
                    
                    <button onclick="collectLaundry(${index})" ${m.status !== 'finished' ? 'disabled' : ''} 
                        class="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-100 active:scale-95 transition-all">
                        已取走衣物
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 開始洗衣按鈕
window.startLaundry = function(index) {
    machines[index].status = 'washing';
    machines[index].endTime = Date.now() + (5 * 60 * 1000); // 這裡設定 5 分鐘
    save();
    render();
};

// 取走衣物按鈕
window.collectLaundry = function(index) {
    machines[index].status = 'idle';
    machines[index].endTime = null;
    save();
    render();
};

// 每一秒更新時鐘與渲染畫面
setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString('en-GB');
    render();
}, 1000);

// 頁面加載時執行第一次渲染
render();
