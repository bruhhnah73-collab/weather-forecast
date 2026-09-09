const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");

const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const errorMessage = document.getElementById("errorMessage");

const forecastContainer = document.getElementById("forecastContainer");


// ================================
// SEARCH
// ================================

searchButton.addEventListener("click", searchWeather);


// Press Enter to search
cityInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        searchWeather();
    }

});


// ================================
// GET WEATHER
// ================================

async function searchWeather() {

    const city = cityInput.value.trim();

    if (!city) {

        errorMessage.textContent = "Please enter a city.";

        return;
    }

    errorMessage.textContent = "Loading weather...";

    forecastContainer.innerHTML = "";

    try {

        // ================================
        // FIND CITY
        // ================================

        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!locationResponse.ok) {

            throw new Error("Could not find the city.");

        }

        const locationData = await locationResponse.json();

        if (
            !locationData.results ||
            locationData.results.length === 0
        ) {

            throw new Error("City not found.");

        }

        const location = locationData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;


        // ================================
        // GET WEATHER + FORECAST
        // ================================

        const weatherResponse = await fetch(

            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto&forecast_days=7`

        );

        if (!weatherResponse.ok) {

            throw new Error("Could not get weather data.");

        }

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;
        const daily = weatherData.daily;


        // ================================
        // CURRENT WEATHER
        // ================================

        // City
        cityName.textContent =
            `${location.name}, ${location.country}`;


        // Temperature
        temperature.textContent =
            `${Math.round(current.temperature_2m)}°C`;


        // Humidity
        humidity.textContent =
            `${current.relative_humidity_2m}%`;


        // Wind
        wind.textContent =
            `${Math.round(current.wind_speed_10m)} km/h`;


        // Description
        description.textContent =
            getWeatherDescription(current.weather_code);


        // Icon
        weatherIcon.textContent =
            getWeatherIcon(current.weather_code);


        // ================================
        // 7-DAY FORECAST
        // ================================

        forecastContainer.innerHTML = "";


        for (let i = 0; i < daily.time.length; i++) {

            const date = new Date(
                `${daily.time[i]}T12:00:00`
            );


            const dayName =
                i === 0
                    ? "Today"
                    : date.toLocaleDateString("en-US", {
                        weekday: "short"
                    });


            const forecastCard =
                document.createElement("div");

            forecastCard.className =
                "forecast-card";


            forecastCard.innerHTML = `

                <div class="forecast-day">
                    ${dayName}
                </div>

                <div class="forecast-icon">
                    ${getWeatherIcon(daily.weather_code[i])}
                </div>

                <div class="forecast-temperature">
                    ${Math.round(daily.temperature_2m_max[i])}°
                    /
                    ${Math.round(daily.temperature_2m_min[i])}°C
                </div>

                <div class="forecast-rain">
                    🌧️ ${daily.precipitation_probability_max[i]}% rain
                </div>

            `;


            forecastContainer.appendChild(
                forecastCard
            );

        }


        // Remove loading/error message
        errorMessage.textContent = "";


    } catch (error) {

        console.error(error);

        errorMessage.textContent =
            "Could not find weather for that city.";

    }

}


// ================================
// WEATHER DESCRIPTIONS
// ================================

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


// ================================
// WEATHER ICONS
// ================================

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


// ================================
// DARK MODE
// ================================

const darkModeButton =
    document.getElementById("darkModeButton");


darkModeButton.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");


    if (
        document.body.classList.contains("dark-mode")
    ) {

        darkModeButton.textContent =
            "☀️ Light Mode";

        localStorage.setItem(
            "darkMode",
            "enabled"
        );

    } else {

        darkModeButton.textContent =
            "🌙 Dark Mode";

        localStorage.setItem(
            "darkMode",
            "disabled"
        );

    }

});


// ================================
// REMEMBER DARK MODE
// ================================

if (
    localStorage.getItem("darkMode") === "enabled"
) {

    document.body.classList.add("dark-mode");

    darkModeButton.textContent =
        "☀️ Light Mode";

}
