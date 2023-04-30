
import React, { useEffect, useState } from 'react';
import styles from '@asset/App.module.css'

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
const [isClick, setIsClick] = useState(false)
const [note, setNote] = useState<string | null>(null)


useEffect(() => {
  handleListen()
}, [isListening])

const handleClickListen = () => {
  setIsListening(prevState => !prevState)
  setIsClick(true)
}

const handleListen = () => {

  if (isListening) {
    mic.start()
    mic.onend = () => {
      mic.start()
    }
  } else {
    mic.stop()
    setNote("")
    mic.onend = () => {
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
        {isClick ? (
          isListening ? <span>🎙️</span> : <span>🛑</span>
        )  
        : null }
          <button 
            className={styles.button} 
            onClick={handleClickListen}>
            Start/Stop
          </button>
          <button
          className={styles.button} 
          onClick={handleSaveNote} 
          disabled={!note}>
            Add
          </button>

        </div>  
        { note ? 
        <div className={styles.note}>
          <p>{note}</p>
        </div>
        : null}
        </div>

    </>
)}

