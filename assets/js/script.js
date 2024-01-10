//retrieve and format current time/date
const today = dayjs();
const todayFormatted = today.format("M/D/YY");

var cityName = document.querySelector("#cityName");
var searchBtn = $(".searchBtn");
var APIKey = "d3d61fa7fc189fe9cb855f295de8c0de";

searchBtn.on("click", function (e) {
  cityName = cityName.value;
  getCoordinates(cityName);
});

function getCoordinates(cityName) {
  var geoUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&limit=1&appid=" +
    APIKey;

  fetch(geoUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
        for (var i = 0; i < data.length; i++) {
      var latitude = data[i].lat;
      var longitude = data[i].lon;
    }
    getForecast(latitude, longitude);
});
}

var forecastArray = [];

function getForecast(latitude, longitude) {
  var forecastUrl =
    "http://api.openweathermap.org/data/2.5/forecast?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&appid=" +
    APIKey;
  fetch(forecastUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      for (var i = 0; i < data.list.length; i++) {
        forecastArray.push(data.list[i]);
      }
    });
    renderCurrent();
}

function renderCurrent() {
    $("#cityCurrent").text(cityName + " (" + todayFormatted + ")");
}
