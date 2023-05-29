//Date
let now = new Date();
function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[date.getMonth()];
  let dateNumber = date.getDate();
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let time = `${day}, ${month} ${dateNumber}, ${hour}:${minutes}`;
  return time;
}
let currentDate = document.querySelector(".currentDate");
currentDate.innerHTML = formatDate(now);

//C-F
function toFahrenheit(event) {
  event.preventDefault();

  tempUnitC.classList.remove("active");
  tempUnitF.classList.add("active");
  let temperatureElement = document.querySelector(".currentCityTemp");
  temperatureElement.innerHTML = Math.round((celsiusTemperature * 9) / 5 + 32);
}
function toCelsius(event) {
  event.preventDefault();
  tempUnitF.classList.remove("active");
  tempUnitC.classList.add("active");
  let temperatureElement = document.querySelector(".currentCityTemp");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;
let tempUnitF = document.querySelector("#tempUnitF");
tempUnitF.addEventListener("click", toFahrenheit);

let tempUnitC = document.querySelector("#tempUnitC");
tempUnitC.addEventListener("click", toCelsius);

//Define current data
function search(city) {
  let apiKey = "6bfa54f242cbb59343d4e58db578dc61";
  let units = "metric";
  let urlCity = city;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${urlCity}&&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(showCurrentTemp);
  console.log(apiUrl);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#citySearch").value;
  search(city);
}
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}
function displayForecast(response) {
  console.log(response.data);
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    let iconMappings = {
      "clear-sky-day": "sun.gif",
      "clear-sky-night": "moon.gif",
      "few-clouds-day": "sun_cloud.gif",
      "few-clouds-night": "moon_cloud.gif",
      "scattered-clouds-day": "cloud.gif",
      "scattered-clouds-night": "cloud.gif",
      "broken-clouds-day": "broken_clouds.gif",
      "broken-clouds-night": "broken_clouds.gif",
      "shower-rain-day": "rain2.gif",
      "shower-rain-night": "rain2.gif",
      "rain-day": "sun_rain.gif",
      "rain-night": "moon_rain.gif",
      "thunderstorm-day": "thunder.gif",
      "thunderstorm-night": "thunder.gif",
      "snow-day": "snow.gif",
      "snow-night": "snow.gif",
      "mist-day": "mist.gif",
      "mist-night": "mist.gif",
    };
    let weatherIcon = forecastDay.condition.icon;
    let iconFileName = iconMappings[weatherIcon];

    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
      <div class="weather-forecast-date">
        ${formatDay(forecastDay.time)}
        <br />
        
        <img class="iqon" src="media/${iconFileName}"  width="40px" />
        <p>
          <span class="forecast-max-temperature">${Math.round(
            forecastDay.temperature.maximum
          )}°</span>
          <span class="forecast-min-temperature">${Math.round(
            forecastDay.temperature.minimum
          )}°</span>
        </p>
      </div>
    </div>
  
  `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
function getForecast(coordinates) {
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&key=3f9b7b600353afo31342ctbc603950e8&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}
function showCurrentTemp(response) {
  document.querySelector(".currentCity").innerHTML = response.data.name;
  console.log(response.data.name);

  celsiusTemperature = response.data.main.temp;
  let cityTemperature = Math.round(celsiusTemperature);

  let cityTemperatureData = document.querySelector(".currentCityTemp");
  cityTemperatureData.innerHTML = cityTemperature;

  let humidity = response.data.main.humidity;
  let humidityData = document.querySelector("#humidity");
  humidityData.innerHTML = humidity;

  let wind = Math.round(response.data.wind.speed);
  let windData = document.querySelector("#wind");
  windData.innerHTML = wind;

  let feelsLike = Math.round(response.data.main.feels_like);
  let feelsLikeData = document.querySelector("#feelsLike");
  feelsLikeData.innerHTML = feelsLike;

  let iconMappings = {
    "01d": "sun.gif",
    "01n": "moon.gif",
    "02d": "sun_cloud.gif",
    "02n": "moon_cloud.gif",
    "03d": "cloud.gif",
    "03n": "cloud.gif",
    "04d": "broken_clouds.gif",
    "04n": "broken_clouds.gif",
    "09d": "rain2.gif",
    "09n": "rain2.gif",
    "10d": "sun_rain.gif",
    "10n": "moon_rain.gif",
    "11d": "thunder.gif",
    "11n": "thunder.gif",
    "13d": "snow.gif",
    "13n": "snow.gif",
    "50d": "mist.gif",
    "50n": "mist.gif",
  };
  let weatherIcon = response.data.weather[0].icon;
  let iconFileName = iconMappings[weatherIcon];
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute("src", `media/${iconFileName}`);

  tempUnitF.classList.remove("active");
  tempUnitC.classList.add("active");
  document.querySelector("#citySearch").value = "";

  getForecast(response.data.coord);
}

let form = document.querySelector("form");
form.addEventListener("submit", handleSubmit);

function retrievePosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let units = "metric";
  let apiKey = "6bfa54f242cbb59343d4e58db578dc61";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&&units=${units}&appid=${apiKey}`;

  axios.get(apiUrl).then(showCurrentTemp);
}

function currentTemperature() {
  navigator.geolocation.getCurrentPosition(retrievePosition);
}
let currentTempButton = document.querySelector("button");
currentTempButton.addEventListener("click", currentTemperature);

search("Kyiv");
