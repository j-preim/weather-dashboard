//retrieve and format current time/date
const today = dayjs();
const todayFormatted = formatDate(today);

function formatDate (date) {
  return dayjs(date).format("M/D/YYYY");
}

var searchButton = $(".search-button");
var APIKey = "d3d61fa7fc189fe9cb855f295de8c0de";

let storedSearches = JSON.parse(localStorage.getItem("storedSearches"));
if (storedSearches === null) {
  storedSearches = [];
}

const asideEl = $("aside");

for (i = 0; i < storedSearches.length; i++) {
  var storedSearchButton = $("<button>");
  storedSearchButton.addClass("my-2 btn stored-search-button");
  storedSearchButton.text(storedSearches.reverse()[i]);
  asideEl.append(storedSearchButton);
}

var storedSearchButtons = $(".stored-search-button");

storedSearchButtons.on("click", async function (e) {
  const cityName = e.target.textContent;
  const forecastArray = await getForecast(cityName);
  renderCurrent(forecastArray, cityName);
});

searchButton.on("click", async function (e) {
  let cityName = document.querySelector("#cityName");
  if (cityName.value.trim() !== "") {
  cityName = cityName.value.charAt(0).toUpperCase() + cityName.value.slice(1);
  storedSearches.push(cityName);
  localStorage.setItem("storedSearches", JSON.stringify(storedSearches));
  const forecastArray = await getForecast(cityName);
  renderCurrent(forecastArray, cityName);
  }
});

async function getCoordinates(cityName) {
  var geoUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&limit=1&appid=" +
    APIKey;

const coordinates = {};

  await fetch(geoUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
        coordinates.latitude = data[0].lat;
        coordinates.longitude = data[0].lon;
});
return coordinates;
}

async function getForecast(cityName) {
  const coordinates = await getCoordinates(cityName);
  console.log(coordinates);
  var forecastUrl =
    "http://api.openweathermap.org/data/2.5/forecast?lat=" +
    coordinates.latitude +
    "&lon=" +
    coordinates.longitude +
    "&appid=" +
    APIKey +
    "&units=imperial";

    let forecastArray = [];

  await fetch(forecastUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      forecastArray = [data.list[4], data.list[12], data.list[20], data.list[28], data.list[36]];
    });
    return forecastArray;
}

function clearPage() {
  const resultsEl = $("#results");
  if (resultsEl) {
    resultsEl.html("");
  }
  console.log(resultsEl);
}

function renderCurrent(forecastArray, cityName) {
  clearPage();
  const resultsEl = $("#results");

  const currentInfoEl = $("<section>");
  currentInfoEl.addClass("mb-3 p-2 border border-1 border-dark");
  currentInfoEl.attr("id", "currentInfo");
  resultsEl.append(currentInfoEl);

  const cityCurrentEl = $("<header>");
  cityCurrentEl.attr("id", "cityCurrent");
  cityCurrentEl.text(cityName + " (" + todayFormatted + ") ");
  cityCurrentEl.append(generateIconImgTag(forecastArray[0].weather[0].icon));
  currentInfoEl.append(cityCurrentEl);

  const tempCurrentEl = $("<div>");
  tempCurrentEl.attr("id", "tempCurrent");
  tempCurrentEl.text("Temp: " + forecastArray[0].main.temp);
  currentInfoEl.append(tempCurrentEl);

  const windCurrentEl = $("<div>");
  windCurrentEl.attr("id", "windCurrent");
  windCurrentEl.text("Wind: " + forecastArray[0].wind.speed);
  currentInfoEl.append(windCurrentEl);

  const humidityCurrentEl = $("<div>");
  humidityCurrentEl.attr("id", "humidityCurrent");
  humidityCurrentEl.text("Humidity: " + forecastArray[0].main.humidity);
  currentInfoEl.append(humidityCurrentEl);

  const fiveDayHeaderEl = $("<header>");
  fiveDayHeaderEl.text("5-Day Forecast:");
  resultsEl.append(fiveDayHeaderEl);

  forecastRowEl = $("<div>");
  forecastRowEl.addClass("row justify-content-around");
  resultsEl.append(forecastRowEl);

  
  for (i = 0; i < forecastArray.length; i++) {
    let forecastCardEl = $("<div>");
    forecastCardEl.addClass("col-2 pt-1 mt-1 forecast-card");
    forecastRowEl.append(forecastCardEl);

    let forecastHeaderEl = $("<header>");
    forecastHeaderEl.text(formatDate(forecastArray[i].dt_txt));
    forecastCardEl.append(forecastHeaderEl);

    let forecastIconEl = $("<div>");
    forecastIconEl.append(generateIconImgTag(forecastArray[i].weather[0].icon));
    forecastCardEl.append(forecastIconEl);

    let tempForecastEl = $("<div>");
    tempForecastEl.text("Temp: " + forecastArray[i].main.temp);
    forecastCardEl.append(tempForecastEl);

    let windForecastEl = $("<div>");
    windForecastEl.text("Wind: " + forecastArray[i].wind.speed);
    forecastCardEl.append(windForecastEl);

    let humidityForecastEl = $("<div>");
    humidityForecastEl.text("Humidity: " + forecastArray[i].main.humidity);
    forecastCardEl.append(humidityForecastEl);
  }
}

function generateIconImgTag(iconCode) {
  let iconURL = "https://openweathermap.org/img/wn/" + iconCode + ".png";
  let iconImgTag = "<img src=" + iconURL + ">";
  return iconImgTag;
}
