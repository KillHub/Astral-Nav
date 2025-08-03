// 搜索联想功能实现
$(document).ready(function() {
    const searchInput = $('#search-text');
    const suggestionBox = $('<div id="search-suggestions" class="suggestion-box"></div>');
    let suggestionIndex = -1;
    let suggestions = [];
    
    // 将建议框添加到搜索框下方
    searchInput.parent().append(suggestionBox);
    
    // 监听输入事件
    searchInput.on('input', function() {
        const query = $(this).val().trim();
        
        if (query.length > 0) {
            // 获取搜索建议
            getSuggestions(query);
        } else {
            // 隐藏建议框
            hideSuggestions();
        }
    });
    
    // 监听键盘事件
    searchInput.on('keydown', function(e) {
        const suggestionItems = suggestionBox.find('.suggestion-item');
        
        switch(e.keyCode) {
            case 38: // 上箭头
                e.preventDefault();
                suggestionIndex = suggestionIndex <= 0 ? suggestionItems.length - 1 : suggestionIndex - 1;
                updateSuggestionSelection();
                break;
                
            case 40: // 下箭头
                e.preventDefault();
                suggestionIndex = suggestionIndex >= suggestionItems.length - 1 ? 0 : suggestionIndex + 1;
                updateSuggestionSelection();
                break;
                
            case 13: // 回车
                e.preventDefault();
                if (suggestionIndex >= 0 && suggestionIndex < suggestions.length) {
                    searchInput.val(suggestions[suggestionIndex]);
                    hideSuggestions();
                    $('#super-search-fm').submit();
                } else {
                    $('#super-search-fm').submit();
                }
                break;
                
            case 27: // ESC
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
    
    // 监听表单提交事件，确保使用正确的搜索词
    $('#super-search-fm').on('submit', function(e) {
        // 如果有选中的建议项，使用建议项的值作为搜索词
        if (suggestionIndex >= 0 && suggestionIndex < suggestions.length) {
            searchInput.val(suggestions[suggestionIndex]);
        }
        
        // 获取当前选中的搜索类型
        const selectedType = $('.search-type input:checked').val();
        const searchQuery = searchInput.val();
        
        // 修改表单的action
        $(this).attr('action', selectedType);
        
        // 根据不同的搜索类型添加正确的参数名
        if (selectedType) {
            // 清除所有可能的参数
            $(this).find('input[type="hidden"]').remove();
            
            if (selectedType.includes('baidu.com')) {
                $(this).append('<input type="hidden" name="wd" value="' + searchQuery + '">');
            } 
            else if (selectedType.includes('google.com')) {
                $(this).append('<input type="hidden" name="q" value="' + searchQuery + '">');
            }
            else if (selectedType.includes('github.com')) {
                $(this).append('<input type="hidden" name="q" value="' + searchQuery + '">');
            }
            else if (selectedType.includes('bilibili.com')) {
                $(this).append('<input type="hidden" name="keyword" value="' + searchQuery + '">');
            }
            else if (selectedType.includes('taobao.com')) {
                $(this).append('<input type="hidden" name="q" value="' + searchQuery + '">');
            }
            else if (selectedType.includes('jd.com')) {
                $(this).append('<input type="hidden" name="keyword" value="' + searchQuery + '">');
            }
            else if (selectedType.includes('zhihu.com')) {
                $(this).append('<input type="hidden" name="q" value="' + searchQuery + '">');
            }
            else if (selectedType.includes('douban.com')) {
                $(this).append('<input type="hidden" name="q" value="' + searchQuery + '">');
            }
            else if (selectedType.includes('zhaopin.com') || selectedType.includes('51job.com') || 
                     selectedType.includes('lagou.com') || selectedType.includes('liepin.com') ||
                     selectedType.includes('zhipin.com')) {
                $(this).append('<input type="hidden" name="keyword" value="' + searchQuery + '">');
            }
            else {
                // 默认使用q参数
                $(this).append('<input type="hidden" name="q" value="' + searchQuery + '">');
            }
        }
    });
    
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