import {useContext} from 'react';
import {ThemeContext} from "./ThemeContext";

export default function ThemeToggle () {
    
    const {isDarkMode, toggleTheme} = useContext(ThemeContext)

    return (
        <>
        <button onClick={toggleTheme}>
            {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
        </>
    )
}