import React, {useState} from 'react'
import paths from '@root/paths'
import styles from '@asset/NavBar.module.css'
import ThemeToggle from './ThemeToggle'
import burger from '@asset/burger.svg'

const NavBar = () => {
    const [showNav, setShowNav] = useState<boolean>(false)

    const toggleNavItems = () => {
        setShowNav(!showNav)
    }

    return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
      <ThemeToggle />
      <span className={styles.navTitle}> 📓 Todo 📓</span>
        <div className={styles.menu} onClick={toggleNavItems}>
            <img src={burger} alt="burger menu" className={styles.burger}/>
        </div>
        <div className={`${styles.navElements} ${ showNav ? styles.active : ""}`}>
        <ul>
        <li>
            <a href={paths.HOME} >Home</a>
          </li>
          <li className={styles.li}>
            <a href={paths.NEW_TODO}>Add</a>
          </li>
        </ul>
      </div>
      </div>
    </nav>
  )
}

export default NavBar