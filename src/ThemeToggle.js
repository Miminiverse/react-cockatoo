import {useContext} from 'react';
import {ThemeContext} from "./ThemeContext";
import styles from './static/App.module.css'

const ThemeToggle = () => {
    
    const {isDarkMode, toggleTheme} = useContext(ThemeContext)

    return (
    <>
        <div className={styles.wrapCheckbox}>
            <input 
            type="checkbox" 
            className={styles.checkbox} 
            id="checkbox" 
            onChange={toggleTheme}
            />
            <label 
            htmlFor="checkbox" 
            className={styles.label}>
            <i className="fas fa-moon"></i>
            <i className='fas fa-sun'></i>
            <div className={styles.ball} />
            </label>
        </div>
    </>
    )
}

export default ThemeToggle