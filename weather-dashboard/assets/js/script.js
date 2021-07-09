// Global variables
var inputValue;
var searchFormEl = document.querySelector("#search-form")
var submitBtnEl = document.querySelector("#submit");
var searchEl = document.querySelector("#search");
var currentContainerEl = document.querySelector("#last");
var fiveDayContainerEl = document.querySelector("#all-days");
var savedSearchEl = document.querySelector("#search-history");
var inputNameEl = document.querySelector("#last-city");
var displayEl = document.querySelector("#last-display")
var tempratureEl = document.querySelector("#last-temprature");
var dateEl = document.querySelector("#last-date");
var windEl = document.querySelector("#last-wind");
var hmdtyEl = document.querySelector("#last-hmdty");
var uvIndexEl = document.querySelector("#last-uv-index");


// api as provided with the challenge
var apiKey = "7a0e3b7a2332de049abc9ae5197bfda0"

// local storage check if any available before
var inputArray = [];

var storedInput = function () {
    if (localStorage.getItem("input")) {
   inputArray = JSON.parse(localStorage.getItem("input"))
 } else {
    inputArray = []
 }
 storedInput();
};

localStorage.setItem("input", JSON.stringify(inputArray))
var savedinput = JSON.parse(localStorage.getItem("input"))



// getting response for current input info by fetching
function fetchLast(input) {

    var inputValue = searchEl.value;

    fetch('https://api.openweathermap.org/data/2.5/weather?units=metric&q=' + input + '&appid=' + apiKey)

    .then (function(response) {
    return response.json();
})

// set current values; let this value occupy i = 0
.then (function(response) {
    var currentDate = new Date(response.dt * 1000).toLocaleDateString("en-US");
    inputNameEl.textContent = response.name + " " + '(' + (currentDate) + ')';
    var weatherPic = response.weather[0].icon;
    displayEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
    var tempValue = response.main.temp;
    tempratureEl.textContent = 'Temp: ' + tempValue +'℃';
    var windSpeed = response.wind.speed * 3.6;
    var adjustedSpeed = windSpeed.toFixed(2);
    windEl.textContent = 'Wind: ' + adjustedSpeed + ' km/hr';
    hmdtyEl.textContent = 'Humidity: ' + response.main.humidity + '%';
    
    // fetch uv-Index and coming five days weather 
    return fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + response.coord.lat + '&lon=' + response.coord.lon + '&units=metric&appid=' + apiKey)

    .then (function(response) {
        return response.json();
    })

    // uv-index markings RED, BLUE, YELLOW signal
    .then (function(response) {
        uvIndexEl.textContent = response.current.uvi;
        if (response.current.uvi > 7) {
            uvIndexEl.classList = "uv-danger"
        } else if (response.current.uvi > 2 && response.current.uvi < 7) {
            uvIndexEl.classList = "uv-warning"
        } else {
            uvIndexEl.classList = "uv-safe"
        }
    
        //for loop to iterate starting i = 1 leaving the first index is for the the current date (Last Date)
        
        for (var i = 1; i < 6; i++) {
            var forecastedDate = document.querySelector("#ddmmyyyy-" + [i]);
            forecastedDate.textContent = new Date(response.daily[i].dt * 1000).toLocaleDateString("en-US"); ;
            var forecastedTemprature = document.querySelector("#temprature-" + [i]);
            forecastedTemprature.textContent =  "Temp: " + response.daily[i].temp.day + "℃";
            var forecastedDisplay = document.querySelector("#display-" + [i]);
            var forecastedSign = response.daily[i].weather[0].icon;
            forecastedDisplay.setAttribute("src", "https://openweathermap.org/img/wn/" + forecastedSign + "@2x.png");  
            var forecastedWind = document.querySelector("#wind-" + [i]);
            var convertedWind = response.daily[i].wind_speed * 3.6;
            var adjustedForecastedWind = convertedWind.toFixed(2)
            forecastedWind.textContent = "Wind: " + adjustedForecastedWind + "km/hr";
            var forecastedHmdty = document.querySelector("#hmdty-" + [i]);
            forecastedHmdty.textContent = "Humidity: " + response.daily[i].humidity + "%";
        }
    })
})
};

// function for LStorage
function setStorage() {
    inputArray.push(searchEl.value); 
    localStorage.setItem("input", JSON.stringify(inputArray))
;}

var inputHandler = function(event) {
    event.preventDefault;
    currentContainerEl.style.display = "block";
    fiveDayContainerEl.style.display = "flex";
    inputValue = $(this).val();
    fetchLast(inputValue); 
}

// create saved buttons
function createButton(text) {
    var savedBtnEl = document.createElement("button");
    savedBtnEl.textContent = inputValue
    savedBtnEl.className = "savedBtn";
    savedBtnEl.setAttribute("type", "submit")
    savedBtnEl.setAttribute("value", text);
    savedBtnEl.addEventListener("click", inputHandler)
    savedSearchEl.appendChild(savedBtnEl);
};    


// loop through array on page load and render saved buttons
savedinput.forEach(function(item) {
    createButton(item)
}); 

// event listener
searchFormEl.addEventListener("submit", function(event) {
    event.preventDefault();
    inputValue = searchEl.value.trim();
    if (searchEl.value === "") {
        alert("Please enter a city name!")
        return
    }
    fetchLast(inputValue);
    currentContainerEl.style.display = "block";
    fiveDayContainerEl.style.display = "flex";
    setStorage();
    JSON.parse(localStorage.getItem("input"))
    createButton(searchEl.value);
    searchEl.value = "";
});

$(".savedBtn").click(inputHandler);

