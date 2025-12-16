// --- 1. 資料模型 ---
const MACHINES_KEY = 'laundry_data_v2';
let machines = JSON.parse(localStorage.getItem(MACHINES_KEY)) || [
    { id: 'A-01', status: 0, endTime: null },
    { id: 'A-02', status: 1, endTime: Date.now() + 900000 },
    { id: 'A-03', status: 2, endTime: Date.now() - 1000 },
    { id: 'B-01', status: 0, endTime: null },
    { id: 'B-02', status: 3, endTime: null },
    { id: 'B-03', status: 0, endTime: null },
];

function saveData() {
    localStorage.setItem(MACHINES_KEY, JSON.stringify(machines));
}

// --- 2. 路由切換 ---
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    
    // 更新導航 UI 顏色
    const buttons = document.querySelectorAll('nav button');
    buttons.forEach(btn => btn.classList.replace('text-blue-600', 'text-slate-400'));
    
    if(tabId === 'dashboard') renderDashboard();
    if(tabId === 'my-laundry') renderMyLaundry();
}

// --- 3. 渲染主頁面 ---
function renderDashboard() {
    const grid = document.getElementById('machine-grid');
    grid.innerHTML = '';
    let freeCount = 0;

    machines.forEach(m => {
        if(m.status === 0) freeCount++;
        const card = document.createElement('div');
        card.className = `bg-white p-5 rounded-2xl shadow-sm card-${m.status} cursor-pointer hover:shadow-lg transition-all active:scale-95`;
        
        let timeLeft = m.endTime ? Math.ceil((m.endTime - Date.now()) / 60000) : 0;
        const statusMap = [
            { t: '空閒中', c: 'text-green-600', i: 'fa-check-circle' },
            { t: '清洗中', c: 'text-red-600', i: 'fa-sync-alt' },
            { t: '待取衣', c: 'text-yellow-600', i: 'fa-clock' },
            { t: '維修中', c: 'text-slate-400', i: 'fa-tools' }
        ];

        card.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="font-black text-xl text-slate-800">${m.id}</h3>
                    <p class="text-xs font-bold ${statusMap[m.status].c} mt-1 uppercase tracking-wider">
                        <i class="fas ${statusMap[m.status].i} mr-1"></i> ${statusMap[m.status].t}
                    </p>
                </div>
                <div class="${m.status === 1 ? 'working-anim' : ''}">
                    <i class="fas fa-washer text-3xl ${m.status === 1 ? 'text-blue-500' : 'text-slate-200'}"></i>
                </div>
            </div>
            <div class="mt-6 flex justify-between items-center border-t pt-4 border-slate-50">
                <span class="text-xs font-bold text-slate-400 uppercase">Status</span>
                <span class="font-mono font-bold ${m.status === 1 ? 'text-blue-600' : 'text-slate-300'}">
                    ${m.status === 1 ? timeLeft + ' MIN LEFT' : '--'}
                </span>
            </div>
        `;
        card.onclick = () => openControl(m.id);
        grid.appendChild(card);
    });
    document.getElementById('header-status').innerText = `空閒：${freeCount} / ${machines.length}`;
}

// --- 4. 機器操作邏輯 ---
function openControl(id) {
    const m = machines.find(item => item.id === id);
    const title = document.getElementById('control-title');
    const statusText = document.getElementById('control-status-text');
    const actions = document.getElementById('control-actions');
    const icon = document.getElementById('control-icon');

    title.innerText = `洗衣機 ${m.id}`;
    actions.innerHTML = '';
    
    // 根據狀態設定控制頁 UI
    if (m.status === 0) {
        statusText.innerText = "目前狀態：空閒 (隨時可開始)";
        icon.className = "fas fa-door-open text-4xl text-green-500";
        actions.innerHTML = `
            <button onclick="updateStatus('${m.id}', 1)" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black shadow-lg shadow-blue-200 transition">
                啟動標準洗 (40分鐘)
            </button>
        `;
    } else if (m.status === 1) {
        statusText.innerText = "目前狀態：運轉中...";
        icon.className = "fas fa-spinner fa-spin text-4xl text-blue-500";
        actions.innerHTML = `<p class="text-center text-slate-400 py-4">請等待洗滌完成</p>`;
    } else if (m.status === 2) {
        statusText.innerText = "目前狀態：已完成 (請儘速取衣)";
        icon.className = "fas fa-tshirt text-4xl text-yellow-500";
        actions.innerHTML = `
            <button onclick="updateStatus('${m.id}', 0)" class="w-full bg-green-500 hover:bg-green-600 text-white py-5 rounded-2xl font-black shadow-lg shadow-green-200 transition">
                我已取走衣物
            </button>
        `;
    } else {
        statusText.innerText = "目前狀態：維修中";
        icon.className = "fas fa-exclamation-triangle text-4xl text-slate-400";
    }

    // 報修按鈕永遠存在
    actions.innerHTML += `
        <button onclick="updateStatus('${m.id}', 3)" class="w-full bg-white text-slate-400 py-3 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition">
            機器故障報修
        </button>
    `;

    switchTab('control');
}

function updateStatus(id, newStatus) {
    const m = machines.find(item => item.id === id);
    m.status = newStatus;
    m.endTime = (newStatus === 1) ? Date.now() + (40 * 60000) : null;
    saveData();
    switchTab('dashboard');
}

// --- 5. 個人中心 ---
function renderMyLaundry() {
    const container = document.getElementById('my-status-container');
    const myItems = machines.filter(m => m.status === 1 || m.status === 2);
    
    if(myItems.length === 0) {
        container.innerHTML = `
            <div class="text-center py-20">
                <i class="fas fa-ghost text-4xl text-slate-200 mb-4"></i>
                <p class="text-slate-400 font-medium">目前沒有您的洗滌任務</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = myItems.map(m => `
        <div class="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-3xl shadow-xl shadow-blue-100">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-black">${m.id}</h3>
                <span class="bg-blue-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">In Progress</span>
            </div>
            <div class="flex items-end gap-2 mb-2">
                <span class="text-5xl font-mono font-black">${m.status === 1 ? Math.max(0, Math.ceil((m.endTime-Date.now())/60000)) : 0}</span>
                <span class="text-xl font-bold opacity-80 mb-1">MIN LEFT</span>
            </div>
            <div class="w-full bg-white/20 h-1.5 rounded-full mt-4 overflow-hidden">
                <div class="bg-white h-full" style="width: 65%"></div>
            </div>
        </div>
    `).join('');
}

// 自動初始化
renderDashboard();
setInterval(renderDashboard, 10000); // 每 10 秒更新一次時間
