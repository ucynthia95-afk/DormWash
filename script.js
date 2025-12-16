/**
 * 模擬啟動機器
 * @param {string} id - 機器卡片的 ID
 */
function startMachine(id) {
    const card = document.getElementById(id);
    
    // 改變狀態
    card.classList.remove('available');
    card.classList.add('in-use');
    
    // 更新標籤內容
    card.querySelector('.badge').innerText = '使用中';
    
    // 更新內部文字與按鈕
    const statusText = card.querySelector('.status-text');
    statusText.innerHTML = `預計剩餘：<span class="timer">40</span> 分鐘`;
    
    // 隱藏啟動按鈕
    const btn = card.querySelector('.btn');
    if (btn) btn.style.display = 'none';

    // 插入模擬進度條
    const progressDiv = document.createElement('div');
    progressDiv.className = 'progress-bg';
    progressDiv.innerHTML = '<div class="progress-fill" style="width: 5%; transition: width 2s;"></div>';
    card.insertBefore(progressDiv, statusText);

    // 模擬成功反饋
    console.log(`Machine ${id} started.`);
    alert("掃描成功！系統已開始計時。");
    
    updateGlobalCounts();
}

/**
 * 模擬重設機器（完成取件）
 */
function resetMachine(id) {
    const card = document.getElementById(id);
    
    card.classList.remove('finished', 'in-use');
    card.classList.add('available');
    
    card.querySelector('.badge').innerText = '空閒';
    card.querySelector('.status-text').innerText = '目前設備空閒中，歡迎使用。';
    
    // 恢復按鈕
    let btn = card.querySelector('.btn');
    btn.className = 'btn btn-primary';
    btn.innerText = '模擬掃碼啟動';
    btn.setAttribute('onclick', `startMachine('${id}')`);
    
    alert("感謝您的配合，機器已標示為空閒。");
    updateGlobalCounts();
}

/**
 * 更新頂部統計數字
 */
function updateGlobalCounts() {
    const available = document.querySelectorAll('.card.available').length;
    const inUse = document.querySelectorAll('.card.in-use').length;
    
    document.getElementById('count-available').innerText = available;
    document.getElementById('count-inuse').innerText = inUse;
}

// 初始化
window.onload = updateGlobalCounts;
