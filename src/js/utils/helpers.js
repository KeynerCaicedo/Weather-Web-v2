// Utility functions
export const helpers = {
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle: (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    isValidCity: (city) => {
        return city && city.trim().length > 0 && /^[a-zA-Z\s\u00C0-\u00FF]+$/.test(city);
    },

    formatTemperature: (temp) => {
        return `${Math.round(temp)}°C`;
    },

    getWindDirection: (degrees) => {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(degrees / 22.5) % 16;
        return directions[index];
    }
};

export class ErrorHandler {
    static handleAPIError(error) {
        console.error('Weather API Error:', error);
        
        if (error.message.includes('404')) {
            return 'Ciudad no encontrada. Verifica el nombre e intenta nuevamente.';
        } else if (error.message.includes('401')) {
            return 'Error de autenticación con el servicio del clima.';
        } else if (error.message.includes('network')) {
            return 'Error de conexión. Verifica tu internet e intenta nuevamente.';
        } else {
            return 'Ha ocurrido un error inesperado. Por favor, intenta más tarde.';
        }
    }

    static handleLocationError(error) {
        console.error('Geolocation Error:', error);
        
        switch(error.code) {
            case error.PERMISSION_DENIED:
                return 'Permiso de ubicación denegado. Puedes buscar una ciudad manualmente.';
            case error.POSITION_UNAVAILABLE:
                return 'Información de ubicación no disponible.';
            case error.TIMEOUT:
                return 'La solicitud de ubicación ha expirado.';
            default:
                return 'Error al obtener la ubicación.';
        }
    }
}