import React, {useState} from 'react'
import paths from '@root/paths'
import { NavLink } from 'react-router-dom'
import styles from '@asset/NavBar.module.css'
import ThemeToggle   from '@components/ThemeToggle'
import burger from '@asset/burger.svg'
const NavBar = () => {
    const [showNav, setShowNav] = useState<boolean>(false)

    const toggleNavItems = () => {
        console.log("click")
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
        <div className={`${styles.navElements} ${showNav && styles.active}`}>
        <ul>
        <li>
            <NavLink to={paths.HOME}>Home</NavLink>
          </li>
          <li>
            <NavLink to={paths.NEW_TODO}>Add</NavLink>
          </li>
        </ul>
      </div>

      </div>
    </nav>
  )
}

export default NavBar