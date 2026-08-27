# Wordly

Wordly is a React-based dictionary application that allows users to search for words and view useful information about them in one place.

The application combines dictionary data with related images and pronunciation audio to create a more visual and interactive dictionary experience.

## Features

- Search for English words.
- Display the word's definition.
- Display the part of speech (noun, adjective, verb, etc.).
- Display example sentences when provided by the dictionary API.
- Play pronunciation audio when available.
- Display a related image using Pixabay.
- Automatically fall back to the Learner's Dictionary API when the Collegiate Dictionary does not provide a usable result.
- Display loading/status messages while searching.
- Display friendly error messages when a word cannot be found.
- Gracefully handles missing examples, pronunciation, and images.
- Cleans Merriam-Webster formatting tags from example sentences before displaying them.

## Technologies Used

- React
- JavaScript
- Vite
- HTML
- CSS
- Merriam-Webster Dictionary API
- Pixabay API

## APIs

### Merriam-Webster Dictionary API

Wordly uses the Merriam-Webster Dictionary API to retrieve:

- Definitions
- Parts of speech
- Example sentences
- Pronunciation information
- Pronunciation audio

The application uses two Merriam-Webster endpoints:

1. Collegiate Dictionary
2. Learner's Dictionary

The Learner's Dictionary is used as a fallback when the Collegiate Dictionary does not return a usable result.

### Pixabay API

Pixabay is used to search for images related to the word entered by the user.

If Pixabay does not return an image, the dictionary result can still be displayed normally.

## Environment Variables

API keys are stored in a `.env` file rather than being written directly into the React code.

The project uses:

```env
VITE_DICTIONARY_1=collegiate_dictionary_api_key
VITE_DICTIONARY_2=learner_dictionary_api_key
VITE_PIXABAY_KEY=pixabay_api_key
```

## Upcoming Updates

1. Slidedown animations
2. A word-matching minigame
3. Video examples
4. Wordly quizzes
5. Score prizes and leaderboards
