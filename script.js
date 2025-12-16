/* 全域設定 */
:root {
    --primary-color: #3498db;
    --success-color: #2ecc71;
    --warning-color: #f1c40f;
    --danger-color: #e74c3c;
    --bg-color: #f4f7f6;
    --text-color: #2c3e50;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    margin: 0;
    line-height: 1.6;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

/* 頁首 */
header {
    background: linear-gradient(135deg, #2980b9, #3498db);
    color: white;
    text-align: center;
    padding: 40px 0;
    margin-bottom: 30px;
}

header h1 { margin: 0; font-size: 2.5rem; }

/* 狀態摘要 */
.status-summary {
    display: flex;
    justify-content: space-around;
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    margin-bottom: 30px;
}

.summary-item { text-align: center; }
.summary-item .label { display: block; font-size: 0.9rem; color: #7f8c8d; }
.summary-item .value { font-size: 1.5rem; font-weight: bold; color: var(--primary-color); }

/* 機器卡片網格 */
.machine-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

.machine-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    transition: transform 0.3s;
}

.machine-card:hover { transform: translateY(-5px); }

.card-header {
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
}

.card-header h3 { margin: 0; font-size: 1.1rem; }

.badge {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
    color: white;
}

.card-body { padding: 20px; }

/* 不同狀態的顏色 */
.available .badge { background-color: var(--success-color); }
.in-use .badge { background-color: var(--danger-color); }
.finished .badge { background-color: var(--warning-color); }

/* 進度條 */
.progress-container {
    background: #ecf0f1;
    height: 10px;
    border-radius: 5px;
    margin-top: 10px;
}

.progress-bar {
    background: var(--primary-color);
    height: 100%;
    border-radius: 5px;
    transition: width 0.5s;
}

/* 按鈕 */
.btn {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 10px;
}

.btn-start { background-color: var(--primary-color); color: white; }
.btn-finish { background-color: var(--warning-color); color: #2c3e50; }
