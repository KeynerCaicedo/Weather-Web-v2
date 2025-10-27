// API Configuration
const API_CONFIG = {
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    API_KEY: import.meta.env.VITE_WEATHER_API_KEY, 
    UNITS: 'metric',
    LANG: 'es'
};



// Cache system
const weatherCache = {
    data: new Map(),
    set: function(key, data) {
        this.data.set(key, {
            data,
            timestamp: Date.now()
        });
    },
    get: function(key) {
        const item = this.data.get(key);
        if (!item) return null;
        
        // Cache válido por 10 minutos
        const isExpired = Date.now() - item.timestamp > 10 * 60 * 1000;
        return isExpired ? null : item.data;
    },
    clear: function() {
        this.data.clear();
    }
};

class WeatherAPI {
    constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.apiKey = API_CONFIG.API_KEY;
    console.log("API KEY CARGADA:", this.apiKey);
}

    async makeRequest(endpoint, params = {}) {
        const url = new URL(`${this.baseURL}${endpoint}`);
        const searchParams = new URLSearchParams({
            appid: this.apiKey,
            units: API_CONFIG.UNITS,
            lang: API_CONFIG.LANG,
            ...params
        });
        
        url.search = searchParams.toString();

        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw new Error('No se pudo conectar con el servicio del clima');
        }
    }

    async getWeatherByCity(city) {
        const cacheKey = `city_${city.toLowerCase()}`;
        const cached = weatherCache.get(cacheKey);
        
        if (cached) {
            console.log('Returning cached data for:', city);
            return cached;
        }

        const data = await this.makeRequest('/weather', { q: city });
        weatherCache.set(cacheKey, data);
        return data;
    }

    async getWeatherByCoords(lat, lon) {
        const cacheKey = `coords_${lat}_${lon}`;
        const cached = weatherCache.get(cacheKey);
        
        if (cached) {
            console.log('Returning cached data for coordinates');
            return cached;
        }

        const data = await this.makeRequest('/weather', { lat, lon });
        weatherCache.set(cacheKey, data);
        return data;
    }

    async getForecast(city) {
        return await this.makeRequest('/forecast', { q: city });
    }
}

export { WeatherAPI, weatherCache };