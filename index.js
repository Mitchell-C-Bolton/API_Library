// DOM elements
const seattleTempButton = document.getElementById("seattleTempButton");
const catFactsButton = document.getElementById("catFactsButton");
const dogImageButton = document.getElementById("dogImageButton");
const animeInfoButton = document.getElementById("animeInfoButton");
const usNextHolidayButton = document.getElementById("usNextHolidayButton");
let seattleTemp = document.getElementById("seattleTemp");
let catFacts = document.getElementById("catFacts");
let dogImage = document.getElementById("dogImage");
let animeInfo = document.getElementById("animeInfo");
let animeName = document.getElementById("animeName");
let usNextHoliday = document.getElementById("usNextHoliday");

// API Links
weatherURL = "https://api.open-meteo.com/v1/forecast?latitude=47.6062&longitude=-122.3321&current=temperature_2m&timezone=Pacific%2FAuckland&forecast_days=1&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch";
catFactsURL = "https://meowfacts.herokuapp.com/";
dogImageURL = "https://random.dog/woof.json";
animeInfoURL = "https://kitsu.io/api/edge/anime";
usNextHolidaysURL = "https://date.nager.at/api/v3/publicholidays/"

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
    dogImage.src = "";
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

async function updateAnimeInfo(url, animeName) { // Anime Info
    animeInfo.textContent = "Loading...";
    
    const q = (animeName?.value ?? url?.textContent ?? "").trim();
    if (!q) {
        animeInfo.textContent = "Please enter an anime name.";
        return;
    }

    const completeURL = `${url}?filter[text]=${encodeURIComponent(q)}&page[limit]=1`;

    const data = await fetchData(completeURL);

    if (!data || !Array.isArray(data.data) || data.data.length === 0) {
        animeInfo.textContent = `No results found for "${q}".`;
        return;
    }

    const item = data.data[0];
    const attrs = item.attributes || {};
    const title =
        (attrs.titles && (attrs.titles.en_jp || attrs.titles.en || attrs.titles.ja_jp)) ||
        attrs.slug ||
        "Unknown title";
    const synopsis = attrs.synopsis || "No synopsis available.";

    animeInfo.textContent = data.data[0].attributes.canonicalTitle + ": "
    animeInfo.textContent += data.data[0].attributes.synopsis
}

async function updateUSNextHoliday(url) { // US Holiday
    usNextHoliday.textContent = "Loading...";
    let nextHoliday = null;
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate() +1).padStart(2, "0");

    const todayDate = new Date(year + "-" + month + "-" + day);

    const usNextHolidayData = await fetchData(url + year + '/us');

    for ( const key in usNextHolidayData) {
        const holidayDate = new Date(usNextHolidayData[key].date);

        if ( todayDate < holidayDate ) {
            nextHoliday = usNextHolidayData[key].localName;
            break;
        }
    }
    usNextHoliday.textContent = nextHoliday;
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

animeInfoButton.addEventListener("click", () => { // Anime Info
    updateAnimeInfo(animeInfoURL, animeName);
    console.log("Anime info updated");
});

usNextHolidayButton.addEventListener("click", () => { // Next Holiday
    updateUSNextHoliday(usNextHolidaysURL);
    console.log("Next Holiday Updated");
});

// Navbar message
document.querySelectorAll('.nav-link').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        alert("Nav bar is not enabled for this demo. I just left it here to make the page look nicer.");
    });
});

//Initialize
