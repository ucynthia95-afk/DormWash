// --- 1. 資料初始化 ---
const MACHINES_KEY = 'laundry_data';
let machines = JSON.parse(localStorage.getItem(MACHINES_KEY)) || [
    { id: 'Balcony A-01', status: 0, endTime: null },
    { id: 'Balcony A-02', status: 1, endTime: Date.now() + 1200000 }, // 20分後
    { id: 'Balcony A-03', status: 2, endTime: Date.now() - 5000 },
    { id: 'Balcony B-01', status: 0, endTime: null },
    { id: 'Balcony B-02', status: 3, endTime: null },
    { id: 'Balcony B-03', status: 0, endTime: null },
];

function saveData() {
    localStorage.setItem(MACHINES_KEY, JSON.stringify(machines));
}

// --- 2. 頁面切換 ---
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    
    // 更新導航列顏色
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.replace('text-blue-600', 'text-slate-400'));
    
    if(tabId === 'my-laundry') renderMyLaundry();
    renderDashboard();
}

// --- 3. 渲染首頁 ---
function renderDashboard() {
    const grid = document.getElementById('machine-grid');
    if(!grid) return;
    grid.innerHTML = '';
    let freeCount = 0;

    machines.forEach(m => {
        if(m.status === 0) freeCount++;
        const card = document.createElement('div');
        card.className = `bg-white p-4 rounded-xl shadow-sm border-status-${m.status} cursor-pointer hover:shadow-md transition`;
        
        let timeLeft = m.endTime ? Math.ceil((m.endTime - Date.now()) / 60000) : 0;
        let statusText = ['🟢 空閒', '🔴 使用中', '🟡 洗好待取', '🔧 維修中'][m.status];
        let statusColorClass = ['text-green-600', 'text-red-600', 'text-yellow-600', 'text-slate-500'][m.status];

        card.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <p class="text-xs text-slate-400 font-mono">${m.id}</p>
                    <h3 class="font-bold text-slate-800">洗衣機 ${m.id.split('-')[1]}</h3>
                </div>
                <i class="fas fa-washer text-2xl ${m.status === 1 ? 'working-anim text-blue-500' : 'text-slate-300'}"></i>
            </div>
            <div class="mt-3 flex justify-between items-end">
                <span class="text-sm font-medium ${statusColorClass}">${statusText}</span>
                <div class="text-right">
                    <p class="text-xs text-slate-400">${m.status === 1 ? '預計結束' : ''}</p>
                    <p class="text-sm font-bold text-blue-600">${m.status === 1 ? timeLeft + ' min' : '--'}</p>
                </div>
            </div>
        `;
        card.onclick = () => openControl(m.id);
        grid.appendChild(card);
    });
    document.getElementById('header-status').innerText = `目前空閒：${freeCount} / ${machines.length}`;
}

// --- 4. 機器操作 ---
function openControl(id) {
    const m = machines.find(item => item.id === id);
    document.getElementById('control-title').innerText = `${m.id}`;
    const actions = document.getElementById('control-actions');
    actions.innerHTML = '';

    if (m.status === 0) {
        actions.innerHTML = `<button onclick="updateMachineStatus('${m.id}', 1)" class="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg">開始洗衣 (40分鐘)</button>`;
    } else if (m.status === 2) {
        actions.innerHTML = `<button onclick="updateMachineStatus('${m.id}', 0)" class="w-full bg-green-500 text-white py-4 rounded-xl font-bold shadow-lg">我已取走衣物</button>`;
    }
    actions.innerHTML += `<button onclick="updateMachineStatus('${m.id}', 3)" class="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-medium">報修按鈕</button>`;
    
    switchTab('control');
}

function updateMachineStatus(id, newStatus) {
    const m = machines.find(item => item.id === id);
    m.status = newStatus;
    m.endTime = (newStatus === 1) ? Date.now() + (40 * 60000) : null;
    saveData();
    switchTab('dashboard');
}

// --- 5. 個人中心渲染 ---
function renderMyLaundry() {
    const container = document.getElementById('my-status-container');
    const myItems = machines.filter(m => m.status === 1 || m.status === 2);
    
    if(myItems.length === 0) {
        container.innerHTML = `<p class="text-center text-slate-400 py-10">目前沒有洗滌中的衣物</p>`;
        return;
    }
    container.innerHTML = myItems.map(m => `
        <div class="bg-blue-600 text-white p-6 rounded-2xl shadow-xl">
            <h3 class="text-2xl font-bold mb-2">${m.id}</h3>
            <div class="bg-blue-500 rounded-lg p-3">
                <p class="text-3xl font-mono">${m.status === 1 ? Math.max(0, Math.ceil((m.endTime-Date.now())/60000)) : 0} <span class="text-lg">min</span></p>
            </div>
        </div>
    `).join('');
}

function simulateScan() {
    const randomIdx = Math.floor(Math.random() * machines.length);
    openControl(machines[randomIdx].id);
}

// 初始化啟動
renderDashboard();
setInterval(renderDashboard, 30000); // 每 30 秒自動更新時間
