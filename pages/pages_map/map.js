(function ($) {
    var map, district, polygons = [], districtList = [];
    var marker = new AMap.Marker();
    var title = "";
    var content = [];
    var geocoder = new AMap.Geocoder({
        //city: "010", //城市设为北京，无参数默认："全国"
    });
    
    // 初始化下拉框函数
    function initSelects() {
        // 初始化省份下拉框
        var provinceSelect = document.getElementById('province');
        provinceSelect.innerHTML = '';
        var defaultOption = new Option('--请选择--', '');
        provinceSelect.add(defaultOption);
        for (var i = 0; i < provinceArray.length; i++) {
            var adcode = provinceArray[i].adcode;
            // 放宽adcode的过滤条件，只要存在就添加
            if (adcode) {
                var option = new Option(provinceArray[i].name, adcode);
                option.setAttribute("data-level", provinceArray[i].level);
                option.setAttribute("data-center", JSON.stringify(provinceArray[i].center));
                option.setAttribute("data-name", provinceArray[i].name);
                provinceSelect.add(option);
            }
        }

        // 初始化城市下拉框
        var citySelect = document.getElementById('city');
        citySelect.innerHTML = '';
        citySelect.add(new Option('--请选择--', ''));

        // 初始化区县下拉框
        var districtSelect = document.getElementById('district');
        districtSelect.innerHTML = '';
        districtSelect.add(new Option('--请选择--', ''));

        // 省份选择变化时加载对应城市
        provinceSelect.addEventListener('change', function() {
            var selectedOption = this.options[this.selectedIndex];
            var provinceCode = this.value;
            var center = selectedOption.getAttribute("data-center");
            
            citySelect.innerHTML = '';
            citySelect.add(new Option('--请选择--', ''));
            districtSelect.innerHTML = '';
            districtSelect.add(new Option('--请选择--', ''));
            
            if (provinceCode) {
                // 定位到省份
                if (center) {
                    var centerObj = JSON.parse(center);
                    map.setCenter([centerObj.lng, centerObj.lat]);
                    map.setZoom(7);
                }
                
                // 高亮省份
                if (!district) {
                    district = new AMap.DistrictSearch({
                        subdistrict: 0,
                        extensions: 'all',
                        level: 'province'
                    });
                }
                district.setLevel('province');
                district.setExtensions('all');
                district.search(provinceCode, function(status, result) {
                    if (status === 'complete' && result.districtList && result.districtList[0]) {
                        highlightDistrictArea(result.districtList[0]);
                    } else {
                        clearMapOverlays();
                    }
                });
                
                // 联动城市
                var cities = cityArray.filter(function(city) {
                    // 统一数据类型进行比较
                    return city.parentcode == provinceCode;
                });
                cities.forEach(function(city) {
                    var adcode = city.adcode;
                    // 放宽adcode的过滤条件
                    if (adcode) {
                        var option = new Option(city.name, adcode);
                        option.setAttribute("data-level", city.level);
                        option.setAttribute("data-center", JSON.stringify(city.center));
                        option.setAttribute("data-name", city.name);
                        citySelect.add(option);
                    }
                });
            } else {
                clearMapOverlays();
            }
        });

        // 城市选择变化时加载对应区县
        citySelect.addEventListener('change', function() {
            var selectedOption = this.options[this.selectedIndex];
            var cityCode = this.value;
            var center = selectedOption.getAttribute("data-center");
            
            districtSelect.innerHTML = '';
            districtSelect.add(new Option('--请选择--', ''));
            
            if (cityCode) {
                // 定位到城市
                if (center) {
                    var centerObj = JSON.parse(center);
                    map.setCenter([centerObj.lng, centerObj.lat]);
                    map.setZoom(9);
                }
                
                // 高亮城市
                if (!district) {
                    district = new AMap.DistrictSearch({
                        subdistrict: 0,
                        extensions: 'all',
                        level: 'city'
                    });
                }
                district.setLevel('city');
                district.setExtensions('all');
                district.search(cityCode, function(status, result) {
                    if (status === 'complete' && result.districtList && result.districtList[0]) {
                        highlightDistrictArea(result.districtList[0]);
                    } else {
                        clearMapOverlays();
                    }
                });
                
                // 联动区县
                var districts = districtArray.filter(function(district) {
                    // 统一数据类型进行比较
                    return district.parentcode == cityCode;
                });
                districts.forEach(function(district) {
                    var adcode = district.adcode;
                    // 放宽adcode的过滤条件
                    if (adcode) {
                        var option = new Option(district.name, adcode);
                        option.setAttribute("data-level", district.level);
                        option.setAttribute("data-center", JSON.stringify(district.center));
                        option.setAttribute("data-name", district.name);
                        districtSelect.add(option);
                    }
                });
            } else {
                clearMapOverlays();
            }
        });

        // 区县选择变化时定位到区县
        districtSelect.addEventListener('change', function() {
            var selectedOption = this.options[this.selectedIndex];
            var districtCode = this.value;
            var center = selectedOption.getAttribute("data-center");

            if (districtCode) {
                // 定位到区县
                if (center) {
                    var centerObj = JSON.parse(center);
                    map.setCenter([centerObj.lng, centerObj.lat]);
                    map.setZoom(11);
                }
                
                // 高亮区县
                if (!district) {
                    district = new AMap.DistrictSearch({
                        subdistrict: 0,
                        extensions: 'all',
                        level: 'district'
                    });
                }
                district.setLevel('district');
                district.setExtensions('all');
                district.search(districtCode, function(status, result) {
                    if (status === 'complete' && result.districtList && result.districtList[0]) {
                        highlightDistrictArea(result.districtList[0]);
                    } else {
                        clearMapOverlays();
                    }
                });
            } else {
                clearMapOverlays();
            }
        });
    }
    
    // 高亮显示区域（同时显示边界线和高亮整个区域）
    function highlightDistrictArea(data) {
        // 确保数据有效
        if (!data || !data.boundaries) {
            console.log('没有边界数据可用于高亮显示');
            return;
        }
        
        // 清除现有的多边形覆盖物
        clearMapOverlays();
        
        var bounds = data.boundaries;
        if (bounds && bounds.length > 0) {
            for (var i = 0, l = bounds.length; i < l; i++) {
                // 创建蓝色边界线
                var borderPolygon = new AMap.Polygon({
                    map: map,
                    strokeWeight: 3,  // 加粗边界线
                    strokeColor: '#0091ea',  // 蓝色边界
                    strokeOpacity: 0.8,  // 边界透明度
                    fillColor: 'transparent',
                    fillOpacity: 0,
                    path: bounds[i],
                    zIndex: 10
                });
                
                // 创建绿色透明背景
                var highlightPolygon = new AMap.Polygon({
                    map: map,
                    strokeWeight: 0,
                    strokeColor: 'transparent',
                    fillColor: '#00FF00',  // 绿色填充
                    fillOpacity: 0.3,  // 透明度
                    path: bounds[i],
                    zIndex: 5
                });
                
                polygons.push(borderPolygon);
                polygons.push(highlightPolygon);
            }
            map.setFitView(); // 地图自适应
            console.log('成功高亮显示区域: ' + data.name);
        } else {
            console.log('边界数据为空');
        }
    }
    
    // 清除地图上的覆盖物
    function clearMapOverlays() {
        // 清除标记
        if (marker) {
            map.remove(marker);
        }
        
        // 清除多边形
        for (var i = 0, l = polygons.length; i < l; i++) {
            if (polygons[i]) {
                polygons[i].setMap(null);
            }
        }
        polygons = [];
    }
    
    // 将 initPage 函数附加到 window 对象上，使其成为全局函数
    window.initPage = function (options) {
        if (typeof InitData != "undefined") {
            alert('参数错误!');
            return;
        } else {
            if (typeof $("#container").html() == "undefined") {
                alert("没有在DOM页中找到ID为container的div元素，地图将不会渲染");
                return;
            } else {
                // 初始化下拉框
                initSelects();
                map = new AMap.Map('container', {
                    resizeEnable: true,
                    center: [116.30946, 39.937629],
                    zoom: 5
                });
                //加载相关组件
                AMapUI.load(['ui/geo/DistrictCluster', 'ui/misc/PointSimplifier', 'lib/$'], function (DistrictCluster, PointSimplifier, $) {
                    //启动页面
                    init(DistrictCluster, PointSimplifier, $, options);
                    //行政区划查询
                    var opts = {
                        subdistrict: 3,   //返回下一级行政区
                        showbiz: true  //最后一级返回街道信息
                    };
                    district = new AMap.DistrictSearch(opts);//注意：需要使用插件同步下发功能才能这样直接使用
                    district.search('中国', function (status, result) {
                        if (status == 'complete') {
                            getData(result.districtList[0]);
                        }
                    });
                });
            }
        }
    };

    // 同时保持 jQuery 插件形式的 initPage
    $.fn.initPage = function (options) {
        window.initPage(options);
    };

    function getData(data, level) {
        var bounds = data.boundaries;
        if (bounds) {
            for (var i = 0, l = bounds.length; i < l; i++) {
                // 创建蓝色边界线
                var borderPolygon = new AMap.Polygon({
                    map: map,
                    strokeWeight: 2,
                    strokeColor: '#0091ea',
                    strokeOpacity: 0.8,
                    fillColor: 'transparent',
                    fillOpacity: 0,
                    path: bounds[i],
                    zIndex: 10
                });
                
                // 创建绿色透明背景
                var highlightPolygon = new AMap.Polygon({
                    map: map,
                    strokeWeight: 0,
                    strokeColor: 'transparent',
                    fillColor: '#00FF00',
                    fillOpacity: 0.3,
                    path: bounds[i],
                    zIndex: 5
                });
                
                polygons.push(borderPolygon);
                polygons.push(highlightPolygon);
            }
            map.setFitView(); //地图自适应
        }
        //清空下一级别的下拉列表
        if (level == 'province') {
            $("#city").empty();
            $("#district").empty();
        } else if (level == 'city') {
            $("#district").empty();
        }
        var subList = data.districtList;
        if (subList) {
            if (level != 'district') {
                //为了界面加载速度，层级只到区县 不到街道
                var contentSub = new Option('--请选择--');
                var curlevel = subList[0].level;
                var curList = document.querySelector('#' + curlevel);
                curList.add(contentSub);
                for (var i = 0, l = subList.length; i < l; i++) {
                    var name = subList[i].name;
                    var levelSub = subList[i].level;
                    var cityCode = subList[i].citycode;
                    contentSub = new Option(name);
                    contentSub.setAttribute("value", levelSub);
                    contentSub.center = subList[i].center;
                    contentSub.adcode = subList[i].adcode;
                    curList.add(contentSub);
                }
            }
        }
    }
    $.fn.setProvnceCenter = function (obj) {
        //清除地图上所有覆盖物
        clearMarker(); //清除标记
        for (var i = 0, l = polygons.length; i < l; i++) {
            polygons[i].setMap(null);
        }
        var option = obj[obj.options.selectedIndex];
        var keyword = option.text; //关键字
        var adcode = option.adcode;
        district.setLevel(option.value); //行政区级别
        district.setExtensions('all');
        //行政区查询
        //按照adcode进行查询可以保证数据返回的唯一性
        district.search(adcode, function (status, result) {
            if (status === 'complete') {
                getData(result.districtList[0], obj.id);
                map.setCenter(obj[obj.options.selectedIndex].center)
                map.setZoom(5);
            }
        });
    }
    $.fn.setCityCenter = function (obj) {
        //清除地图上所有覆盖物
        clearMarker(); //清除标记
        for (var i = 0, l = polygons.length; i < l; i++) {
            polygons[i].setMap(null);
        }
        var option = obj[obj.options.selectedIndex];
        var keyword = option.text; //关键字
        var adcode = option.adcode;
        district.setLevel(option.value); //行政区级别
        district.setExtensions('all');
        district.search(adcode, function (status, result) {
            if (status === 'complete') {
                getData(result.districtList[0], obj.id);
                map.setCenter(obj[obj.options.selectedIndex].center)
                map.setZoom(9);
            }
        });
    }
    $.fn.setDistrictCenter = function (obj) {
        //清除地图上所有覆盖物
        clearMarker(); //清除标记
        for (var i = 0, l = polygons.length; i < l; i++) {
            polygons[i].setMap(null);
        }
        var option = obj[obj.options.selectedIndex];
        var keyword = option.text; //关键字
        var adcode = option.adcode;
        district.setLevel(option.value); //行政区级别
        district.setExtensions('all');
        district.search(adcode, function (status, result) {
            if (status === 'complete') {
                getData(result.districtList[0], obj.id);
                map.setCenter(obj[obj.options.selectedIndex].center)
                map.setZoom(11);
            }
        });
    }

    function init(DistrictCluster, PointSimplifier, $, initdata) {
        var data = [];
        $('<div id="loadingTip">加载数据，请稍候...</div>').appendTo(document.body);
        var pointSimplifierIns = new PointSimplifier({
            map: map, //所属的地图实例
            autoSetFitView: true,
            zIndex: 110,
            getPosition: function (item) {
                if (!item) {
                    return null;
                }
                var parts = item.split(',');
                //返回经纬度
                return [parseFloat(parts[0]), parseFloat(parts[1])];
            },
            getHoverTitle: function (dataItem, idx) {
                var G = dataItem.split(",");
                var PointCenter = {
                    Q: G[1],
                    R: G[0],
                    lat: G[1],
                    lng: G[0],
                }
                map.setCenter(PointCenter)
                var itemdetail = initdata[idx];

                //实例化信息窗体
                var title = itemdetail.title,
                    content = [];
                if (itemdetail.logoURL == "") {
                    content.push("地址：" + itemdetail.province + itemdetail.city + itemdetail.district + itemdetail.address);
                } else {
                    content.push("<img src='" + itemdetail.logoURL + "'>地址：" + itemdetail.province + itemdetail.city + itemdetail.district + itemdetail.address);
                }
                content.push(itemdetail.desc);
                content.push("<a href='" + itemdetail.redirectURL + "'>" + itemdetail.redirecttitle + "</a>");
                var infoWindow = new AMap.InfoWindow({
                    isCustom: true, //使用自定义窗体
                    content: createInfoWindow(title, content.join("<br/>")),
                    offset: new AMap.Pixel(16, -45)
                });
                var position = new AMap.LngLat(G[0], G[1]);
                infoWindow.open(map, position);
                console.log(itemdetail); //hover的时候获取当前点的明细，从初始化数据中获取
                return idx + ': ' + dataItem;
            },
            renderOptions: {
                //点的样式
                pointStyle: {
                    width: 6,
                    height: 6,
                    fillStyle: 'rgba(153, 0, 153, 0.38)'
                },
                //鼠标hover时的title信息
                clickTitleStyle: {
                    position: 'top'
                }
            }
        });
        var excludedList = [];
        for (var h = 0; h < provinceArray.length; h++) {
            var isHas = 0;
            for (var d = 0; d < initdata.length; d++) {
                if (provinceArray[h].name == initdata[d].province) {
                    isHas = 1;
                    break;
                }
            }
            if (isHas == 0) {
                excludedList.push(provinceArray[h].adcode);
            }
        }
        for (var h = 0; h < cityArray.length; h++) {
            var isHas = 0;
            for (var d = 0; d < initdata.length; d++) {
                if (cityArray[h].name == initdata[d].city) {
                    isHas = 1;
                    break;
                }
            }
            if (isHas == 0) {
                excludedList.push(cityArray[h].adcode);
            }
        }
        for (var h = 0; h < districtArray.length; h++) {
            var isHas = 0;
            for (var d = 0; d < initdata.length; d++) {
                if (districtArray[h].name == initdata[d].district) {
                    isHas = 1;
                    break;
                }
            }
            if (isHas == 0) {
                excludedList.push(districtArray[h].adcode);
            }
        }
        var distCluster = new DistrictCluster({
            zIndex: 100,
            map: map, //所属的地图实例
            excludedAdcodes: excludedList,
            getPosition: function (item) {
                if (!item) {
                    return null;
                }
                var parts = item.split(',');
                //返回经纬度
                return [parseFloat(parts[0]), parseFloat(parts[1])];
            }
        });
        for (var I = 0; I < initdata.length; I++) {
            data.push(initdata[I].lng + "," + initdata[I].lat);
        }
        window.distCluster = distCluster;
        $('#loadingTip').remove();
        distCluster.setData(data);
        pointSimplifierIns.setData(data);
        map.setZoom(4)

        function refresh() {
            var zoom = map.getZoom();
            //获取 pointStyle
            var pointStyle = pointSimplifierIns.getRenderOptions().pointStyle;
            //根据当前zoom调整点的尺寸
            pointStyle.width = pointStyle.height = 2 * Math.pow(1.2, map.getZoom() - 3);
            var zoom = map.getZoom();
            if (zoom < 10) {
                pointSimplifierIns.hide();
                //当地图缩小或放大时 隐藏提示框
                $(".amap-info").css("display", "none");
            } else {
                pointSimplifierIns.show();
            }
        }
        map.on('zoomchange', function () {
            refresh();
        });
        refresh();
    }
    //定位到详细地址
    $.fn.geoCode = function (selectSingleAddress) {
        //实例化信息窗体
        clearMarker();
        closeInfoWindow();
        var title = selectSingleAddress.title;
        var address = selectSingleAddress.province + selectSingleAddress.city + selectSingleAddress.district + selectSingleAddress.address;
        if (selectSingleAddress.logoURL == "") {
            content.push("地址：" + address);
        } else {
            content.push("<img src='" + selectSingleAddress.logoURL + "'>地址：" + address);
        }
        content.push(selectSingleAddress.desc);
        content.push("<a href='" + selectSingleAddress.redirectURL + "'>" + selectSingleAddress.redirecttitle + "</a>");
        var infoWindow = new AMap.InfoWindow({
            isCustom: true, //使用自定义窗体
            content: createInfoWindow(title, content.join("<br/>")),
            offset: new AMap.Pixel(16, -45)
        });
        geocoder.getLocation(address, function (status, result) {
            if (status === 'complete' && result.geocodes.length) {
                var lnglat = result.geocodes[0].location
                marker.setPosition(lnglat);
                map.add(marker);
                map.setFitView(marker);
                AMap.event.addListener(marker, 'click', function () {
                    infoWindow.open(map, marker.getPosition());
                });
                infoWindow.open(map, marker.getPosition());
            } else {
                log.error('根据地址查询位置失败');
            }
        });
    }
    //构建自定义信息窗体
    function createInfoWindow(title, content) {
        var info = document.createElement("div");
        info.className = "custom-info input-card content-window-card";
        //可以通过下面的方式修改自定义窗体的宽高
        //info.style.width = "400px";
        // 定义顶部标题
        var top = document.createElement("div");
        var titleD = document.createElement("div");
        var closeX = document.createElement("img");
        top.className = "info-top";
        titleD.innerHTML = title;
        closeX.src = "https://webapi.amap.com/images/close2.gif";
        closeX.onclick = closeInfoWindow;
        top.appendChild(titleD);
        top.appendChild(closeX);
        info.appendChild(top);
        // 定义中部内容
        var middle = document.createElement("div");
        middle.className = "info-middle";
        middle.style.backgroundColor = 'white';
        middle.innerHTML = content;
        info.appendChild(middle);
        // 定义底部内容
        var bottom = document.createElement("div");
        bottom.className = "info-bottom";
        bottom.style.position = 'relative';
        bottom.style.top = '0px';
        bottom.style.margin = '0 auto';
        var sharp = document.createElement("img");
        sharp.src = "https://webapi.amap.com/images/sharp.png";
        bottom.appendChild(sharp);
        info.appendChild(bottom);
        return info;
    }
    $.fn.gotoLocation = function (csv, opt) {
        var locationDataList = []; //当前位置包含了那些数据
        AMap.plugin('AMap.Geolocation', function () {
            var geolocation = new AMap.Geolocation({
                enableHighAccuracy: true, //是否使用高精度定位，默认:true
                timeout: 10000, //超过10秒后停止定位，默认：5s
                buttonPosition: 'RB', //定位按钮的停靠位置
                buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                zoomToAccuracy: false, //定位成功后是否自动调整地图视野到定位点，
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition(function (status, result) {
                if (status == 'complete') {
                    map.setZoom(12);
                    //搜索当前定位城市的门店结果，从initData中获取
                    var acode = result.addressComponent.district
                    $("#gLocationTable").empty();
                    for (var i = 0; i < csv.length; i++) {
                        if (csv[i].district == acode) {
                            locationDataList.push(csv[i])
                            var itemdetail = csv[i];
                            if (opt.showList == true) {
                                $("#localPanel").css('display', 'block');
                                var item = '<tr class="gLocation" accesskey="' + itemdetail.ID + '">';
                                item += '<td style="width:30%;border-bottom:1px solid;cursor:pointer"><img class="logoURL"  src="' + itemdetail.logoURL + '"/></td>';
                                item += '<td style="width:70%;border-bottom:1px solid;cursor:pointer">';
                                item += '<p class="title">' + itemdetail.title + '</p>';
                                item += '<p class="address">' + itemdetail.province + itemdetail.city + itemdetail.district + itemdetail.address + '</p>';
                                item += '<p class="desc">' + itemdetail.desc + '</p>';
                                item += '<p class="redirecttitle" style="display:none">' + itemdetail.redirecttitle + '</p>';
                                item += '<p class="redirectURL"  style="display:none">' + itemdetail.redirectURL + '</p>';
                                item += '<p class="provincetemp" style="display:none">' + itemdetail.province + '</p>';
                                item += '<p class="citytemp"  style="display:none">' + itemdetail.city + '</p>';
                                item += '<p class="districttemp" style="display:none">' + itemdetail.district + '</p>';
                                item += '<p class="addresstemp"  style="display:none">' + itemdetail.address + '</p>';
                                item += '</td>';
                                item += '</tr>';
                                $("#gLocationTable").append(item);
                            } else {
                                $("#localPanel").css('display', 'none');
                            }
                            //实例化信息窗体
                            var title = itemdetail.title,
                                content = [];
                            if (itemdetail.logoURL == "") {
                                content.push("地址：" + itemdetail.province + itemdetail.city + itemdetail.district + itemdetail.address);
                            } else {
                                content.push("<img src='" + itemdetail.logoURL + "'>地址：" + itemdetail.province + itemdetail.city + itemdetail.district + itemdetail.address);
                            }
                            content.push(itemdetail.desc);
                            content.push("<a href='" + itemdetail.redirectURL + "'>" + itemdetail.redirecttitle + "</a>");
                            var infoWindow = new AMap.InfoWindow({
                                isCustom: true, //使用自定义窗体
                                content: createInfoWindow(title, content.join("<br/>")),
                                offset: new AMap.Pixel(16, -45)
                            });
                            var position = new AMap.LngLat(itemdetail.lng, itemdetail.lat);
                            infoWindow.open(map, position);
                        }
                    }
                } else {
                    log.error('定位失败');
                }
            });
        });
    }
    //关闭信息窗体
    function closeInfoWindow() {
        content = []; //清空窗体信息记录
        map.clearInfoWindow();
    }
    //清除 marker
    function clearMarker() {
        map.remove(marker);
    }
})(jQuery);
$(function () {
    $("body").on("click", ".gLocation", function () {
        $(".gLocation").css("background-color", "#fff")
        var ID = $(this).attr("accesskey");
        var title = $(this).children(0).find(".title").html();
        var address = $(this).find(".address").html();
        var desc = $(this).find(".desc").html();
        var logoURL = $(this).find(".logoURL").attr("src");
        var redirecttitle = $(this).find(".redirecttitle").html();
        var redirectURL = $(this).find(".redirectURL").html();
        var provincetemp = $(this).find(".provincetemp").html();
        var citytemp = $(this).find(".citytemp").html();
        var districttemp = $(this).find(".districttemp").html();
        var addresstemp = $(this).find(".addresstemp").html();
        console.log(logoURL);
        $.fn.geoCode({
            "ID": ID, //必填
            "title": title, //可为空
            "logoURL": logoURL, //可为空
            "desc": desc, //可为空
            "redirecttitle": redirecttitle, //可为空
            "redirectURL": redirectURL, //可为空
            "lat": "", //可为空
            "lng": "", //可为空
            "province": provincetemp, //必填
            "city": citytemp, //必填
            "district": districttemp, //必填
            "address": addresstemp //必填
        });
    });
});