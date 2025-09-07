// DOM elements
const seattleTempButton = document.getElementById("seattleTempButton");
let seattleTemp = document.getElementById("seattleTemp");

// API Links
weatherURL = "https://api.open-meteo.com/v1/forecast?latitude=47.6062&longitude=-122.3321&current=temperature_2m&timezone=Pacific%2FAuckland&forecast_days=1&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch";


// Fetch data Function
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

//Update card functions
async function updateWeather(url) {
    seattleTemp.textContent = "Loadaing...";
    const weatherData = await fetchData(url);
    seattleTemp.textContent = "Temperature: " + weatherData.current.temperature_2m + 'F';
}

// Navbar message
document.querySelectorAll('.nav-link').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        alert("Nav bar is not enabled for this demo. I just left it here to make the page look nicer.");
    });
});

//Update Card Buttons
seattleTempButton.addEventListener("click", () => {
    updateWeather(weatherURL);
    console.log('weather updated');
});

//Initialize
updateWeather(weatherURL);