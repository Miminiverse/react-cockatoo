
import React, { useEffect, useState } from 'react';
import styles from '../static/App.module.css'

declare var window: any;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

interface SpeechTextProps {
  onAddSpeechTodo: (note: {title: string}) => void
}

export default function SpeechText({onAddSpeechTodo}: SpeechTextProps) {
const [isListening, setIsListening] = useState(false)
const [note, setNote] = useState<string | null>(null)


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

  mic.onresult = (event: any) => {
    const transcript = Array.from(event.results as Array<{ [key: string]: any}>)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('')
    setNote(transcript)
    mic.onerror = (event: any) => {
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

