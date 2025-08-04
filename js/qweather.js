// 和风天气API集成
class QWeather {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://devapi.qweather.com/v7';
        this.geoBaseUrl = 'https://geoapi.qweather.com/v2';
    }

    // 获取当前位置天气信息
    getCurrentWeather(location) {
        // 使用和风天气API获取当前天气，示例：https://devapi.qweather.com/v7/weather/now?location=101010100&key=30247c73bcce4bb39dde019fa82f69e9
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
    
    // 通过城市名称获取城市ID
    getCityIdByName(cityName) {
        const url = `${this.geoBaseUrl}/city/lookup?location=${cityName}&key=${this.apiKey}`;
        return fetch(url).then(response => response.json());
    }
    
    // 通过经纬度获取城市信息
    getCityByCoordinates(lon, lat) {
        const url = `${this.geoBaseUrl}/city/lookup?location=${lon},${lat}&key=${this.apiKey}`;
        return fetch(url).then(response => response.json());
    }
}

// 天气显示功能
$(document).ready(function() {
    // 和风天气API密钥
    const API_KEY = '30247c73bcce4bb39dde019fa82f69e9';
    
    // 创建和风天气实例
    const qweather = new QWeather(API_KEY);
    
    // 默认城市ID（北京）
    const DEFAULT_CITY_ID = '101010100';
    
    // 获取并显示天气信息
    async function fetchWeatherInfo() {
        try {
            // 首先尝试通过IP获取用户位置
            let cityId = DEFAULT_CITY_ID;
            let cityName = '北京市';

            try {
                // ! 方式A：尝试使用API获取IP和城市信息
                const ipResponse = await fetch('https://api.vvhan.com/api/ipInfo');
                if (!ipResponse.ok) throw new Error('IP API请求失败');
                
                const ipData = await ipResponse.json();
                console.log('方式A：IP定位成功:', ipData);
                
                if (ipData.success && ipData.info.city) {
                    // 使用城市名称获取城市ID
                    const cityData = await qweather.getCityIdByName(ipData.info.city);
                    console.log('方式A：城市信息:', cityData);
                    
                    if (cityData.code === '200' && cityData.location && cityData.location.length > 0) {
                        cityId = cityData.location[0].id;
                        cityName = cityData.location[0].name;
                    }
                }
            } catch (ipError_A) {
                console.warn('方式A：IP API获取位置失败，尝试方式B', ipError_A);

                // ! 方式B：通过经纬度获取城市信息
                try {
                    // 获取访问者IP和地理位置经纬度
                    const response = await fetch('http://ip-api.com/json/');
                    const ipData = await response.json();
                    
                    console.log('IP定位成功:', ipData);
                    if (ipData && ipData.lat && ipData.lon) {
                        // 通过经纬度获取城市信息
                        const cityData = await qweather.getCityByCoordinates(
                            ipData.lon.toFixed(2), 
                            ipData.lat.toFixed(2)
                        );
                        if (cityData.code === '200' && cityData.location && cityData.location.length > 0) {
                            cityId = cityData.location[0].id;
                            cityName = cityData.location[0].name;
                            console.log('方式B：城市信息:', cityData);
                        }
                    }
                } catch (ipError_B) {
                    console.warn('方式B：无法通过IP获取位置信息，尝试方式C', ipError_B);

                    // ! 方式C：使用浏览器内置的Geolocation API
                    if (navigator.geolocation) {
                        try {
                            const position = await new Promise((resolve, reject) => {
                                navigator.geolocation.getCurrentPosition(resolve, reject);
                            });
                            
                            const cityData = await qweather.getCityByCoordinates(
                                position.coords.longitude.toFixed(2),
                                position.coords.latitude.toFixed(2)
                            );
                            if (cityData.code === '200' && cityData.location && cityData.location.length > 0) {
                                cityId = cityData.location[0].id;
                                cityName = cityData.location[0].name;
                                console.log('方式C：城市信息:', cityData);
                            }
                        } catch (geoError_C) {
                            console.warn('方式C：Geolocation API获取位置失败，使用默认城市:', geoError_C);
                        }
                    }
                }
            }
            
            // 获取当前天气信息
            const weatherData = await qweather.getCurrentWeather(cityId);
            console.log('当前天气数据:', weatherData);
            
            if (weatherData.code !== '200') {
                $('#weather-container').html('<span class="error">天气数据加载失败</span>');
                return;
            }

            // 动态创建天气HTML结构
            const container = document.getElementById('weather-container');
            container.innerHTML = `
                <span id="text_city">${cityName}</span>&nbsp;
                <span id="text_icon" class="qi-${weatherData.now.icon} weather-icon"></span> 
                <span id="text_weather">${weatherData.now.text}</span>&nbsp;
                <span id="text_temp">${weatherData.now.temp}°C</span>&nbsp;
                <span id="text_wind">${weatherData.now.windDir}</span>&nbsp;
                <span id="text_wind_speed">${weatherData.now.windScale}级</span>
            `;
        } catch (error) {
            console.error('天气信息获取失败:', error);
            $('#weather-container').html('<span class="error">天气数据加载失败</span>');
            // 显示重试按钮
            $('#weather-container').append('<button class="retry-button" onclick="fetchWeatherInfo()">重试</button>');
        }
    }

    // 页面加载时获取天气信息
    if ($('#weather-container').length > 0) {
        fetchWeatherInfo();
    }
});