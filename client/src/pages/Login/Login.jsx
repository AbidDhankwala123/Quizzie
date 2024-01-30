import React, { useEffect, useState } from 'react'
import styles from "./Login.module.css"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Login = ({ logoutMessage, setLogoutMessage }) => {

  const [login, setLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  let navigate = useNavigate();

  const handleName = e => setName(e.target.value);

  const handleEmail = e => setEmail(e.target.value);

  const handlePassword = e => setPassword(e.target.value);

  const handleConfirmPassword = e => setConfirmPassword(e.target.value);

  const registerUserObject = {
    name,
    email,
    password,
    confirmPassword
  }

  const loginUserObject = {
    email,
    password
  }
  const validateName = () => {
    let regex = new RegExp("^[a-zA-Z\\s]*$");
    if (regex.test(name) === false) {
      toast.error("Name must be in Characters", {
        position: "top-center",
        autoClose: 1000
      })
      return true;
    }
    return false;
  }
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address", {
        position: "top-center",
        autoClose: 2000
      })
      return true;
    }
    return false;
  };

  const validatePassword = () => {
    let regex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
    if (regex.test(password) === false) {
      toast.error("Password must contain atleast 1 uppercase,1 lowercase,1 special symbol and 1 numeric and minimum 8 characters long", {
        position: "top-center",
        autoClose: 2000
      })
      return true;
    }
    return false;

  }

  const validateConfirmPassword = () => {
    if(password !== confirmPassword){
      toast.error("Password and Confirm Password do not match", {
        position: "top-center",
        autoClose: 1000
      })
      return true;
    }
    return false;
  }
  
  const validateAllFields = () => {
    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are required", {
        position: "top-center",
        autoClose: 1000
      })
      return true;
    }
    return false;
  }

  const validateLoginFields = () => {
    if (!email || !password) {
      toast.error("All fields are required", {
        position: "top-center",
        autoClose: 1000
      })
      return true;
    }
    return false;
  }

  const handleSignUp = e => {
    e.preventDefault();

    if (validateAllFields() || validateName() || validateEmail() || validatePassword() || validateConfirmPassword()) {
      return;
    }


    axios.post(`${process.env.REACT_APP_BACKEND_URL_FOR_AUTH}/register`, registerUserObject, { headers: { "Content-Type": "application/json" } })
      .then(response => {
        console.log(response);
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 2000
        })
        setLogin(false);
        setEmail("");
        setPassword("");
      })
      .catch(error => {
        console.log(error);
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 2000
        })
      })
  }

  const handleLogin = e => {
    e.preventDefault();

    if (validateLoginFields() || validateEmail() || validatePassword()) {
      return;
    }
    
    axios.post(`${process.env.REACT_APP_BACKEND_URL_FOR_AUTH}/login`, loginUserObject, { headers: { "Content-Type": "application/json" } })
      .then(response => {
        console.log(response);
        localStorage.setItem("jwtToken", response.data.jwtToken);
        localStorage.setItem("quizOwnerId", response.data.id);
        localStorage.setItem("userName", response.data.name);
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 1000
        })
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      })
      .catch(error => {
        console.log(error);
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 2000
        })
      })
  }

  useEffect(() => {
    logoutMessage && toast.success(logoutMessage, {
      position: "top-center",
      autoClose: 1000
    });
    setLogoutMessage("");
  }, [])


  return (
    <div className={styles.login_container}>
      <div className={styles.form_container}>
        <h1>QUIZZIE</h1>
        <div className={styles.btns_container}>
          <div className={`${styles.signup_btn} ${login && styles.shadow}`} onClick={() => setLogin(true)}>
            Sign Up
          </div>
          <div className={`${styles.login_btn} ${!login && styles.shadow}`} onClick={() => setLogin(false)}>
            Log In
          </div>
        </div>
        <form onSubmit={login ? handleSignUp : handleLogin}>
          {login && <><div>
            <label htmlFor="name" className={styles.name}>Name</label>
            <input type="text" name="name" value={name} onChange={handleName} />
          </div><br /></>}
          <div>
            <label htmlFor="email" className={styles.email}>Email</label>
            <input type="email" name="email" value={email} onChange={handleEmail} />
          </div><br />
          <div>
            <label htmlFor="password" className={styles.password}>Password</label>
            <input type="text" name="password" value={password} onChange={handlePassword} />{/*later change to password*/}
          </div><br />
          {login && <><div>
            <label htmlFor="confirmPassword" className={styles.confirmPassword}>Confirm Password</label>
            <input type="text" name="confirmPassword" value={confirmPassword} onChange={handleConfirmPassword} />
          </div><br /><br /></>}
          <div>
            <button className={styles.signup_login_btn}>{login ? "Sign-Up" : "Login"}</button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Login
