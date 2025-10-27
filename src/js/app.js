import '../elements/style.css';
import { WeatherAPI } from './weatherAPI.js';
import WeatherUI from './ui.js';
import { helpers, ErrorHandler } from './utils/helpers.js';

// ===== THEME TOGGLE =====
const themeToggleBtn = document.getElementById("themeToggle");

// Aplicar tema previo si existe
const savedTheme = localStorage.getItem("theme") || "dark";
document.body.classList.toggle("dark", savedTheme === "dark");
updateThemeIcon(savedTheme);

themeToggleBtn.addEventListener("click", () => {
const isDark = document.body.classList.toggle("dark");
localStorage.setItem("theme", isDark ? "dark" : "light");
updateThemeIcon(isDark ? "dark" : "light");
});

function updateThemeIcon(theme) {
themeToggleBtn.innerHTML =
    theme === "dark"
    ? '<i class="fas fa-moon"></i>'
    : '<i class="fas fa-sun"></i>';
}


class WeatherApp {
    constructor() {
        this.weatherAPI = new WeatherAPI();
        this.ui = new WeatherUI();
        this.isLoading = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadLastCity();
    }

    bindEvents() {
        // Search button click
        this.ui.elements.searchBtn.addEventListener('click', () => {
            this.handleSearch();
        });

        // Enter key in input
        this.ui.elements.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        // Location button click
        this.ui.elements.locationBtn.addEventListener('click', () => {
            this.handleLocationSearch();
        });

        // Debounced input for future autocomplete feature
        this.ui.elements.cityInput.addEventListener('input', 
            helpers.debounce(() => {
                // Placeholder for autocomplete functionality
            }, 300)
        );
    }

    async handleSearch() {
        const city = this.ui.elements.cityInput.value.trim();
        
        if (!helpers.isValidCity(city)) {
            this.ui.showError('Por favor, ingresa un nombre de ciudad válido');
            return;
        }

        await this.searchWeather(city);
    }

    async handleLocationSearch() {
        if (!navigator.geolocation) {
            this.ui.showError('La geolocalización no es soportada por tu navegador');
            return;
        }

        this.ui.showLoading();
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                await this.searchWeatherByCoords(latitude, longitude);
            },
            (error) => {
                const errorMessage = ErrorHandler.handleLocationError(error);
                this.ui.showError(errorMessage);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 600000 // 10 minutes
            }
        );
    }

    async searchWeather(city) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.ui.showLoading();
        this.saveLastCity(city);

        try {
            const weatherData = await this.weatherAPI.getWeatherByCity(city);
            this.ui.showWeather(weatherData);
        } catch (error) {
            const errorMessage = ErrorHandler.handleAPIError(error);
            this.ui.showError(errorMessage);
        } finally {
            this.isLoading = false;
        }
    }

    async searchWeatherByCoords(lat, lon) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.ui.showLoading();

        try {
            const weatherData = await this.weatherAPI.getWeatherByCoords(lat, lon);
            this.ui.showWeather(weatherData);
            this.ui.setInputValue(weatherData.name);
        } catch (error) {
            const errorMessage = ErrorHandler.handleAPIError(error);
            this.ui.showError(errorMessage);
        } finally {
            this.isLoading = false;
        }
    }

    saveLastCity(city) {
        localStorage.setItem('lastSearchedCity', city);
    }

    loadLastCity() {
        const lastCity = localStorage.getItem('lastSearchedCity');
        if (lastCity) {
            this.ui.setInputValue(lastCity);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});

// Export for testing purposes
export default WeatherApp;

// ==== TEMA OSCURO / CLARO ====
const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
});

// Mantener la preferencia guardada
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeToggle.querySelector('i').classList.remove('fa-moon');
    themeToggle.querySelector('i').classList.add('fa-sun');
}
