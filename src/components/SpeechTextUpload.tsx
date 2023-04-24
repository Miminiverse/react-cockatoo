import React, {ChangeEvent, useState} from 'react'
import styles from '@asset/App.module.css'

const SpeechTextUpload = () => {

    const WHISPER_TRANSCRIPTION_URL = "https://api.openai.com/v1/audio/transcriptions"

    const [formData, setFormData] = useState<FormData | null>(null)
    const [convertedText, setConvertedText] = useState("");

    const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const data = new FormData()
            data.append("file", file)
            data.append("model", "whisper-1")
            data.append("language", "en")
            setFormData(data)
            // check to see what's inside formData
            // for (const entry of data.entries()) {
            //     console.log(entry);
                
            // }
            // file upload will be in bytes 
            // maximum file in whisper is 25mb
            if (file.size > 25 * 1024 * 1024) {
                alert("Please upload an audio file less than 25MB")
                return
            }
        }
    }


    const handleSendFile = async () => {

        const response = await fetch(WHISPER_TRANSCRIPTION_URL, {
            headers: {
                Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            },
            method: "POST",
            body: formData
        })
        const data = await response.json()
        console.log(data);
        setConvertedText(data.text)
    }
    

return (
    <>
    <div>
        <input 
        type="file"
        accept="audio/*"
        onChange={handleFile}
        />
        <button 
        className={styles.buttonSpeech} 
        onClick={handleSendFile}>
            Upload File
        </button>
        <div className={styles.lists}>
            <div className={styles.list}> 
                <span>{convertedText} </span>

            </div>
        </div>
    </div>
    </>
)
}

export default SpeechTextUpload