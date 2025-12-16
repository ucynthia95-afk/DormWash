// 初始化：從 localStorage 讀取狀態，否則設為空閒
const machines = ['m1', 'm2', 'm3'];

function init() {
    machines.forEach(id => {
        const endTime = localStorage.getItem(`laundry_end_${id}`);
        if (endTime) {
            const remaining = Math.floor((parseInt(endTime) - Date.now()) / 1000);
            if (remaining > 0) {
                updateToInUse(id, remaining, parseInt(endTime));
            } else {
                updateToFinished(id);
            }
        }
    });
    updateCounts();
}

function startMachine(id, minutes) {
    const duration = minutes * 60; // 轉為秒
    const endTime = Date.now() + duration * 1000;
    
    localStorage.setItem(`laundry_end_${id}`, endTime);
    updateToInUse(id, duration, endTime);
    updateCounts();
}

function updateToInUse(id, secondsLeft, endTime) {
    const card = document.getElementById(id);
    card.className = 'card in-use';
    card.querySelector('.badge').innerText = '使用中';
    
    const content = card.querySelector('.card-content');
    content.innerHTML = `
        <div class="progress-bg"><div id="bar-${id}" class="progress-fill"></div></div>
        <p>剩餘時間：<span id="time-${id}">--</span> 分鐘</p>
    `;

    // 啟動定時器
    const timerInterval = setInterval(() => {
        const now = Date.now();
        const left = Math.floor((endTime - now) / 1000);

        if (left <= 0) {
            clearInterval(timerInterval);
            updateToFinished(id);
            updateCounts();
        } else {
            const mins = Math.ceil(left / 60);
            document.getElementById(`time-${id}`).innerText = mins;
            // 模擬進度條（40分鐘固定比例，這裡簡化處理）
            const percent = Math.max(0, 100 - (left / (40 * 60)) * 100);
            document.getElementById(`bar-${id}`).style.width = percent + '%';
        }
    }, 1000);
}

function updateToFinished(id) {
    const card = document.getElementById(id);
    card.className = 'card finished';
    card.querySelector('.badge').innerText = '請取衣';
    card.querySelector('.card-content').innerHTML = `
        <p>洗衣完成！請盡速取走衣物。</p>
        <button class="btn btn-finish" onclick="resetMachine('${id}')">我已取件</button>
    `;
}

function resetMachine(id) {
    localStorage.removeItem(`laundry_end_${id}`);
    const card = document.getElementById(id);
    card.className = 'card available';
    card.querySelector('.badge').innerText = '空閒';
    card.querySelector('.card-content').innerHTML = `
        <p>目前設備空閒中。</p>
        <button class="btn btn-primary" onclick="startMachine('${id}', 40)">掃碼啟動 (40分鐘)</button>
    `;
    updateCounts();
}

function updateCounts() {
    document.getElementById('count-available').innerText = document.querySelectorAll('.card.available').length;
    document.getElementById('count-inuse').innerText = document.querySelectorAll('.card.in-use').length;
}

window.onload = init;
