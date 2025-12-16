const TOTAL_SECONDS = 300; // 5 分鐘
const machines = ['m1', 'm2', 'm3'];
let intervals = {};

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
    const endTime = Date.now() + (TOTAL_SECONDS * 1000);
    localStorage.setItem(`laundry_end_${id}`, endTime);
    runTimer(id, endTime);
    updateCounts();
}

function runTimer(id, endTime) {
    if (intervals[id]) clearInterval(intervals[id]);
    const card = document.getElementById(id);
    
    const updateUI = () => {
        const now = Date.now();
        const left = Math.floor((endTime - now) / 1000);

        if (left <= 0) {
            clearInterval(intervals[id]);
            renderFinished(id);
            updateCounts();
            return;
        }

        const mins = Math.floor(left / 60);
        const secs = left % 60;
        const percent = ((TOTAL_SECONDS - left) / TOTAL_SECONDS) * 100;

        card.className = 'card in-use';
        card.innerHTML = `
            <div class="card-header">
                <h3>洗衣機 ${id.toUpperCase()}</h3>
                <span class="badge">使用中</span>
            </div>
            <div class="progress-bg"><div class="progress-fill" style="width: ${percent}%"></div></div>
            <p>剩餘時間：<strong>${mins} 分 ${secs} 秒</strong></p>
            <button class="btn btn-danger" onclick="resetMachine('${id}')">強制重設 (Demo用)</button>
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
        <p>洗衣完成！請取走衣物以釋放機器。</p>
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
