class WeatherUI {
    constructor() {
        this.elements = {
            cityInput: document.getElementById('cityInput'),
            searchBtn: document.getElementById('searchBtn'),
            locationBtn: document.getElementById('locationBtn'),
            weatherResult: document.getElementById('weatherResult'),
            loading: document.getElementById('loading'),
            error: document.getElementById('error')
        };
    }

    showLoading() {
    this.hideError();
    this.hideWeather();
    this.elements.loading.classList.add('show');
    }

    hideLoading() {
    this.elements.loading.classList.remove('show');
    }

    showError(message) {
    this.hideLoading();
    this.hideWeather();
    this.elements.error.textContent = message;
    this.elements.error.classList.add('show');
    }

    hideError() {
    this.elements.error.classList.remove('show');
    }

    showWeather(data) {
    this.hideLoading();
    this.hideError();

    const weatherHTML = this.generateWeatherHTML(data);
    this.elements.weatherResult.innerHTML = weatherHTML;
    this.elements.weatherResult.classList.add('show');
    }

    hideWeather() {
    this.elements.weatherResult.classList.remove('show');
    }

    generateWeatherHTML(data) {
        const {
            name: city,
            sys: { country },
            main: { temp, feels_like, humidity, pressure },
            weather: [{ main: condition, description, icon }],
            wind: { speed: windSpeed },
            visibility,
            dt: timestamp
        } = data;

        const date = new Date(timestamp * 1000).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <div class="weather-card">
                <div class="weather-header">
                    <h2 class="city-name">${city}, ${country}</h2>
                    <p class="current-date">${date}</p>
                </div>
                
                <div class="weather-main">
                    <div class="temperature-section">
                        <div class="current-temp">${Math.round(temp)}°C</div>
                        <div class="weather-condition">
                            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" 
                                alt="${description}" class="weather-icon">
                            <span class="condition-text">${this.capitalizeFirst(description)}</span>
                        </div>
                        <div class="feels-like">Sensación térmica: ${Math.round(feels_like)}°C</div>
                    </div>
                    
                    <div class="weather-details">
                        <div class="detail-item">
                            <i class="fas fa-tint"></i>
                            <div class="detail-info">
                                <span class="detail-label">Humedad</span>
                                <span class="detail-value">${humidity}%</span>
                            </div>
                        </div>
                        
                        <div class="detail-item">
                            <i class="fas fa-wind"></i>
                            <div class="detail-info">
                                <span class="detail-label">Viento</span>
                                <span class="detail-value">${windSpeed} m/s</span>
                            </div>
                        </div>
                        
                        <div class="detail-item">
                            <i class="fas fa-gauge-high"></i>
                            <div class="detail-info">
                                <span class="detail-label">Presión</span>
                                <span class="detail-value">${pressure} hPa</span>
                            </div>
                        </div>
                        
                        <div class="detail-item">
                            <i class="fas fa-eye"></i>
                            <div class="detail-info">
                                <span class="detail-label">Visibilidad</span>
                                <span class="detail-value">${(visibility / 1000).toFixed(1)} km</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    clearInput() {
        this.elements.cityInput.value = '';
    }

    setInputValue(value) {
        this.elements.cityInput.value = value;
    }

    focusInput() {
        this.elements.cityInput.focus();
    }
}

export default WeatherUI;