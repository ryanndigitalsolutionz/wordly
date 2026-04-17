# Wordly Summary JavaScript #
## JS Details ##
1. I thought of popular dictionaries that have picture examples and researched if I could also make my Wordly website run the same way, so I linked the "Free Dictionary API" with Pixabay using a key so that pictures related to the meaning of the searched word are displayed.

2. **Configuration object (config)** - Holds API base URLs and keys (pixabayKey for images, dictBase for dictionary). Keeps constants in one place for easy reuse.

3. **Favorites array (favorites)** - Stores words the user saves. saveWord() checks for duplicates before adding, then updates the UI.

4. **Form handling (form.addEventListener)** - Listens for the search form submission, prevents default reload with event.preventDefault() and cleans the input (trim().toLowerCase()) to avoid errors.

5. **Fetching data (Promise.all)** - Runs dictionary and image API requests at the same time for efficiency. If dictionary fetch fails, throws an error. Parses JSON responses into usable objects.

6. **Rendering results (renderResult)** - Extracts the first meaning, definition, and example from the dictionary data. Builds HTML dynamically with template literals. Adds an image if one is found. Updates CSS (border color, fade‑in effect) to show success.

6. **Error handling (catch)** - Displays a red border and error message if the word isn’t found or fetch fails.

PS: I had issues with adding the prolifics, synonyms and a light/dark theme switch, so I made a whole image as the background.