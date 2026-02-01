// 全局变量
let etfData = [];
let allCodes = '';
let refreshTimer = null;
let refreshIntervalSeconds = 5; // 默认5秒
let currentSort = { column: null, desc: false };
let highlightKeyword = ''; // 存储高亮关键词
let highlightColumn = 'code'; // 存储高亮列

// DOM 元素
const tableBody = document.getElementById('tableBody');
const infoText = document.getElementById('infoText');
const searchInput = document.getElementById('searchInput');
const searchType = document.getElementById('searchType');
const searchBtn = document.getElementById('searchBtn');
const checkAll = document.getElementById('checkAll');
const headerCheck = document.getElementById('headerCheck');
const copyBtn = document.getElementById('copyBtn');
const saveBtn = document.getElementById('saveBtn');
const saveLocation = document.getElementById('saveLocation');
const rangeLeft = document.getElementById('rangeLeft');
const rangeRight = document.getElementById('rangeRight');
const rangeBtn = document.getElementById('rangeBtn');
const refreshInterval = document.getElementById('refreshInterval');
const refreshBtn = document.getElementById('refreshBtn');
const clearHighlightBtn = document.getElementById('clearHighlightBtn');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadETFData();
    initEventListeners();
    startAutoRefresh();
});

// 事件监听器
function initEventListeners() {
    // 全选复选框
    checkAll.addEventListener('change', handleCheckAll);
    headerCheck.addEventListener('change', handleCheckAll);
    
    // 搜索
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    // 复制
    copyBtn.addEventListener('click', handleCopy);
    
    // 保存
    saveBtn.addEventListener('click', handleSave);
    
    // 勾选范围
    rangeBtn.addEventListener('click', handleRange);
    
    // 刷新间隔设置
    refreshBtn.addEventListener('click', handleRefreshIntervalChange);
    
    // 清除高亮
    clearHighlightBtn.addEventListener('click', handleClearHighlight);
    
    // 表格排序
    document.querySelectorAll('.sortable').forEach(th => {
        th.addEventListener('click', () => {
            const sortType = th.dataset.sort;
            handleSort(sortType);
        });
    });
}

// 加载ETF数据
async function loadETFData() {
    try {
        updateInfo('正在加载数据...请稍后！');
        
        const response = await fetch('https://eq.10jqka.com.cn/open/api/etf_rank/v1/hot.txt');
        const data = await response.json();
        
        if (!data.data || !data.data.list || data.data.list.length === 0) {
            showMessage('Json数据解析错误！', 'error');
            return;
        }
        
        etfData = data.data.list.map((item, index) => ({
            originalIndex: index + 1,  // 保存原始序号
            code: item.code,
            name: item.name,
            price: '-',
            change: '-',
            percent: '-',
            checked: true
        }));
        
        // 生成代码列表
        allCodes = etfData.map(item => {
            const prefix = item.code.startsWith('5') ? 'sh' : 'sz';
            return prefix + item.code;
        }).join(',');
        
        renderTable();
        refreshETFData();
        
    } catch (error) {
        console.error('加载数据失败:', error);
        showMessage('加载数据失败！请检查网络连接。', 'error');
    }
}

// 刷新ETF数据（价格等）
async function refreshETFData() {
    try {
        const url = `https://qt.gtimg.cn/?q=${allCodes}`;
        const response = await fetch(url);
        const text = await response.text();
        
        const dataArray = text.split(';').filter(item => item.trim());
        
        // 创建代码到数据的映射
        const codeToDataMap = {};
        dataArray.forEach(item => {
            const parts = item.split('~');
            if (parts.length < 34) return;
            
            // 提取代码（去掉sh/sz前缀）
            const fullCode = parts[2];
            const code = fullCode.replace(/^(sh|sz)/, '');
            
            codeToDataMap[code] = {
                price: parts[3],
                change: parts[31],
                percent: parts[32]
            };
        });
        
        // 根据代码匹配更新数据
        etfData.forEach(item => {
            const data = codeToDataMap[item.code];
            if (data) {
                item.price = data.price;
                item.change = data.change;
                item.percent = data.percent;
            }
        });
        
        renderTable();
        updateInfo('信息：更新啦！' + new Date().toLocaleString());
        
    } catch (error) {
        console.error('刷新数据失败:', error);
    }
}

// 渲染表格
function renderTable() {
    tableBody.innerHTML = '';
    
    etfData.forEach((item, index) => {
        const row = document.createElement('tr');
        row.dataset.index = index;
        
        const changeValue = parseFloat(item.change);
        let colorClass = 'price-neutral';
        if (changeValue > 0) colorClass = 'price-up';
        else if (changeValue < 0) colorClass = 'price-down';
        
        // 使用显示序号，始终从1开始，不跟随排序变动
        row.innerHTML = `
            <td class="col-check">
                <input type="checkbox" class="row-check" ${item.checked ? 'checked' : ''}>
            </td>
            <td class="col-index">${index + 1}</td>
            <td class="col-code">${item.code}</td>
            <td class="col-name ${colorClass}">${item.name}</td>
            <td class="col-price ${colorClass}">${item.price}</td>
            <td class="col-change ${colorClass}">${item.change}</td>
            <td class="col-percent ${colorClass}">${item.percent}%</td>
        `;
        
        // 如果有高亮关键词，则检查是否需要高亮此行
        if (highlightKeyword && item[highlightColumn].includes(highlightKeyword)) {
            row.classList.add('highlighted');
        }
        
        // 行复选框事件
        const checkbox = row.querySelector('.row-check');
        checkbox.addEventListener('change', (e) => {
            item.checked = e.target.checked;
            updateCheckAllState();
        });
        
        // 双击打开链接
        row.addEventListener('dblclick', () => {
            openETFPage(item.code);
        });
        
        // 右键菜单
        row.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showContextMenu(e, item);
        });
        
        tableBody.appendChild(row);
    });
}

// 全选/取消全选
function handleCheckAll(e) {
    const checked = e.target.checked;
    etfData.forEach(item => item.checked = checked);
    document.querySelectorAll('.row-check').forEach(checkbox => {
        checkbox.checked = checked;
    });
    checkAll.checked = checked;
    headerCheck.checked = checked;
}

// 更新全选状态
function updateCheckAllState() {
    const allChecked = etfData.every(item => item.checked);
    const someChecked = etfData.some(item => item.checked);
    
    checkAll.checked = allChecked;
    headerCheck.checked = allChecked;
    checkAll.indeterminate = someChecked && !allChecked;
    headerCheck.indeterminate = someChecked && !allChecked;
}

// 搜索功能
function handleSearch() {
    const keyword = searchInput.value.trim();
    
    if (!keyword) {
        showMessage('搜索内容不能为空！', 'error');
        return;
    }
    
    // 存储高亮关键词和列
    highlightKeyword = keyword;
    highlightColumn = searchType.value === 'code' ? 'code' : 'name';
    
    updateInfo('信息：搜索中...请稍后！');
    
    // 清除之前的高亮
    document.querySelectorAll('tbody tr').forEach(row => {
        row.classList.remove('highlighted');
    });
    
    let findCount = 0;
    
    document.querySelectorAll('tbody tr').forEach((row, index) => {
        const cellValue = etfData[index][highlightColumn];
        if (cellValue.includes(highlightKeyword)) {
            row.classList.add('highlighted');
            findCount++;
        }
    });
    
    // 如果找到了匹配项，则显示清除高亮按钮
    if (findCount > 0) {
        clearHighlightBtn.classList.remove('btn-hidden');
    }
    
    updateInfo(`信息：搜索完毕！找到${findCount}条数据`);
}

// 复制功能
function handleCopy() {
    const checkedItems = etfData.filter(item => item.checked);
    
    if (checkedItems.length === 0) {
        showMessage('请勾选数据！', 'error');
        return;
    }
    
    const result = checkedItems.map(item => `${item.code}\t${item.name}`).join('\n');
    
    copyToClipboard(result);
    showMessage('复制成功！', 'success');
}

// 保存功能
function handleSave() {
    const checkedItems = etfData.filter(item => item.checked);
    
    if (checkedItems.length === 0) {
        showMessage('请勾选数据！', 'error');
        return;
    }
    
    const result = checkedItems.map(item => `${item.code}\t${item.name}`).join('\n');
    
    if (saveLocation.value === 'copy') {
        copyToClipboard(result);
        showMessage('已复制到剪贴板！', 'success');
    } else {
        downloadFile(result, '【ETF保存数据】.txt');
        showMessage('保存成功，请查看下载文件夹！', 'success');
    }
}

// 勾选范围
function handleRange() {
    const startTime = performance.now();
    
    const left = parseInt(rangeLeft.value) || 1;
    const right = parseInt(rangeRight.value) || 20;
    
    etfData.forEach((item, index) => {
        const rowIndex = index + 1;
        item.checked = (rowIndex >= left && rowIndex <= right);
    });
    
    document.querySelectorAll('.row-check').forEach((checkbox, index) => {
        checkbox.checked = etfData[index].checked;
    });
    
    updateCheckAllState();
    
    const elapsed = (performance.now() - startTime).toFixed(2);
    updateInfo(`信息：勾选完毕！运行耗时：${elapsed}毫秒`);
}

// 修改刷新间隔
function handleRefreshIntervalChange() {
    const newInterval = parseInt(refreshInterval.value) || 5;
    
    if (newInterval < 1 || newInterval > 60) {
        showMessage('刷新间隔需在1-60秒之间！', 'error');
        refreshInterval.value = refreshIntervalSeconds;
        return;
    }
    
    refreshIntervalSeconds = newInterval;
    
    // 重新启动定时器
    if (refreshTimer) {
        clearInterval(refreshTimer);
    }
    startAutoRefresh();
    
    showMessage(`刷新间隔已设置为${refreshIntervalSeconds}秒`, 'success');
}

// 清除高亮
function handleClearHighlight() {
    // 清除高亮关键词
    highlightKeyword = '';
    highlightColumn = 'code';
    
    // 清除所有行的高亮
    document.querySelectorAll('tbody tr').forEach(row => {
        row.classList.remove('highlighted');
    });
    
    // 隐藏清除高亮按钮
    clearHighlightBtn.classList.add('btn-hidden');
    
    showMessage('已清除高亮', 'success');
}

// 排序功能
function handleSort(column) {
    // 更新排序状态
    if (currentSort.column === column) {
        currentSort.desc = !currentSort.desc;
    } else {
        currentSort.column = column;
        currentSort.desc = false;
    }
    
    // 更新排序图标
    document.querySelectorAll('.sort-icon').forEach(icon => {
        icon.className = 'sort-icon';
    });
    
    const activeHeader = document.querySelector(`[data-sort="${column}"] .sort-icon`);
    if (activeHeader) {
        activeHeader.classList.add(currentSort.desc ? 'desc' : 'asc');
    }
    
    // 执行排序
    etfData.sort((a, b) => {
        let valA = a[column];
        let valB = b[column];
                
        // 数值类型排序
        if (column === 'price' || column === 'change' || column === 'percent') {
            valA = parseFloat(valA) || 0;
            valB = parseFloat(valB) || 0;
        }
                
        if (valA < valB) return currentSort.desc ? 1 : -1;
        if (valA > valB) return currentSort.desc ? -1 : 1;
        return 0;
    });
            
    // 重新渲染表格
    renderTable();
}

// 打开ETF页面
function openETFPage(code) {
    const prefix = code.startsWith('5') ? 'sh' : 'sz';
    const url = `http://quote.eastmoney.com/bond/${prefix}${code}.html`;
    window.open(url, '_blank');
}

// 右键菜单
function showContextMenu(e, item) {
    // 移除已存在的菜单
    const existingMenu = document.querySelector('.context-menu');
    if (existingMenu) existingMenu.remove();
    
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.style.left = e.pageX + 'px';
    menu.style.top = e.pageY + 'px';
    menu.innerHTML = `
        <ul>
            <li data-action="open">走势(东方财富)</li>
            <li data-action="copy">复制ETF代码 + ETF名称</li>
        </ul>
    `;
    
    document.body.appendChild(menu);
    menu.style.display = 'block';
    
    menu.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        if (action === 'open') {
            openETFPage(item.code);
        } else if (action === 'copy') {
            copyToClipboard(`${item.code}\t${item.name}`);
            showMessage('复制成功！', 'success');
        }
        menu.remove();
    });
    
    // 点击其他地方关闭菜单
    document.addEventListener('click', () => menu.remove(), { once: true });
}

// 判断是否在交易时间
function isTradingTime() {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    // 周一到周五
    if (day >= 1 && day <= 5) {
        // 上午 9:14 到 11:31
        if ((hour === 9 && minute >= 14) || hour === 10 || (hour === 11 && minute <= 31)) {
            return true;
        }
        // 下午 12:59 到 15:02
        if ((hour === 12 && minute >= 59) || hour === 13 || hour === 14 || (hour === 15 && minute <= 2)) {
            return true;
        }
    }
    return false;
}

// 自动刷新
function startAutoRefresh() {
    refreshTimer = setInterval(() => {
        if (isTradingTime()) {
            refreshETFData();
        }
    }, refreshIntervalSeconds * 1000); // 转换为毫秒
}

// 工具函数
function updateInfo(text) {
    infoText.textContent = text;
}

function showMessage(text, type) {
    updateInfo('信息：' + text);
    
    // 简单的提示效果
    const color = type === 'error' ? '#FF0000' : '#008000';
    infoText.style.color = color;
    
    setTimeout(() => {
        infoText.style.color = '#008000';
    }, 2000);
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
    } else {
        // 兼容方案
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 页面关闭时清理定时器
window.addEventListener('beforeunload', () => {
    if (refreshTimer) {
        clearInterval(refreshTimer);
    }
});
