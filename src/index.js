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
  let temperature = document.querySelector("#temperature");

  celciusLink.classList.remove("active");
  fahrenheitLink.classLink.add("active");
  let fahrenheitTemp = (celsiusTemperature * 9) / 5 + 32;
  temperature.innerHTML = Math.round(fahrenheitTemp);
}

function displayCelsiusTemp(event) {
  event.preventDefault ();
  celciusLink.classList.add("active");
  fahrenheitLink.classLink.remove("active");
  let temperature = document.querySelector("temperature");
  temperature.innerHTML = Math.round(celsiusTemp);
}

let celsiusTemp = null;

let fahrenheitLink = document.querySelector("fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

let celsiusLink = document.querySelector("celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemp);

apiSearch("London");