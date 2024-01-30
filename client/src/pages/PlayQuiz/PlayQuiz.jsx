import React, { useEffect, useState } from 'react'
import styles from "./PlayQuiz.module.css";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import Loader from '../../components/Loader/Loader';
import QnAQuizResult from '../../components/QnAQuizResult/QnAQuizResult';
import PollQuizResult from '../../components/PollQuizResult/PollQuizResult';
import bird from "../../assets/bird.png"

const Playquiz = () => {

    const [quizData, setQuizData] = useState();
    const { playQuizId } = useParams();
    let [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState()
    const [selectedOptionIndex, setSelectedOptionIndex] = useState();
    const [timer, setTimer] = useState();
    let [score, setScore] = useState(0);
    const [showQnAQuizResult, setQnAQuizResult] = useState(false);
    const [showPollQuizResult, setPollQuizResult] = useState(false);
    const [showGameSection, setGameSection] = useState(true);

    let navigate = useNavigate();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL_FOR_QUIZ}/${playQuizId}`)
            .then(response => {
                //console.log(response);
                setQuizData(response.data.quiz);
                if (response.data.quiz.quizType === "Q&A" && response.data.quiz.timer > 0) {
                    setTimer(response.data.quiz.timer) //set timer only if > 0
                }
            })
            .catch(error => {
                if (error.response.status === 404 || error.response.status === 400) {
                    navigate("/notFound");
                }
                toast.error(error.response.data.message, {
                    position: "top-center",
                    autoclose: 1000
                })
                console.error(error)

            }
            )
    }, [])

    useEffect(() => {
        if (quizData && timer !== undefined) {
            //console.log("timer="+timer);
            if (timer > 0) {
                const intervalId = setInterval(() => {
                    setTimer(prevTimer => prevTimer - 1);
                }, 1000);

                // Clear the interval when the component is unmounted or timer reaches 0
                return () => clearInterval(intervalId);
            } else {
                // Timer reached 0, call next button i.e. handleNextForQandA
                console.log("Timer reached 0");
                // handleNextForQandA();

            }
        }
    }, [timer]);

    // Format timer as "00:09"
    const formattedTimer = `${String(timer % 60).padStart(2, '0')}`;


    if (!quizData) {
        // If quizData is still loading, you can return a loading indicator or null
        return <Loader />;
    }

    const submitQuiz = () => {
        axios.put(`${process.env.REACT_APP_BACKEND_URL_FOR_QUIZ}/playQuiz/${playQuizId}`, { questionSets: quizData.questionSets }, { headers: { "Content-Type": "application/json" } })
            .then(response => {
                console.log(response);

            })
            .catch(error => console.error(error))
    }

    const handleNextForQandA = () => {
        //console.log(selectedOption);
        if (selectedOption && selectedOption.isCorrectAnswer === true) {
            setScore(++score);
            quizData.questionSets[currentIndex].totalAttempted = quizData.questionSets[currentIndex].totalAttempted + 1;
            quizData.questionSets[currentIndex].totalCorrect = quizData.questionSets[currentIndex].totalCorrect + 1;

        }
        else if (selectedOption && selectedOption.isCorrectAnswer === false) {
            quizData.questionSets[currentIndex].totalAttempted = quizData.questionSets[currentIndex].totalAttempted + 1;
            quizData.questionSets[currentIndex].totalIncorrect = quizData.questionSets[currentIndex].totalIncorrect + 1;
        }
        else {
            quizData.questionSets[currentIndex].totalIncorrect = quizData.questionSets[currentIndex].totalIncorrect + 1;
        }

        if (quizData.questionSets.length - 1 > currentIndex) { // next button clicked
            setCurrentIndex(++currentIndex);
            setSelectedOptionIndex();
            setSelectedOption();
            if (quizData.timer > 0) {
                setTimer(quizData.timer) // reset to original value
            }

        } else {
            console.log("SUBMIT clicked");

            setTimer() // timer stop on submit

            submitQuiz();

            setQnAQuizResult(true);
            setGameSection(false);
        }

    }

    const handleNextForPoll = () => {
        if (selectedOption) {
            quizData.questionSets[currentIndex].optionSets[selectedOptionIndex].optionPollCount = quizData.questionSets[currentIndex].optionSets[selectedOptionIndex].optionPollCount + 1;
        }
        if (quizData.questionSets.length - 1 > currentIndex) {
            setCurrentIndex(++currentIndex);
            setSelectedOptionIndex();
            setSelectedOption();
        } else {

            console.log("SUBMIT clicked");
            submitQuiz();
            setPollQuizResult(true);
            setGameSection(false);
        }
    }

    const handleOptionSelect = (option, index) => {
        setSelectedOption(option);
        setSelectedOptionIndex(index);

    }

    const totalQuestions = `${String(quizData.questionSets.length).padStart(2, '0')}`;
    const formattedIndex = `${String(currentIndex + 1).padStart(2, '0')}`;

    return (

        <div className={styles.parent}>
            {showGameSection && <div className={styles.childBox}>

                <section className={styles.section_1}>
                    <span>{formattedIndex}/{totalQuestions}</span>
                    {timer > 0 && <span className={styles.timer}>00:{formattedTimer}s</span>}
                    
                </section>

                <h1>{quizData.questionSets[currentIndex].pollQuestion}</h1>

                <section className={styles.section_2}>
                    {quizData.questionSets[currentIndex].optionSets.map((option, index) => {
                        return (
                            <div key={index}
                                className={index === selectedOptionIndex ? styles.selectedOption : ""}
                                onClick={() => handleOptionSelect(option, index)}
                            >
                                {option.optionText && option.optionText.length > 0 && <div>{option.optionText}</div>}
                                {option.optionImageUrl && option.optionImageUrl.length > 0 && <div>
                                    <img src={option.optionImageUrl} className={styles.image_url} alt="" />
                                </div>}
                                
                                
                            </div>
                        )
                    })}


                </section>
                <button onClick={quizData.quizType === "Q&A" ? handleNextForQandA : handleNextForPoll}>{quizData.questionSets.length - 1 > currentIndex ? "Next" : "Submit"}</button>
            </div>}

            {showQnAQuizResult && <QnAQuizResult score={score} totalQuestions={quizData.questionSets.length} />}
            {showPollQuizResult && <PollQuizResult />}

            <ToastContainer />
        </div>
    )
}

export default Playquiz;
