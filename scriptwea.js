const apiKey = '7baedf95c394f45accb45ff5053d8092';
const locationInput = document.getElementById('location-input');
const searchButton = document.getElementById('search'); 
const weatherOutput = document.getElementById('weather-output');
const autocompleteList = document.getElementById('autocomplete-list');

// REMOVED: Hardcoded locations array
// const locations = ["New York", "California", "Japan", "Australia", "China","Kochi","Kozhikode"];

locationInput.addEventListener('input', async function() {
    let val = this.value;
    closeAllLists();
    if (!val) return false;

    try {
        // Fetch matching cities from OpenWeatherMap
        const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${val}&limit=5&appid=${apiKey}`
        );
        const locationData = await response.json();

        let autocompleteItems = document.createElement('div');
        autocompleteItems.setAttribute('id', this.id + 'autocomplete-list');
        autocompleteItems.setAttribute('class', 'autocomplete-items');
        this.parentNode.appendChild(autocompleteItems);

        locationData.forEach(location => {
            let displayName = `${location.name}, ${location.country}`;
            let item = document.createElement('div');
            item.innerHTML = `<strong>${displayName.substr(0, val.length)}</strong>${displayName.substr(val.length)}`;
            item.innerHTML += `<input type='hidden' value='${displayName}'>`;
            item.addEventListener('click', function() {
                locationInput.value = this.getElementsByTagName('input')[0].value;
                closeAllLists();
            });
            autocompleteItems.appendChild(item);
        });
    } catch (error) {
        console.error(error);
    }
});

function closeAllLists(elmnt) {
    const items = document.getElementsByClassName('autocomplete-items');
    for (let i = 0; i < items.length; i++) {
        if (elmnt != items[i] && elmnt != locationInput) {
            items[i].parentNode.removeChild(items[i]);
        }
    }
}

document.addEventListener('click', function(e) {
    closeAllLists(e.target);
});

searchButton.addEventListener('click', function() {
    let location = locationInput.value;
    if (location) {
        fetchWeather(location);
    }
});

async function fetchWeather(location) {
    weatherOutput.innerHTML = '<p>Loading...</p>'; 
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error('LOCATION NOT FOUND');
        const weatherData = await response.json();
        displayWeather(weatherData);
    } catch (error) {
        weatherOutput.innerHTML = `<p>${error.message}</p>`;
    }
}

function displayWeather(data) {
    const { name, main, weather } = data;
    weatherOutput.innerHTML = `
        <p>LOCATION: ${name}</p>
        <p>TEMPERATURE: ${main.temp} °C</p>
        <p>WEATHER: ${weather[0].description}</p>
        <p>HUMIDITY: ${main.humidity}%</p>`;
}
