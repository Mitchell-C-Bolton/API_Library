 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a//dev/null b/README.md
index 0000000000000000000000000000000000000000..0adca39b0de768d52c13b437befe9b03932bb5f1 100644
--- a//dev/null
+++ b/README.md
@@ -0,0 +1,38 @@
+# API Library
+
+API Library is a simple front-end playground that showcases a collection of public APIs. Each card on the page fetches data from a different source — from weather and animal facts to anime synopses and trivia questions — making it a handy reference for experimenting with `fetch` and handling JSON responses.
+
+## Features
+- **Seattle Weather** – Displays the current temperature in Seattle using the Open-Meteo API.
+- **Cat Facts** – Fetches random cat trivia from MeowFacts.
+- **Random Dog Image** – Shows an image returned by the Random.Dog API with retry logic for non-image responses.
+- **Anime Synopsis Search** – Looks up an anime title and synopsis via the Kitsu API.
+- **Upcoming U.S. Holiday** – Retrieves the next federal holiday from Nager.Date.
+- **Geek Jokes** – Pulls a random joke from Geek Jokes.
+- **Trivia Question** – Gets a single trivia question from Open Trivia DB.
+- **Dictionary Lookup** – Queries DictionaryAPI.dev for definitions of user-supplied words.
+- **Country Capital Finder** – Uses REST Countries to reveal the capital city of a user-entered country.
+
+## Tech Stack
+- **HTML5** and **Bootstrap 5** for layout and styling.
+- **Vanilla JavaScript** with the Fetch API for data retrieval and DOM updates.
+
+## Getting Started
+1. Clone the repository:
+   ```bash
+   git clone https://github.com/your-username/API_Library.git
+   cd API_Library
+   ```
+2. Open `index.html` in your browser. Because all requests are sent to public HTTPS APIs, a static file server is optional but recommended during development. You can use any local server, for example:
+   ```bash
+   npx http-server .
+   ```
+   Then navigate to `http://localhost:8080` in your browser.
+
+## Usage Tips
+- Several cards include text inputs (Anime, Dictionary, Country Capital). Enter a term and click the button to trigger a lookup.
+- If an API returns an error or reaches its rate limit (HTTP 429), the app logs a warning to the console and falls back to a safe default message.
+- The navigation bar is decorative; clicking the links shows an alert explaining that the navigation is disabled in this demo.
+
+## Contributing
+Pull requests and issue reports are welcome. If you add a new API card, consider reusing the existing `fetchData` helper to keep error handling consistent.
 
EOF
)
