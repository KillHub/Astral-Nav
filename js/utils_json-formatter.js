document.addEventListener("DOMContentLoaded", function () {
  // 新增：历史记录、导入/导出、错误高亮相关
  const importBtn = document.getElementById("import-btn");
  const exportBtn = document.getElementById("export-btn");
  const importFile = document.getElementById("import-file");
  const historyBtn = document.getElementById("history-btn");
  const historyModal = document.getElementById("history-modal");
  const historyList = document.getElementById("history-list");
  const closeHistory = document.getElementById("close-history");
  const clearHistory = document.getElementById("clear-history");
  const jsonError = document.getElementById("json-error");

  // 错误高亮
  function showError(msg) {
    if (jsonError) jsonError.textContent = msg;
    jsonInput.style.borderColor = 'red';
  }
  function clearError() {
    if (jsonError) jsonError.textContent = '';
    jsonInput.style.borderColor = '';
  }

  // 历史记录
  function saveHistory(str) {
    let history = JSON.parse(localStorage.getItem('jsonHistory') || '[]');
    if (str && !history.includes(str)) {
      history.unshift(str);
      if (history.length > 10) history = history.slice(0, 10);
      localStorage.setItem('jsonHistory', JSON.stringify(history));
    }
  }
  function renderHistory() {
    let history = JSON.parse(localStorage.getItem('jsonHistory') || '[]');
    historyList.innerHTML = '';
    if (history.length === 0) {
      historyList.innerHTML = '<li style="list-style:none;color:#888;">暂无历史</li>';
      return;
    }
    history.forEach((item, idx) => {
      const li = document.createElement('li');
      li.style.cssText = 'border-bottom:1px solid #eee;padding:6px 0;cursor:pointer;white-space:pre-wrap;';
      li.textContent = item.length > 200 ? item.slice(0,200)+'...':item;
      li.title = '点击恢复';
      li.onclick = () => {
        jsonInput.value = item;
        formatJSON();
        historyModal.style.display = 'none';
      };
      historyList.appendChild(li);
    });
  }
  if (historyBtn) historyBtn.onclick = () => {
    renderHistory();
    historyModal.style.display = 'block';
  };
  if (closeHistory) closeHistory.onclick = () => { historyModal.style.display = 'none'; };
  if (clearHistory) clearHistory.onclick = () => {
    localStorage.removeItem('jsonHistory');
    renderHistory();
  };

  // 导入/导出
  if (importBtn) importBtn.onclick = () => importFile.click();
  if (importFile) importFile.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      jsonInput.value = reader.result;
      formatJSON();
    };
    reader.readAsText(file);
  };
  if (exportBtn) exportBtn.onclick = () => {
    const blob = new Blob([jsonInput.value], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'data.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  let isCollapsed = false; // 初始状态为未折叠

  // JSON格式化功能
  const jsonInput = document.getElementById("json-input");
  const jsonOutputContainer = document.getElementById("json-output");
  const formatBtn = document.getElementById("format-btn");
  const minifyBtn = document.getElementById("minify-btn");
  const copyBtn = document.getElementById("copy-btn");
  const collapseBtn = document.getElementById("collapse-btn");
  const clearBtn = document.getElementById("clear-btn");
  const maximizeBtn = document.getElementById("maximize-btn");
  const restoreBtn = document.getElementById("restore-btn");
  const dragbar = document.getElementById("dragbar");
  const inputPane = document.getElementById("input-pane");
  const outputPane = document.getElementById("output-pane");

  // 初始化面板宽度
  function initializePanels() {
    inputPane.style.width = "49.8%";  // 50% - dragbar宽度的一半
    outputPane.style.width = "49.8%"; // 50% - dragbar宽度的一半
  }

  // 页面加载时初始化面板
  initializePanels();

  // 创建JSON编辑器实例
  const options = {
    mode: "view",
    modes: ["view"], // 只读模式
    onError: function (err) {
      alert("JSON格式不正确：" + err.toString());
    },
    navigationBar: false,
    statusBar: false,
    mainMenuBar: false,
  };
  const jsonEditor = new JSONEditor(jsonOutputContainer, options);

  function formatJSON() {
    try {
      const json = JSON.parse(jsonInput.value);
      jsonInput.value = JSON.stringify(json, null, 4);
      jsonEditor.set(json);
      isCollapsed = false;
      collapseBtn.innerHTML = '<i class="fas fa-compress-arrows-alt"></i> 折叠';
      clearError();
      saveHistory(jsonInput.value);
    } catch (e) {
      jsonEditor.setText("JSON格式不正确：" + e.message);
      showError(e.message);
    }
  }

  function minifyJSON() {
    try {
      const json = JSON.parse(jsonInput.value);
      jsonInput.value = JSON.stringify(json);
      jsonEditor.set(json);
      clearError();
      saveHistory(jsonInput.value);
    } catch (e) {
      jsonEditor.setText("JSON格式不正确：" + e.message);
      showError(e.message);
    }
  }

  function collapseJSON() {
    if (!isCollapsed) {
      jsonEditor.collapseAll();
      collapseBtn.innerHTML = '<i class="fas fa-expand-arrows-alt"></i> 展开';
    } else {
      jsonEditor.expandAll();
      collapseBtn.innerHTML = '<i class="fas fa-compress-arrows-alt"></i> 折叠';
    }
    isCollapsed = !isCollapsed; // 切换状态
  }

  function copyJSON() {
    const text = JSON.stringify(jsonEditor.get(), null, 4);
    navigator.clipboard.writeText(text).then(
      () => {
        alert("已复制到剪贴板");
      },
      () => {
        alert("复制失败");
      }
    );
  }

  function clearJSON() {
    jsonInput.value = "";
    jsonEditor.set({});
    isCollapsed = false;
    collapseBtn.innerHTML = '<i class="fas fa-compress-arrows-alt"></i> 折叠';
    clearError();
  }

  // 自动格式化
  jsonInput.addEventListener("input", () => {
    formatJSON();
  });

  formatBtn.addEventListener("click", formatJSON);
  minifyBtn.addEventListener("click", minifyJSON);
  collapseBtn.addEventListener("click", collapseJSON);
  copyBtn.addEventListener("click", copyJSON);
  clearBtn.addEventListener("click", clearJSON);

  // 最大化功能
  maximizeBtn.addEventListener("click", () => {
    document.body.classList.add("maximized");
    // 确保工具栏和按钮可见
    document.querySelector('.toolbar').style.visibility = 'visible';
    maximizeBtn.style.display = "none";
    restoreBtn.style.display = "inline-block";
  });

  restoreBtn.addEventListener("click", () => {
    document.body.classList.remove("maximized");
    maximizeBtn.style.display = "inline-block";
    restoreBtn.style.display = "none";
  });

  // 监听 Esc 键恢复窗口
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.body.classList.contains("maximized")) {
      document.body.classList.remove("maximized");
      maximizeBtn.style.display = "inline-block";
      restoreBtn.style.display = "none";
    }
  });

  // 拖动分割条调整布局
  dragbar.addEventListener("mousedown", (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
  });

  function resize(e) {
    const containerWidth = inputPane.parentNode.offsetWidth;
    const newWidth = (e.clientX / containerWidth) * 100;
    if (newWidth > 10 && newWidth < 90) {
      inputPane.style.flexBasis = `${newWidth}%`;
      outputPane.style.flexBasis = `${100 - newWidth}%`;
    }
  }

  function stopResize() {
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResize);
  }

  // 初始格式化
  formatJSON();
}); 