// --- 資料初始化 ---
const STORAGE_KEY = 'quick_test_laundry';
let machines = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
    { id: 'A-01', status: 0, endTime: null },
    { id: 'A-02', status: 0, endTime: null },
    { id: 'A-03', status: 0, endTime: null }
];

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(machines));
}

// --- 渲染 UI ---
function renderUI() {
    const container = document.getElementById('machine-container');
    container.innerHTML = '';
    
    let freeCount = 0;
    let workingCount = 0;

    machines.forEach((m, index) => {
        if(m.status === 0) freeCount++;
        if(m.status === 1) workingCount++;

        // 計算剩餘秒數，提供更精確的倒數感受
        const totalMsLeft = m.endTime ? Math.max(0, m.endTime - Date.now()) : 0;
        const minsLeft = Math.floor(totalMsLeft / 60000);
        const secsLeft = Math.floor((totalMsLeft % 60000) / 1000);
        
        const card = document.createElement('div');
        card.className = `machine-card bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border-2 ${m.status === 1 ? 'border-blue-500' : 'border-transparent'}`;

        let actionButtons = '';
        if (m.status === 0) {
            actionButtons = `<button onclick="startMachine(${index})" class="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">開始洗衣 (5m)</button>`;
        } else if (m.status === 1) {
            actionButtons = `<button class="w-full bg-slate-100 text-slate-400 py-3 rounded-xl font-bold cursor-not-allowed italic">清洗中...</button>`;
        } else if (m.status === 2) {
            actionButtons = `<button onclick="resetMachine(${index})" class="w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition shadow-lg shadow-green-100">取走衣物</button>`;
        } else {
            actionButtons = `<button class="w-full bg-slate-200 text-slate-500 py-3 rounded-xl font-bold cursor-not-allowed">維修中</button>`;
        }

        card.innerHTML = `
            <div class="flex justify-between items-start mb-6">
                <div>
                    <div class="flex items-center text-xs font-bold mb-1">
                        <span class="status-dot dot-${m.status}"></span>
                        <span class="text-slate-400 uppercase tracking-tighter">${getStatusText(m.status)}</span>
                    </div>
                    <h2 class="text-2xl font-black text-slate-800">${m.id}</h2>
                </div>
                <i class="fas fa-washer text-4xl text-slate-200 ${m.status === 1 ? 'is-working' : ''}"></i>
            </div>

            <div class="mb-6 bg-slate-50 rounded-2xl p-4 text-center">
                <p class="text-xs font-bold text-slate-400 uppercase mb-1">剩餘時間</p>
                <p class="text-3xl font-mono font-black ${m.status === 1 ? 'text-blue-600' : 'text-slate-300'}">
                    ${m.status === 1 ? `${minsLeft}:${secsLeft.toString().padStart(2, '0')}` : '00:00'}
                </p>
            </div>

            <div class="space-y-2">
                ${actionButtons}
                <button onclick="reportRepair(${index})" class="w-full text-slate-300 text-[10px] font-bold hover:text-red-400 transition uppercase tracking-widest">
                    ${m.status === 3 ? '故障中' : '報修按鈕'}
                </button>
            </div>
        `;
        container.appendChild(card);
    });

    document.getElementById('stat-free').innerText = freeCount;
    document.getElementById('stat-working').innerText = workingCount;
}

// --- 操作邏輯 ---
function startMachine(index) {
    machines[index].status = 1;
    // 設定為 5 分鐘後的 Unix 時間戳
    machines[index].endTime = Date.now() + (5 * 60000); 
    saveData();
    renderUI();
}

function resetMachine(index) {
    machines[index].status = 0;
    machines[index].endTime = null;
    saveData();
    renderUI();
}

function reportRepair(index) {
    machines[index].status = 3;
    machines[index].endTime = null;
    saveData();
    renderUI();
}

function getStatusText(s) {
    const texts = ['Available', 'Washing', 'Finished', 'Repair'];
    return texts[s];
}

// --- 每秒鐘檢查狀態並更新時鐘 ---
function tick() {
    const now = new Date();
    document.getElementById('time-display').innerText = now.toLocaleTimeString('en-GB');
    
    let needsReRender = false;
    machines.forEach(m => {
        if (m.status === 1 && Date.now() >= m.endTime) {
            m.status = 2; // 時間到自動轉為待取衣
            needsReRender = true;
        }
    });

    if (needsReRender) saveData();
    renderUI(); // 每秒渲染一次以維持倒數秒數更新
}

// 初始化
setInterval(tick, 1000);
tick();
