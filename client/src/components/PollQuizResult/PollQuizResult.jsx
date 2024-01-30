import React from 'react'
import styles from "./PollQuizResult.module.css"

const PollQuizResult = () => {
  return (
    <div className={styles.result_container}>
      <div>
        <h1>Thank you</h1>
        <h1>for participating in</h1>
        <h1>the Poll</h1>
      </div>
    </div>
  )
}

export default PollQuizResult
