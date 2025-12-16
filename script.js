const TOTAL_MINUTES = 5;
const machines = ['m1', 'm2', 'm3'];
let intervals = {}; // 儲存計時器，避免重複執行

function init() {
    machines.forEach(id => {
        const endTime = localStorage.getItem(`laundry_end_${id}`);
        if (endTime) {
            const remaining = Math.floor((parseInt(endTime) - Date.now()) / 1000);
            if (remaining > 0) {
                runTimer(id, parseInt(endTime));
            } else {
                renderFinished(id);
            }
        } else {
            renderAvailable(id);
        }
    });
    updateCounts();
}

function startMachine(id) {
    const endTime = Date.now() + (TOTAL_MINUTES * 60 * 1000);
    localStorage.setItem(`laundry_end_${id}`, endTime);
    runTimer(id, endTime);
    updateCounts();
}

function runTimer(id, endTime) {
    if (intervals[id]) clearInterval(intervals[id]);

    const card = document.getElementById(id);
    card.className = 'card in-use';
    
    // 每秒更新一次介面
    const updateUI = () => {
        const now = Date.now();
        const left = Math.floor((endTime - now) / 1000);

        if (left <= 0) {
            clearInterval(intervals[id]);
            localStorage.setItem(`laundry_end_${id}`, "finished"); // 標記為完成
            renderFinished(id);
            updateCounts();
            return;
        }

        const mins = Math.floor(left / 60);
        const secs = left % 60;
        const percent = ((TOTAL_MINUTES * 60 - left) / (TOTAL_MINUTES * 60)) * 100;

        card.innerHTML = `
            <div class="card-header">
                <h3>洗衣機 ${id.toUpperCase()}</h3>
                <span class="badge">使用中</span>
            </div>
            <div class="progress-bg"><div class="progress-fill" style="width: ${percent}%"></div></div>
            <p>剩餘時間：<strong>${mins} 分 ${secs} 秒</strong></p>
        `;
    };

    updateUI();
    intervals[id] = setInterval(updateUI, 1000);
}

function renderAvailable(id) {
    const card = document.getElementById(id);
    card.className = 'card available';
    card.innerHTML = `
        <div class="card-header">
            <h3>洗衣機 ${id.toUpperCase()}</h3>
            <span class="badge">空閒</span>
        </div>
        <p>目前設備空閒中。</p>
        <button class="btn btn-primary" onclick="startMachine('${id}')">掃碼啟動 (5分鐘)</button>
    `;
}

function renderFinished(id) {
    const card = document.getElementById(id);
    card.className = 'card finished';
    card.innerHTML = `
        <div class="card-header">
            <h3>洗衣機 ${id.toUpperCase()}</h3>
            <span class="badge">請取衣</span>
        </div>
        <p>洗衣完成！請盡速取走衣物。</p>
        <button class="btn btn-finish" onclick="resetMachine('${id}')">我已取件</button>
    `;
}

function resetMachine(id) {
    localStorage.removeItem(`laundry_end_${id}`);
    if (intervals[id]) clearInterval(intervals[id]);
    renderAvailable(id);
    updateCounts();
}

function updateCounts() {
    document.getElementById('count-available').innerText = document.querySelectorAll('.card.available').length;
    document.getElementById('count-inuse').innerText = document.querySelectorAll('.card.in-use').length;
}

window.onload = init;
