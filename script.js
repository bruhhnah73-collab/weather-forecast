const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");

const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const errorMessage = document.getElementById("errorMessage");


// Search button
searchButton.addEventListener("click", searchWeather);


// Press Enter to search
cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchWeather();
    }
});


async function searchWeather() {

    const city = cityInput.value.trim();

    if (!city) {
        errorMessage.textContent = "Please enter a city.";
        return;
    }

    errorMessage.textContent = "Loading weather...";

    try {

        // Find the city
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!locationResponse.ok) {
            throw new Error("Could not find the city.");
        }

        const locationData = await locationResponse.json();

        if (!locationData.results || locationData.results.length === 0) {
            throw new Error("City not found.");
        }

        const location = locationData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;


        // Get weather data
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=celsius&wind_speed_unit=kmh`
        );

        if (!weatherResponse.ok) {
            throw new Error("Could not get weather data.");
        }

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;


        // Display city
        cityName.textContent =
            `${location.name}, ${location.country}`;


        // Display temperature
        temperature.textContent =
            `${Math.round(current.temperature_2m)}°C`;


        // Display humidity
        humidity.textContent =
            `${current.relative_humidity_2m}%`;


        // Display wind
        wind.textContent =
            `${Math.round(current.wind_speed_10m)} km/h`;


        // Display weather description
        description.textContent =
            getWeatherDescription(current.weather_code);


        // Display weather icon
        weatherIcon.textContent =
            getWeatherIcon(current.weather_code);


        errorMessage.textContent = "";

    } catch (error) {

        console.error(error);

        errorMessage.textContent =
            "Could not find weather for that city.";
    }
}


// Weather descriptions
function getWeatherDescription(code) {

    if (code === 0) {
        return "Clear sky";
    }

    if (code === 1 || code === 2) {
        return "Partly cloudy";
    }

    if (code === 3) {
        return "Overcast";
    }

    if (code === 45 || code === 48) {
        return "Foggy";
    }

    if (code >= 51 && code <= 57) {
        return "Drizzle";
    }

    if (code >= 61 && code <= 67) {
        return "Rain";
    }

    if (code >= 71 && code <= 77) {
        return "Snow";
    }

    if (code >= 80 && code <= 82) {
        return "Rain showers";
    }

    if (code >= 95) {
        return "Thunderstorm";
    }

    return "Unknown";
}


// Weather icons
function getWeatherIcon(code) {

    if (code === 0) {
        return "☀️";
    }

    if (code === 1 || code === 2) {
        return "🌤️";
    }

    if (code === 3) {
        return "☁️";
    }

    if (code === 45 || code === 48) {
        return "🌫️";
    }

    if (code >= 51 && code <= 67) {
        return "🌧️";
    }

    if (code >= 71 && code <= 77) {
        return "❄️";
    }

    if (code >= 80 && code <= 82) {
        return "🌦️";
    }

    if (code >= 95) {
        return "⛈️";
    }

    return "🌤️";
}