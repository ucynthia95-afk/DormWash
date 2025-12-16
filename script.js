// 初始化三台機器的資料
const STORAGE_KEY = 'laundry_v3_direct';
let machines = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
    { id: '機台 A-01', status: 0, endTime: null },
    { id: '機台 A-02', status: 0, endTime: null },
    { id: '機台 A-03', status: 0, endTime: null }
];

function updateUI() {
    const display = document.getElementById('machine-display');
    display.innerHTML = '';

    machines.forEach((m, index) => {
        const now = Date.now();
        const isWashing = m.status === 1;
        const isFinished = m.status === 2;
        
        // 計算倒數
        let timeText = "00:00";
        if (isWashing && m.endTime) {
            const diff = Math.max(0, m.endTime - now);
            const mins = Math.floor(diff / 60000);
            const secs = Math.floor((diff % 60000) / 1000);
            timeText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            
            // 時間檢查：如果洗完了自動跳轉狀態
            if (diff === 0) {
                m.status = 2;
                saveData();
            }
        }

        const card = document.createElement('div');
        card.className = `bg-white rounded-[2.5rem] p-8 shadow-2xl border-4 transition-all duration-500 ${isWashing ? 'working-card' : 'border-transparent'}`;
        
        card.innerHTML = `
            <div class="text-center">
                <p class="text-sm font-bold tracking-widest text-slate-400 uppercase mb-2">${getStatusLabel(m.status)}</p>
                <h2 class="text-3xl font-black text-slate-800 mb-6">${m.id}</h2>
                
                <div class="relative w-32 h-32 mx-auto mb-8 bg-slate-50 rounded-full flex items-center justify-center">
                    <i class="fas fa-compact-disc text-6xl ${isWashing ? 'machine-icon-active' : 'text-slate-200'}"></i>
                </div>

                <div class="bg-slate-900 text-white rounded-3xl py-4 mb-8">
                    <p class="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-1">Remaining Time</p>
                    <p class="text-4xl font-mono font-bold">${isWashing ? timeText : (isFinished ? 'FIN' : '--:--')}</p>
                </div>

                <div class="grid grid-cols-1 gap-3">
                    <button onclick="startLaundry(${index})" ${m.status !== 0 ? 'disabled' : ''} 
                        class="bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition active:scale-95">
                        <i class="fas fa-play mr-2"></i> 開始洗衣 (5分)
                    </button>
                    
                    <button onclick="takeClothes(${index})" ${m.status !== 2 ? 'disabled' : ''} 
                        class="bg-green-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-200 hover:bg-green-600 transition active:scale-95">
                        <i class="fas fa-hand-holding-heart mr-2"></i> 已取走衣物
                    </button>
                </div>
            </div>
        `;
        display.appendChild(card);
    });
}

function startLaundry(index) {
    machines[index].status = 1;
    machines[index].endTime = Date.now() + (5 * 60 * 1000); // 5分鐘
    saveData();
    updateUI();
}

function takeClothes(index) {
    machines[index].status = 0;
    machines[index].endTime = null;
    saveData();
    updateUI();
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(machines));
}

function getStatusLabel(s) {
    return ['● 準備就緒', '● 正在洗滌', '● 洗滌完成', '● 維修中'][s];
}

// 每秒更新一次畫面
setInterval(() => {
    const clock = document.getElementById('clock');
    if(clock) clock.innerText = new Date().toLocaleTimeString('en-GB');
    updateUI();
}, 1000);

// 初始執行
updateUI();
