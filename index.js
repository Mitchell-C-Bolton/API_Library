// DOM elements
const seattleTempButton = document.getElementById("seattleTempButton");
const catFactsButton = document.getElementById("catFactsButton");
const dogImageButton = document.getElementById("dogImageButton");
const animeInfoButton = document.getElementById("animeInfoButton");
const usNextHolidayButton = document.getElementById("usNextHolidayButton");
const authorWorksButton = document.getElementById("authorWorksButton");
const jokeTextButton = document.getElementById("jokeTextButton");
const triviaQuestionButton = document.getElementById("triviaQuestionButton");
const dictionaryWordButton = document.getElementById("dictionaryWordButton");
const countryLookupButton = document.getElementById("countryLookupButton");
let seattleTemp = document.getElementById("seattleTemp");
let catFacts = document.getElementById("catFacts");
let dogImage = document.getElementById("dogImage");
let animeInfo = document.getElementById("animeInfo");
let animeName = document.getElementById("animeName");
let usNextHoliday = document.getElementById("usNextHoliday");
let jokeText = document.getElementById("jokeText");
let triviaQuestion = document.getElementById("triviaQuestion");
let dictionaryInfo = document.getElementById("dictionaryInfo");
let dictionaryWord = document.getElementById("dictionaryWord");
let countryLookup = document.getElementById("countryLookup");
let countryLookupInput = document.getElementById("countryLookupInput");

// API Links
const weatherURL = "https://api.open-meteo.com/v1/forecast?latitude=47.6062&longitude=-122.3321&current=temperature_2m&timezone=Pacific%2FAuckland&forecast_days=1&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch";
const catFactsURL = "https://meowfacts.herokuapp.com/";
const dogImageURL = "https://random.dog/woof.json";
const animeInfoURL = "https://kitsu.io/api/edge/anime";
const usNextHolidaysURL = "https://date.nager.at/api/v3/publicholidays/";
const jokeTextURL = "https://geek-jokes.sameerkumar.website/api?format=json";
const triviaQuestionURL = "https://opentdb.com/api.php?amount=1";
const dictionaryInfoURL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const countryLookupURL = "https://restcountries.com/v3.1/name/";

// Fetch data Function
async function fetchData(url) {
  try {
    const response = await fetch(url);

    // ✅ Handle Too Many Requests
    if (response.status === 429) {
      console.warn("Rate limit reached (429). Please wait before trying again.");
      return { results: [] }; // return safe fallback
    }

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
    seattleTemp.textContent = "Loading...";
    const weatherData = await fetchData(url);
    seattleTemp.textContent = "Temperature: " + weatherData.current.temperature_2m + 'F';
}

async function updateCatFacts(url) { // Cat Fact
    catFacts.textContent = "Loading...";
    const catData = await fetchData(url);
    catFacts.textContent = "Cat fact: " + catData.data;
}

async function updateDogImage(url, retries = 5) { // Dog Image
    dogImage.src = "";
    const dogImageData = await fetchData(url);

    if (!dogImageData) {
        dogImage.alt = "Error fetching dog image.";
        return;
    }

    const validExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    const fileUrl = dogImageData.url;

    if (validExtensions.some(ext => fileUrl.toLowerCase().endsWith(ext))) {
        dogImage.src = fileUrl;
        dogImage.alt = "A random dog";
    } else {
        console.log("Non-image returned, retrying...");
        if (retries > 0) {
            updateDogImage(url, retries - 1);
        } else {
            dogImage.alt = "No valid image found after several tries.";
        }
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

    animeInfo.textContent = `${title}: ${synopsis}`;
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

async function updateJokeText(url) { // Jokes
    jokeText.textContent = "Loading...";
    const joke = await fetchData(url);
    jokeText.textContent = "Joke: " + joke.joke;
    console.log(joke);
}

async function updateTriviaQuestion(url) { // Trivia Question
    triviaQuestion.textContent = "Loading...";
    const trivia = await fetchData(url);

    if (!trivia || !trivia.results || trivia.results.length === 0) {
        triviaQuestion.textContent = "Please wait before asking another question.";
        return;
    }

    const decode = (text) => {
        const txt = document.createElement("textarea");
        txt.innerHTML = text;
        return txt.value;
    };

    const question = decode(trivia.results[0].question);
    triviaQuestion.textContent = "Trivia: " + question;
    console.log(trivia);
}

async function updateDictionaryInfo(url, dictionaryWord) { // Dictionary Lookup
    dictionaryInfo.textContent = "Loading...";
    
    const q = (dictionaryWord?.value ?? url?.textContent ?? "").trim();
    if (!q) {
        dictionaryInfo.textContent = "Please enter a word.";
        return;
    }

    const baseUrl = typeof url === "string" ? url : url?.textContent ?? "";
    const completeURL = `${baseUrl}${encodeURIComponent(q)}`;

 try {
        const data = await fetchData(completeURL);

        if (!data || !Array.isArray(data) || data.length === 0) {
            dictionaryInfo.textContent = `No results found for "${q}".`;
            return;
        }
        
        dictionaryInfo.textContent = data[0].meanings[0].definitions[0].definition;

    } catch (err) {
        console.error(err);
        dictionaryInfo.textContent = "Error fetching dictionary data.";
    }
}

async function updateCountryInfo(url, countryName) { // Country Look-up
    countryLookup.textContent = "Loading...";

    const q = (countryName?.value ?? url?.textContent ?? "").trim();
        if (!q) {
        countryLookup.textContent = "Please enter a country.";
        return;
    }

    const baseUrl = typeof url === "string" ? url : url?.textContent ?? "";
    const completeURL = `${baseUrl}${encodeURIComponent(q)}`;

    try {
        const data = await fetchData(completeURL);
        console.log(data[0].capital[0]);
        countryLookup.textContent = data[0].capital[0];

        if (!data || !Array.isArray(data) || data.length === 0) {
            countryLookup.textContent = `No results found for "${q}".`;
            return;
        }

    } catch (err) {
        console.error(err);
        countryLookup.textContent = "Error fetching country.";
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

animeInfoButton.addEventListener("click", () => { // Anime Info
    updateAnimeInfo(animeInfoURL, animeName);
    console.log("Anime info updated");
});

usNextHolidayButton.addEventListener("click", () => { // Next Holiday
    updateUSNextHoliday(usNextHolidaysURL);
    console.log("Next Holiday Updated");
});

jokeTextButton.addEventListener("click", () => { // Jokes
    updateJokeText(jokeTextURL);
    console.log("New joke given");
});

triviaQuestionButton.addEventListener("click", () => { // Trivia Question
    updateTriviaQuestion(triviaQuestionURL);
    console.log("New trivia given");
});

dictionaryWordButton.addEventListener("click", () => { // Dictionary lookup
    updateDictionaryInfo(dictionaryInfoURL, dictionaryWord);
    console.log("Word looked up");
});

countryLookupButton.addEventListener("click", () => { // Country look-up
    updateCountryInfo(countryLookupURL, countryLookupInput);
    console.log("Country looked up");
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
    updateUSNextHoliday(usNextHolidaysURL);
    updateJokeText(jokeTextURL);
    updateTriviaQuestion(triviaQuestionURL);