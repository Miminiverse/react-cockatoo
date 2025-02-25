import React, { useState, useEffect } from "react";
import styles from '@asset/App.module.css'


interface TextToSpeechProps {
  convertedText: string;
  onAddTextTodo: (convertedText: {title: string}) => void
}

const TextToSpeech:React.FC<TextToSpeechProps> = ({ convertedText, onAddTextTodo }) => {
  const [show, setShow] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [voice, setVoice] = useState<null | SpeechSynthesisVoice>(null);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(0.9);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (convertedText) {
        const synth = window.speechSynthesis;
        const u = new SpeechSynthesisUtterance(convertedText);
        console.log(typeof(u))
        setUtterance(u);
        setShow(true)
    
        // Add an event listener to the speechSynthesis object to listen for the voices changed event
        synth.addEventListener("voiceschanged", () => {
          const voices = synth.getVoices();
          setVoice(voices[0]);
        });
    
        return () => {
          synth.cancel();
          synth.removeEventListener("voiceschanged", () => {
            setVoice(null);
          });
        };
    }

  }, [convertedText]);

  const handlePlay = () => {
    const synth = window.speechSynthesis;

    if (isPaused) {
      synth.resume();
    } else {
      if (utterance) {
      utterance.voice = voice;
      utterance.pitch = pitch;
      utterance.rate = rate;
      utterance.volume = volume;
      synth.speak(utterance);
      }
    }

    setIsPaused(false);
  };

  const handlePause = () => {
    const synth = window.speechSynthesis;
    setIsPaused(true);
    synth.pause();
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;
    setIsPaused(false);
    synth.cancel();
  };

//   const handleVoiceChange = (event) => {
//     const voices = window.speechSynthesis.getVoices();
//     setVoice(voices.find((v) => v.name === event.target.value));
//   };

  // const handlePitchChange = (event) => {
  //   setPitch(parseFloat(event.target.value));
  // };

  // const handleRateChange = (event) => {
  //   setRate(parseFloat(event.target.value));
  // };

  // const handleVolumeChange = (event) => {
  //   setVolume(parseFloat(event.target.value));
  // };

  const handleSaveText = () => {
    if (!convertedText) {
        alert("Please upload a file")
    } else {
        onAddTextTodo({
            title: convertedText
        })
    }
    // setConvertedText("")
    // setIsListening(prevState => !prevState)
}

  return (
    <>
    {show ? 
    <div className={styles.boxSpeech}>
      <button
      className={styles.button} 
      onClick={handlePlay}>{isPaused ? "Resume" : "Play"}
      </button>
      <button 
      className={styles.button} 
      onClick={handlePause}>Pause
      </button>
      <button
      className={styles.button} 
      onClick={handleStop}>Stop
      </button>
      <button
        className={styles.button} 
        onClick={handleSaveText} 
        disabled={!convertedText}>
            Add
        </button>

    </div>
      : null
    }
    </>
  );
};

export default TextToSpeech;
