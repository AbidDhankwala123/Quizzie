import React from 'react'
import styles from "./DeletePopup.module.css"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom'

const DeletePopup = ({ setDeletePopup, quizId, listQuizzes }) => {
  let navigate = useNavigate();

  console.log("quizId= "+quizId);

  const handleDelete = () => {
    axios.delete(`${process.env.REACT_APP_BACKEND_URL_FOR_QUIZ}/${quizId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwtToken")
      }
    })
      .then(response => {
        console.log(response);
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 1000
        })
        setDeletePopup(false);
        listQuizzes();
      })
      .catch(error => {
        if (error.response.status === 401) {
          toast.error("Invalid Session or Session expired. Please Log In again", {
            position: "top-center",
            autoClose: 2000
          })
          localStorage.clear();
          setTimeout(() => {
            navigate("/");
          }, 2000);
          return;
        }
        console.log(error);
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 1000
        });
      })
  }
  
  return (
    <div className={styles.deletePopup_container}>
      <div className={styles.deleteQuiz_popup}>
        <p>Are you confirm you want to delete?</p>
        <div className={styles.btn_container}>
          <button onClick={handleDelete}>Confirm Delete</button>
          <button onClick={() => setDeletePopup(false)}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default DeletePopup
