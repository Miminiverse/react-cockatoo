
import React, { useEffect, useState } from 'react';
import styles from '../static/App.module.css'
import PropTypes from 'prop-types'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

function SpeechText({onAddSpeechTodo}) {
const [isListening, setIsListening] = useState(false)
const [note, setNote] = useState(null)


useEffect(() => {
  handleListen()
}, [isListening])

const handleListen = () => {
  if (isListening) {
    mic.start()
    mic.onend = () => {
      console.log('continue..')
      mic.start()
    }
  } else {
    mic.stop()
    mic.onend = () => {
      console.log('Stopped Mic on Click')
    }
  }
  mic.onstart = () => {
    console.log('Mics on')
  }

  mic.onresult = event => {
    const transcript = Array.from(event.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('')
    setNote(transcript)
    mic.onerror = event => {
      console.log(event.error)
    }
  }
}

function handleSaveNote() {
    if (!note) {
        alert("Please speak")
    } else {
        onAddSpeechTodo({
            title: note
        })
    }
    setNote("")
    setIsListening(prevState => !prevState)
}

  return (
    <>
      <div>
        <div className={styles.boxSpeech}>
          {isListening ? <span>🎙️</span> : <span>🛑</span>}
          <button 
            className={styles.buttonSpeech} 
          onClick={() => setIsListening(prevState => !prevState)}>
            Start/Stop
          </button>
          <button
          className={styles.buttonSpeech} 
          onClick={handleSaveNote} 
          disabled={!note}>
            Add
          </button>

        </div>  
          <div className={styles.note}>
          <p>{note}</p>
          </div>
        </div>

    </>
)}


export default SpeechText;

SpeechText.propTypes = {
  onAddSpeechTodo: PropTypes.func,
}