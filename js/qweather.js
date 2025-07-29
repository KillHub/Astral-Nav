// 和风天气API集成
class QWeather {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://devapi.qweather.com/v7';
    }

    // 获取当前位置天气信息
    getCurrentWeather(location) {
        const url = `${this.baseUrl}/weather/now?location=${location}&key=${this.apiKey}`;
        return fetch(url).then(response => response.json());
    }

    // 获取未来3天天气预报
    getDailyForecast(location) {
        const url = `${this.baseUrl}/weather/3d?location=${location}&key=${this.apiKey}`;
        return fetch(url).then(response => response.json());
    }

    // 获取空气质量信息
    getAirQuality(location) {
        const url = `${this.baseUrl}/air/now?location=${location}&key=${this.apiKey}`;
        return fetch(url).then(response => response.json());
    }

    // 根据IP地址获取地理位置
    async getLocationByIP(ip = '') {
        const url = `https://geoapi.qweather.com/v2/city/lookup?location=${ip}&key=${this.apiKey}`;
        return fetch(url).then(response => response.json());
    }

    // 根据经纬度获取地理位置
    async getLocationByCoords(lon, lat) {
        const url = `https://geoapi.qweather.com/v2/city/lookup?location=${lon},${lat}&key=${this.apiKey}`;
        return fetch(url).then(response => response.json());
    }
}

// 天气显示功能
$(document).ready(function() {
    // 注意：这里需要替换为您的和风天气API密钥
    // 申请地址：https://dev.qweather.com/
    const API_KEY = '30247C73BCCE4BB39DDE019FA82F69E9';
    
    // 检查是否配置了和风天气API密钥
    const useQWeather = API_KEY && API_KEY !== '30247C73BCCE4BB39DDE019FA82F69E9';
    
    if (useQWeather) {
        const qweather = new QWeather(API_KEY);
        
        // 获取并显示天气信息
        async function fetchWeatherInfo() {
            try {
                // 1. 获取访问者IP
                const ipResponse = await fetch('https://api.vvhan.com/api/ip');
                const ipData = await ipResponse.json();
                const IP = ipData.ip;

                // 2. 根据IP获取地理位置
                const locationData = await qweather.getLocationByIP(IP);
                
                if (locationData.code !== '200' || !locationData.location) {
                    $('#weather-container').html('<span class="error">定位失败</span>');
                    return;
                }

                const location = `${locationData.location[0].lon},${locationData.location[0].lat}`;
                const cityName = locationData.location[0].name;

                // 3. 获取当前天气
                const weatherData = await qweather.getCurrentWeather(location);
                
                if (weatherData.code !== '200') {
                    $('#weather-container').html('<span class="error">天气数据加载失败</span>');
                    return;
                }

                // 4. 获取空气质量
                const airData = await qweather.getAirQuality(location);

                // 5. 动态创建天气HTML结构
                const container = document.getElementById('weather-container');
                container.innerHTML = `
                    <span id="text_city">${cityName}</span>&nbsp;
                    <span id="text_weather">${weatherData.now.text}</span>&nbsp;
                    <span id="text_temp">${weatherData.now.temp}°C</span>&nbsp;
                    <span id="text_wind">${weatherData.now.windDir}</span>&nbsp;
                    <span id="text_wind_speed">${weatherData.now.windScale}级</span>
                    ${airData.code === '200' ? `<span id="text_aqi">AQI ${airData.now.aqi}</span>` : ''}
                `;
            } catch (error) {
                console.error('天气信息获取失败:', error);
                $('#weather-container').html('<span class="error">定位 或 天气数据加载失败</span>');
            }
        }

        // 页面加载时获取天气信息
        if ($('#weather-container').length > 0) {
            fetchWeatherInfo();
        }
    } else {
        // 如果没有配置和风天气API密钥，则使用原有的天气API
        console.log('未配置和风天气API密钥，使用默认天气API');
        
        // 获取访客IP并显示天气信息
        fetch('http://ipwho.is/?output=json&lang=zh-CN')
            .then(response => response.json())
            .then(ipData => {
                const IP = ipData.ip;
                // 调用天气 API
                return fetch(`https://api.vvhan.com/api/weather?ip=${encodeURIComponent(IP)}`)
                    .then(weatherResponse => weatherResponse.json())
                    .then(weatherData => {
                        // 动态创建天气HTML结构
                        const container = document.getElementById('weather-container');
                        container.innerHTML = `
                            <span id="text_city"></span>&nbsp;
                            <span id="text_weather"></span>&nbsp;
                            <span id="text_low"></span>~
                            <span id="text_high"></span>&nbsp;
                            <span id="text_wind"></span>&nbsp;
                            <span id="text_rh"></span>
                        `;
                        // 更新页面天气信息
                        $('#text_city').text(weatherData.city || '未知城市');//城市
                        $('#text_weather').text(weatherData.data?.type || '');//天气
                        $('#text_low').text(weatherData.data?.low || '');//最低气温
                        $('#text_high').text(weatherData.data?.high || '');//最高气温
                        $('#text_wind').text(weatherData.data?.fengxiang || '');//风向
                        $('#text_rh').text(weatherData.data?.fengli || '');//风力
                    });
            })
            .catch(error => {
                $('#weather-container').html('<span class="error">定位 或 天气数据加载失败</span>');
            });
    }
});