// 1. 設定儲存鍵名與初始資料
const STORAGE_KEY = 'LAUNDRY_V5_FINAL';
let machines = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
    { name: '機台 A-01', status: 'ready', endTime: null },
    { name: '機台 A-02', status: 'ready', endTime: null },
    { name: '機台 A-03', status: 'ready', endTime: null }
];

// 2. 儲存至本地空間
function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(machines));
}

// 3. 渲染主畫面
function render() {
    const grid = document.getElementById('machine-grid');
    if (!grid) return;
    
    grid.innerHTML = ''; // 清空重新繪製
    const now = Date.now();

    machines.forEach((m, index) => {
        // 檢查時間：如果洗完了，自動切換狀態
        if (m.status === 'washing' && m.endTime && now >= m.endTime) {
            m.status = 'done';
            m.endTime = null;
            save();
        }

        const isWashing = m.status === 'washing';
        const isDone = m.status === 'done';

        // 倒數文字計算
        let displayTime = "00:00";
        if (isWashing && m.endTime) {
            const diff = Math.max(0, m.endTime - now);
            const mins = Math.floor(diff / 60000);
            const secs = Math.floor((diff % 60000) / 1000);
            displayTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        const card = document.createElement('div');
        card.className = `machine-card bg-white rounded-[2.5rem] p-8 shadow-xl border-4 border-transparent ${isWashing ? 'working-card' : ''}`;
        
        card.innerHTML = `
            <div class="text-center">
                <span class="text-[10px] font-black tracking-widest uppercase mb-4 block ${isWashing ? 'text-blue-500' : (isDone ? 'text-green-500' : 'text-slate-300')}">
                    ${isWashing ? '● Washing Now' : (isDone ? '● Ready to Collect' : '● Standby')}
                </span>
                
                <h2 class="text-3xl font-black text-slate-800 mb-6">${m.name}</h2>
                
                <div class="w-24 h-24 mx-auto mb-8 bg-slate-50 rounded-full flex items-center justify-center">
                    <i class="fas fa-sync-alt text-5xl ${isWashing ? 'spin-slow text-blue-500' : 'text-slate-200'}"></i>
                </div>

                <div class="${isWashing ? 'bg-blue-600' : (isDone ? 'bg-green-500' : 'bg-slate-800')} text-white rounded-3xl py-4 mb-8 transition-colors duration-500">
                    <p class="text-[10px] uppercase opacity-50 font-bold mb-1 tracking-widest">Time Remaining</p>
                    <p class="text-4xl font-mono font-bold">${isWashing ? displayTime : (isDone ? 'DONE' : '--:--')}</p>
                </div>

                <div class="grid grid-cols-1 gap-3">
                    <button onclick="startApp(${index})" ${m.status !== 'ready' ? 'disabled' : ''} 
                        class="bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition">
                        開始洗衣 (5m)
                    </button>
                    <button onclick="resetApp(${index})" ${m.status !== 'done' ? 'disabled' : ''} 
                        class="bg-green-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-green-100 hover:bg-green-600 active:scale-95 transition">
                        已取走衣物
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 4. 事件處理（掛載至 window 確保全域可用）
window.startApp = function(idx) {
    machines[idx].status = 'washing';
    machines[idx].endTime = Date.now() + (5 * 60 * 1000); // 5分鐘
    save();
    render();
};

window.resetApp = function(idx) {
    machines[idx].status = 'ready';
    machines[idx].endTime = null;
    save();
    render();
};

// 5. 每秒更新一次畫面與時鐘
setInterval(() => {
    const clock = document.getElementById('clock');
    if (clock) clock.innerText = new Date().toLocaleTimeString('en-GB');
    render();
}, 1000);

// 6. 首次執行渲染
render();
