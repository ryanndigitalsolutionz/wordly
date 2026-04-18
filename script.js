// Wordly App Logic - R.D.L Edition
const config = {
    pixabayKey: '55234477-1cccec2d8c1f51e4e84d3cc7e', // Get this for free at pixabay.com/api/docs
    dictBase: 'https://api.dictionaryapi.dev/api/v2/entries/en/'
};

let favorites = []; 

function saveWord(word) {
    // Check if the word is already there so you don't save it twice
    if (!favorites.includes(word)) {
        favorites.push(word);
        updateFavoritesUI();
    }
}

const form = document.getElementById('search-form');
const display = document.getElementById('result-container');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = document.getElementById('word-input').value.trim().toLowerCase();
    
    if (!query) return;

    // Reset UI for new search
    display.innerHTML = '<p class="status">Consulting the archives...</p>';
    display.style.borderColor = "#ccc"; 

    try {
        // Run both fetches at once to save time
        const [dictRes, imgRes] = await Promise.all([
            fetch(`${config.dictBase}${query}`),
            fetch(`https://pixabay.com/api/?key=${config.pixabayKey}&q=${query}&image_type=photo&per_page=3`)
        ]);

        if (!dictRes.ok) throw new Error("Word not found in database.");

        const dictData = await dictRes.json();
        const imgData = await imgRes.json();

        renderResult(dictData[0], imgData.hits[0]);
    } catch (err) {
        display.innerHTML = `<p class="error">Oops: ${err.message}</p>`;
        display.style.borderColor = "red";
    }
});

function renderResult(data, image) {
    const mainMeaning = data.meanings[0];
    const definition = mainMeaning.definitions[0].definition;
    const example = mainMeaning.definitions[0].example || "No example available.";
    
    // Build HTML string
    let html = `
        <div class="word-header">
            <h2>${data.word}</h2>
            <span class="pos">${mainMeaning.partOfSpeech}</span>
        </div>
        <p class="def"><strong>Definition:</strong> ${definition}</p>
        <p class="ex"><em>"${example}"</em></p>
    `;

    // Only add image if one was found
    if (image) {
        html += `<img src="${image.webformatURL}" alt="${data.word}" class="word-img">`;
    }

    display.innerHTML = html;
    
    // Rubric: Dynamic CSS update
    display.style.borderColor = "#2ecc71"; 
    display.classList.add('fade-in');
}

// Example: Getting the last synonym found
const synonyms = data.meanings[0].synonyms;
if (synonyms.length > 0) {
    const lastSynonym = synonyms[synonyms.length - 1]; 
    console.log("Last one found:", lastSynonym);
}

function toggleTheme() {
    const app = document.getElementById('app');
    // Swaps between glass effect and a solid dark theme
    app.style.backgroundColor = app.style.backgroundColor === 'rgba(0, 0, 0, 0.8)' 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(0, 0, 0, 0.8)';
}