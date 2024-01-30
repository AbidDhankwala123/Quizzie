import React from 'react'
import styles from "./NotFound.module.css"

const NotFound = () => {
  return (
    <div className={styles.not_found}>
      <div className={styles.container}>
        <h1 className={styles.title}>404 Error - Page Not Found</h1>
        <p className={styles.message}>
          Sorry, the page you're looking for does not exist.
        </p>
      </div>
    </div>
  )
}

export default NotFound
