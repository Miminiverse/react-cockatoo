import React, {ChangeEvent, useState} from 'react'
import TextToSpeech from './TextToSpeech'
import styles from '@asset/App.module.css'

interface SpeechTextProps {
    onAddTextTodo: (convertedText: {title: string}) => void
}

const SpeechTextUpload: React.FC<SpeechTextProps> = ({onAddTextTodo}) => {

    const WHISPER_TRANSCRIPTION_URL = "https://api.openai.com/v1/audio/translations"

    const [formData, setFormData] = useState<FormData | null>(null)
    const [fileName, setFileName] = useState<string>("")
    const [convertedText, setConvertedText] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const fileName = e.target.files[0].name
            setFileName(fileName)
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
        setIsLoading(true)
        try {
            const response = await fetch(WHISPER_TRANSCRIPTION_URL, {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                },
                method: "POST",
                body: formData
            })
            const data = await response.json()
            setConvertedText(data.text)
          
        } catch (err) {
            console.log(err);
        } finally {

            setIsLoading(false)
        }
    }


    

return (
    <>
    <div className={styles.speechText}>
        <div className={styles.uploadBox}>
            <input 
            className={styles.inputFile}
            id="file"
            type="file"
            accept="audio/*"
            onChange={handleFile}
            />
            <label 
            htmlFor='file'
            className={styles.file}>
            📃 Choose File 
            </label>
            <p className={styles.file}><em>{fileName}</em></p>
        <button 
        className={styles.button} 
        onClick={handleSendFile}>
            Upload File
        </button>
        </div>
        <br />
        <TextToSpeech 
        convertedText={convertedText} 
        onAddTextTodo={onAddTextTodo}
        />


        {isLoading ?  
        <p className={styles.loading}>... Converting ... </p> 
        : 
            (
            <div className={styles.lists}>
            {convertedText ? (
            <div className={styles.list}> 
            <span>{convertedText} </span>
            </div>
            ) : null}     
            </div>
            )
        }

    </div>
    </>
)
}

export default SpeechTextUpload