// DOM elements
const seattleTempButton = document.getElementById("seattleTempButton");
const catFactsButton = document.getElementById("catFactsButton");
const dogImageButton = document.getElementById("dogImageButton");
let seattleTemp = document.getElementById("seattleTemp");
let catFacts = document.getElementById("catFacts");
let dogImage = document.getElementById("dogImage");

// API Links
weatherURL = "https://api.open-meteo.com/v1/forecast?latitude=47.6062&longitude=-122.3321&current=temperature_2m&timezone=Pacific%2FAuckland&forecast_days=1&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch";
catFactsURL = "https://meowfacts.herokuapp.com/";
dogImageURL = "https://random.dog/woof.json";

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
async function updateWeather(url) { // Weather
    seattleTemp.textContent = "Loadaing...";
    const weatherData = await fetchData(url);
    seattleTemp.textContent = "Temperature: " + weatherData.current.temperature_2m + 'F';
}

async function updateCatFacts(url) { // Cat Fact
    catFacts.textContent = "Loading...";
    const catData = await fetchData(url);
    catFacts.textContent = "Cat fact: " + catData.data;
}

async function updateDogImage(url) { // Dog Image
    dogImage.textContent = "Loading...";
    const dogImageData = await fetchData(url);

    // only allow "images"
    const validExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    const fileUrl = dogImageData.url;

    if (validExtensions.some(ext => fileUrl.toLowerCase().endsWith(ext))) {
        dogImage.src = fileUrl;
        dogImage.alt = "A random dog";
    } else {
        // retry if not an image
        console.log("Non-image returned, retrying...");
        updateDogImage(url);
    }
}

//Update Card Buttons
seattleTempButton.addEventListener("click", () => { // Weather
    updateWeather(weatherURL);
    console.log('weather updated');
});

catFactsButton.addEventListener("click", () => { // Cat Fact
    updateCatFacts(catFactsURL);
    console.log('cat fact updated');
});

dogImageButton.addEventListener("click", () => { // Dog Image
    updateDogImage(dogImageURL);
    console.log('dog image updated');
});

// Navbar message
document.querySelectorAll('.nav-link').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        alert("Nav bar is not enabled for this demo. I just left it here to make the page look nicer.");
    });
});

//Initialize
updateWeather(weatherURL);
updateCatFacts(catFactsURL);
updateDogImage(dogImageURL);