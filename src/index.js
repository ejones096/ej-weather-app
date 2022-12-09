let apiKey = "c03face7caa58a9b7ffa9f52b7238a93";

// Date
function formatDate(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[dayIndex];

  return `${day} ${hours}:${minutes}`;
}

let dateElement = document.querySelector("#date");
let currentTime = new Date();
dateElement.innerHTML = formatDate(currentTime);

// Search
function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-city-input");
  let h2 = document.querySelector("h2");
  h2.innerHTML = `${searchInput.value}`;

  //Call Search Function
  apiSearch(searchInput.value);
}

//Setup Search For Location Button
let form = document.querySelector("#search-input");
form.addEventListener("submit", search);

//Setup Current Location Button
let currentLocationButton = document.querySelector("#location-button");
currentLocationButton.addEventListener("click", getCurrentPosition);

// API search
function apiSearch(city) {
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

//current location button
function showPosition(position) {
  let myLatitude = position.coords.latitude;
  let myLongitude = position.coords.longitude;
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${myLatitude}&lon=${myLongitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

//5 Day Forecast
function getForecast(coordinates) {
  let forecastApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(forecastApiUrl).then(displayForecast);
}

function getUpdatedForecastUnits(coordinates) {
  let forecastApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
  axios.get(forecastApiUrl).then(displayForecast);
}

function displayWeatherCondition(response) {
  let tempNow = Math.round(response.data.main.temp);
  let temp = document.querySelector("#temp");
  temp.innerHTML = `${tempNow}`;
  let city = document.querySelector("#city");
  city.innerHTML = response.data.name;
  let date = document.querySelector("#date");
  date.innerHTML = formatDate(currentTime);
  let weather = document.querySelector("#weather");
  weather.innerHTML = response.data.weather[0].main;
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = response.data.main.humidity;
  let wind = document.querySelector("#wind");
  wind.innerHTML = Math.round(response.data.wind.speed);

  getForecast(response.data.coord);
 
  //Display icon
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

//Unit conversion
function displayFahrenheitTemp(event) {
  event.preventDefault();
  let temperature = document.querySelector("#temp");

  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  temperature.innerHTML = Math.round(fahrenheitTemp);
}

function displayCelsiusTemp(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperature = document.querySelector("#temp");
  temperature.innerHTML = Math.round(celsiusTemp);
}

let celsiusTemp = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemp);

apiSearch("London");

// Format Forecast Last Updated Day/Time and Forecast Day Functions

function formatDay(timestamp) {
  let milliseconds = new Date(timestamp * 1000);
  let day =  milliseconds.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function formatLastUpdatedTime(timestamp, timezone) {
  let timestampMilliseconds = timestamp * 1000;
  let timezoneMilliseconds = timezone * 1000;
  let localTimestamp = new Date(timestampMilliseconds + timezoneMilliseconds);

  let dayIndex = localTimestamp.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[dayIndex];

  let hours = localTimestamp.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let mins = localTimestamp.getMinutes();
  if (mins < 10) {
    mins = `0${mins}`;
  }
  let time = `${hours}:${hours}`
  return `${day} ${time}`;
}

// Display Forecast function

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML += `
    
    
   <div class="col-6 col-md-2">
          <div class="card forecast-card">
            <span class="forecast-day-title">${formatDay(forecastDay.dt)}</span>
            <img src="https://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png" alt="forecast-icon">
            <div class="forecast-temps">
              <span class="forecast-max-temp">high: ${Math.round(
                forecastDay.temp.max
              )}°</span> <br /> <span class="forecast-min-temp">low: ${Math.round(
        forecastDay.temp.min
      )}°</span>
            </div>
          </div>
        </div>`;
    }
  });

  forecastHTML += `</div>`;
  forecastElement.innerHTML = forecastHTML;
}