// 1. 資料庫鍵名
const DB_NAME = 'LAUNDRY_STABLE_V1';

// 2. 初始資料 (嘗試讀取舊資料，否則建立新的)
let machines = JSON.parse(localStorage.getItem(DB_NAME)) || [
    { name: '機台 A-01', status: 'idle', endTime: null },
    { name: '機台 A-02', status: 'idle', endTime: null },
    { name: '機台 A-03', status: 'idle', endTime: null }
];

// 3. 儲存與渲染
function updateAndSave() {
    localStorage.setItem(DB_NAME, JSON.stringify(machines));
    render();
}

function render() {
    const grid = document.getElementById('machine-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const now = Date.now();

    machines.forEach((m, index) => {
        // 自動邏輯：若時間到則改為「待取衣」
        if (m.status === 'washing' && m.endTime && now >= m.endTime) {
            m.status = 'finished';
            m.endTime = null;
            localStorage.setItem(DB_NAME, JSON.stringify(machines));
        }

        const isWashing = m.status === 'washing';
        const isFinished = m.status === 'finished';

        // 倒數文字
        let timerStr = "--:--";
        if (isWashing && m.endTime) {
            const diff = Math.max(0, m.endTime - now);
            const mm = Math.floor(diff / 60000);
            const ss = Math.floor((diff % 60000) / 1000);
            timerStr = `${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
        }

        const card = document.createElement('div');
        card.className = `machine-card bg-white rounded-[2.5rem] p-8 shadow-xl border-4 border-transparent ${isWashing ? 'is-washing-card' : ''}`;
        
        card.innerHTML = `
            <div class="text-center">
                <p class="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-4">
                    ${isWashing ? '● Washing' : (isFinished ? '● Done' : '● Standby')}
                </p>
                
                <div class="w-20 h-20 mx-auto mb-6 bg-slate-50 rounded-full flex items-center justify-center">
                    <i class="fas fa-sync-alt text-4xl ${isWashing ? 'spin-slow text-blue-500' : 'text-slate-200'}"></i>
                </div>

                <h2 class="text-2xl font-black text-slate-800 mb-6">${m.name}</h2>

                <div class="${isWashing ? 'bg-blue-600' : (isFinished ? 'bg-green-500' : 'bg-slate-800')} text-white rounded-2xl py-4 mb-8">
                    <p class="text-4xl font-mono font-bold tracking-tighter">
                        ${isWashing ? timerStr : (isFinished ? 'DONE' : '00:00')}
                    </p>
                </div>

                <div class="flex flex-col gap-3">
                    <button onclick="handleStart(${index})" ${m.status !== 'idle' ? 'disabled' : ''} 
                        class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition active:scale-95 shadow-lg shadow-blue-100">
                        開始洗衣 (5m)
                    </button>
                    
                    <button onclick="handleFinish(${index})" ${m.status !== 'finished' ? 'disabled' : ''} 
                        class="w-full bg-green-500 text-white py-4 rounded-2xl font-black hover:bg-green-600 transition active:scale-95 shadow-lg shadow-green-100">
                        已取走衣物
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 4. 定義全域按鈕事件 (掛載到 window 確保 HTML 呼叫得到)
window.handleStart = function(index) {
    machines[index].status = 'washing';
    machines[index].endTime = Date.now() + (5 * 60 * 1000); 
    updateAndSave();
};

window.handleFinish = function(index) {
    machines[index].status = 'idle';
    machines[index].endTime = null;
    updateAndSave();
};

// 5. 每秒時鐘與循環渲染
setInterval(() => {
    const clockEl = document.getElementById('clock');
    if (clockEl) clockEl.innerText = new Date().toLocaleTimeString('en-GB');
    render();
}, 1000);

// 6. 初次啟動
document.addEventListener('DOMContentLoaded', render);
