/**
 * ============================================================
 * 搜索联想（搜索建议）功能实现
 * ============================================================
 * 数据源：百度搜索建议 API（JSONP）
 * 交互：↑/↓ 选择联想词，Enter 搜索，ESC 关闭，点击空白处关闭
 *
 * 说明：表单提交（拼接 URL 跳转）由 js/script_function.js 统一处理，
 *       本文件只负责联想词的获取、展示与选择。
 * ============================================================
 */
$(document).ready(function() {
    const searchInput = $('#search-text');
    const suggestionBox = $('<div id="search-suggestions" class="suggestion-box"></div>');
    let suggestionIndex = -1;
    let suggestions = [];
    let debounceTimer = null; // 防抖定时器

    // 将建议框添加到搜索框下方
    searchInput.parent().append(suggestionBox);

    // 监听输入事件（300ms 防抖，避免每次击键都请求联想 API）
    searchInput.on('input', function() {
        const query = $(this).val().trim();
        clearTimeout(debounceTimer);

        if (query.length > 0) {
            debounceTimer = setTimeout(function() {
                getSuggestions(query);
            }, 300);
        } else {
            // 隐藏建议框
            hideSuggestions();
        }
    });

    // 监听键盘事件（使用 e.key，原 e.keyCode 已被标准废弃）
    searchInput.on('keydown', function(e) {
        const suggestionItems = suggestionBox.find('.suggestion-item');

        switch(e.key) {
            case 'ArrowUp': // 上箭头
                e.preventDefault();
                suggestionIndex = suggestionIndex <= 0 ? suggestionItems.length - 1 : suggestionIndex - 1;
                updateSuggestionSelection();
                break;

            case 'ArrowDown': // 下箭头
                e.preventDefault();
                suggestionIndex = suggestionIndex >= suggestionItems.length - 1 ? 0 : suggestionIndex + 1;
                updateSuggestionSelection();
                break;

            case 'Enter': // 回车
                e.preventDefault();
                if (suggestionIndex >= 0 && suggestionIndex < suggestions.length) {
                    searchInput.val(suggestions[suggestionIndex]);
                    hideSuggestions();
                }
                // 提交逻辑统一由 script_function.js 的 submit 处理器完成
                $('#super-search-fm').submit();
                break;

            case 'Escape': // ESC
                hideSuggestions();
                break;
        }
    });
    
    // 点击建议项
    suggestionBox.on('click', '.suggestion-item', function() {
        const value = $(this).data('value');
        searchInput.val(value);
        hideSuggestions();
        $('#super-search-fm').submit();
    });
    
    // 点击页面其他区域隐藏建议框
    $(document).on('click', function(e) {
        if (!searchInput.is(e.target) && !suggestionBox.is(e.target) && suggestionBox.has(e.target).length === 0) {
            hideSuggestions();
        }
    });
    
    // NOTE: 原表单 submit 处理器（按站点拼接 hidden 参数）已移除——
    //       与 script_function.js 的提交逻辑职责重复，且实际跳转由后者完成，
    //       此处注入的 hidden 参数从未生效。联想词选中时已写回输入框，无需重复处理。
    
    // 获取搜索建议
    function getSuggestions(query) {
        // 使用百度搜索建议API
        $.ajax({
            url: 'https://suggestion.baidu.com/su',
            dataType: 'jsonp',
            jsonp: 'cb',
            data: {
                wd: query
            },
            success: function(data) {
                if (data.s.length > 0) {
                    suggestions = data.s;
                    showSuggestions(suggestions);
                } else {
                    hideSuggestions();
                }
            },
            error: function() {
                hideSuggestions();
            }
        });
    }
    
    // 显示搜索建议
    function showSuggestions(suggestions) {
        suggestionBox.empty();
        
        suggestions.forEach(function(suggestion, index) {
            const item = $('<div class="suggestion-item" data-value="' + suggestion + '">' + suggestion + '</div>');
            suggestionBox.append(item);
        });
        
        suggestionBox.show();
        suggestionIndex = -1;
    }
    
    // 隐藏搜索建议
    function hideSuggestions() {
        suggestionBox.hide();
        suggestionBox.empty();
        suggestionIndex = -1;
        suggestions = [];
    }
    
    // 更新选中项
    function updateSuggestionSelection() {
        const suggestionItems = suggestionBox.find('.suggestion-item');
        suggestionItems.removeClass('selected');
        
        if (suggestionIndex >= 0) {
            const selectedItem = $(suggestionItems[suggestionIndex]);
            selectedItem.addClass('selected');
            searchInput.val(selectedItem.data('value'));
        }
    }
});

// 添加样式
$(document).ready(function() {
    if ($('#search-suggestion-style').length === 0) {
        const style = `
            <style id="search-suggestion-style">
            .suggestion-box {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 5px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 9999;
                max-height: 300px;
                overflow-y: auto;
                display: none;
                margin-top: 5px;
            }
            
            .night .suggestion-box {
                background: rgba(30, 30, 30, 0.95);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
            
            .suggestion-item {
                padding: 10px 15px;
                cursor: pointer;
                transition: background 0.2s;
                border-bottom: 1px solid rgba(0, 0, 0, 0.05);
                color: #333;
            }
            
            .night .suggestion-item {
                color: #fff;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }
            
            .suggestion-item:last-child {
                border-bottom: none;
            }
            
            .suggestion-item:hover,
            .suggestion-item.selected {
                background: rgba(74, 107, 223, 0.1);
            }
            
            .night .suggestion-item:hover,
            .night .suggestion-item.selected {
                background: rgba(74, 107, 223, 0.3);
            }
            </style>
        `;
        $('head').append(style);
    }
});