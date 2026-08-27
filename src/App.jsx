// App.jsx
import { useState } from 'react'

function App() {
  const [word, setWord] = useState('')
  const [result, setResult] = useState(null)
  const [image, setImage] = useState(null)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const searchWord = async (event) => {
    event.preventDefault()

    const query = word.trim().toLowerCase()

    if (!query) return

    setStatus('Consulting the archives...')
    setError('')
    setResult(null)
    setImage(null)

    try {
      const collegiateUrl =
        `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${query}?key=${import.meta.env.VITE_DICTIONARY_1}`

      const learnerUrl =
        `https://www.dictionaryapi.com/api/v3/references/learners/json/${query}?key=${import.meta.env.VITE_DICTIONARY_2}`

      const imageUrl =
        `https://pixabay.com/api/?key=${import.meta.env.VITE_PIXABAY_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3`

      let dictionaryResponse = await fetch(collegiateUrl)
      let dictionaryData = await dictionaryResponse.json()

      if (
        !dictionaryResponse.ok ||
        !dictionaryData.length ||
        typeof dictionaryData[0] !== 'object'
      ) {
        dictionaryResponse = await fetch(learnerUrl)
        dictionaryData = await dictionaryResponse.json()
      }

      if (
        !dictionaryResponse.ok ||
        !dictionaryData.length ||
        typeof dictionaryData[0] !== 'object'
      ) {
        throw new Error('No definition found for that word.')
      }

      let imageData = { hits: [] }

      try {
        const imageResponse = await fetch(imageUrl)

        if (imageResponse.ok) {
          imageData = await imageResponse.json()
        }
      } catch (imageError) {
        console.warn(
          'Pixabay image search failed:',
          imageError
        )
      }

      setResult(dictionaryData[0])
      setImage(imageData.hits?.[0] || null)
      setStatus('')
    } catch (err) {
      setStatus('')
      setError(err.message || 'Something went wrong.')
    }
  }

  const getDefinition = () => {
    if (!result) return null

    const entry = result

    const definition =
      entry.shortdef?.[0] ||
      'No definition available.'

    const partOfSpeech =
      entry.fl ||
      'Word'

    const findExample = (data) => {
      if (!data) return null

      if (Array.isArray(data)) {
        if (
          data[0] === 'vis' &&
          Array.isArray(data[1])
        ) {
          const findText = (value) => {
            if (!value) return null

            if (Array.isArray(value)) {
              for (const item of value) {
                const found = findText(item)

                if (found) {
                  return found
                }
              }

              return null
            }

            if (
              typeof value === 'object' &&
              value.t
            ) {
              return value.t
                .replace(/\{wi\}/g, '')
                .replace(/\{\/wi\}/g, '')
                .replace(/\{it\}/g, '')
                .replace(/\{\/it\}/g, '')
            }
            return null
          }

          return findText(data[1])
        }

        for (const item of data) {
          const found = findExample(item)

          if (found) {
            return found
          }
        }

        return null
      }

      if (typeof data === 'object') {
        for (const value of Object.values(data)) {
          const found = findExample(value)

          if (found) {
            return found
          }
        }
      }

      return null
    }

    const example =
      findExample(entry.def) ||
      findExample(entry.suppl?.examples) ||
      'No example available.'

    const audioCode =
      entry.hwi?.prs?.[0]?.sound?.audio

    let audioUrl = null

    if (audioCode) {
      let audioFolder

      if (audioCode.startsWith('bix')) {
        audioFolder = 'bix'
      } else if (audioCode.startsWith('gg')) {
        audioFolder = 'gg'
      } else if (/^[0-9_]/.test(audioCode)) {
        audioFolder = 'number'
      } else {
        audioFolder = audioCode[0]
      }

      audioUrl =
        `https://media.merriam-webster.com/audio/prons/en/us/mp3/${audioFolder}/${audioCode}.mp3`
    }

    return {
      word:
        entry.meta?.id?.split(':')[0] || word,
      partOfSpeech,
      definition,
      example,
      audioUrl,
    }
  }

  const definition = getDefinition()

  return (
    <main className="wordly-page">
      <section className="wordly-app">
        <h1 className="wordly-title">
          Wordly
        </h1>

        <form
          className="search-form"
          onSubmit={searchWord}
        >
          <input
            className="search-input"
            type="text"
            placeholder="Search a word..."
            value={word}
            onChange={(event) =>
              setWord(event.target.value)
            }
            required
          />

          <button
            className="search-button"
            type="submit"
          >
            Search
          </button>
        </form>

        <div className="result-container">
          {status && (
            <p className="status">
              {status}
            </p>
          )}

          {error && (
            <p className="error">
              Oops: {error}
            </p>
          )}

          {definition && (
            <div className="word-result">
              <div className="word-header">
                <h2>
                  {definition.word}
                </h2>

                <span className="pos">
                  {definition.partOfSpeech}
                </span>
              </div>

              <div className="definition-section">
                <p className="definition">
                  <strong>
                    Definition:
                  </strong>{' '}
                  {definition.definition}
                </p>
              </div>

              <div className="example-section">
                <p className="example">
                  <em>
                    "{definition.example}"
                  </em>
                </p>
              </div>

              {definition.audioUrl && (
                <div className="pronunciation">
                  <p>
                    <strong>
                      Pronunciation
                    </strong>
                  </p>

                  <audio controls>
                    <source
                      src={definition.audioUrl}
                      type="audio/mpeg"
                    />

                    Your browser does not support
                    audio playback.
                  </audio>
                </div>
              )}

              {image && (
                <div className="image-section">
                  <img
                    src={image.webformatURL}
                    alt={definition.word}
                    className="word-img"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
