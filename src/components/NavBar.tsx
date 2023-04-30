import React, {useState} from 'react'
import paths from '@root/paths'
import { NavLink } from 'react-router-dom'
import styles from '@asset/NavBar.module.css'
import ThemeToggle   from '@components/ThemeToggle'

const NavBar = () => {
    const [showNav, setShowNav] = useState<boolean>(false)

    const toggleNavItems = () => {
        setShowNav(prevNav => !prevNav)
    }

    return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
      <ThemeToggle />
      <span className={styles.navTitle}> 📓 TodoList 📓</span>

      <div className={styles.navElements}>
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