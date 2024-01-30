import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import ShowDashboard from '../../components/ShowDashboard/ShowDashboard'
import ShowAnalytics from '../../components/ShowAnalytics/ShowAnalytics'
import DeletePopup from '../../components/DeletePopup/DeletePopup'
import QAWiseAnalysis from '../../components/QAWiseAnalysis/QAWiseAnalysis'
import PollWiseAnalysis from '../../components/PollWiseAnalysis/PollWiseAnalysis'
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"
import CreateQuiz from '../../components/CreateQuiz/CreateQuiz'
import { useNavigate } from 'react-router-dom'


const Home = ({ setLogoutMessage }) => {
  let navigate = useNavigate();

  const [showAnalytics, setAnalytics] = useState(false);
  const [showDashboard, setDashboard] = useState(true);

  const [showDeletePopup, setDeletePopup] = useState(false);
  const [quizId, setQuizId] = useState();
  const [dashboardQuizzes, setDashboardQuizzes] = useState("");
  const [analyticsQuizzes, setAnalyticsQuizzes] = useState("");
  const [showQAAnalysis, setQAAnalysis] = useState(false);
  const [showPollAnalysis, setPollAnalysis] = useState(false);

  const [quiz, setQuiz] = useState("");


  const [showCreateQuizPage, setCreateQuizPage] = useState(false);
  const [showCreateQuizPopup, setCreateQuizPopup] = useState(true);
  const [showQuestionSetsPopup, setQuestionSetsPopup] = useState(false);
  const [showQuizPublished, setQuizPublished] = useState(false);

  const [quizType, setQuizType] = useState("");
  const [optionText, setOptionText] = useState("");
  const [optionImageUrl, setOptionImageUrl] = useState("");
  const [isCorrectAnswer, setCorrectAnswer] = useState(false);

  const [pollQuestion, setPollQuestion] = useState("");
  const [optionType, setOptionType] = useState("Text");

  const [questionSets, setQuestionSets] = useState([
    {
      pollQuestion,
      optionType,
      optionSets: [
        {
          optionText,
          optionImageUrl,
          isCorrectAnswer
        },
        {
          optionText,
          optionImageUrl,
          isCorrectAnswer
        }
      ]
    }
  ]);

  
  const [optionSets, setOptionSets] = useState(
    [
      { optionText: "", optionImageUrl: "", isCorrectAnswer: false },
      { optionText: "", optionImageUrl: "", isCorrectAnswer: false }
    ]
  );

  const [timer, setTimer] = useState(0);

  const quizOwnerId = localStorage.getItem("quizOwnerId");

  const listQuizzes = () => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL_FOR_QUIZ}/getAllQuiz/${quizOwnerId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwtToken")
      }
    })
      .then(response => {
        setDashboardQuizzes(response.data.dashboardQuizzes);
        setAnalyticsQuizzes(response.data.analyticsQuizzes);
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
        console.error(error);
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 1000
        });
      })
  }



  useEffect(() => {
    listQuizzes();
  }, [])

  return (
    <div>
      <div style={{ display: "flex" }}>

        <Sidebar setCreateQuizPage={setCreateQuizPage} setCreateQuizPopup={setCreateQuizPopup} setQuestionSetsPopup={setQuestionSetsPopup} setQAAnalysis={setQAAnalysis} setPollAnalysis={setPollAnalysis} setDashboard={setDashboard} setAnalytics={setAnalytics} setLogoutMessage={setLogoutMessage} setQuizPublished={setQuizPublished} setQuizId={setQuizId} setQuizType={setQuizType} setQuestionSets={setQuestionSets} setTimer={setTimer} 
        setPollQuestion = {setPollQuestion} setOptionType={setOptionType} setOptionSets={setOptionSets}/>

        {showDashboard && <ShowDashboard dashboardQuizzes={dashboardQuizzes} />}

        {showAnalytics && <ShowAnalytics setDashboard={setDashboard} setAnalytics={setAnalytics} setQuizId={setQuizId} setQAAnalysis={setQAAnalysis} setPollAnalysis={setPollAnalysis} setDeletePopup={setDeletePopup} analyticsQuizzes={analyticsQuizzes} setQuiz={setQuiz} setCreateQuizPage={setCreateQuizPage} setQuestionSetsPopup={setQuestionSetsPopup} setCreateQuizPopup={setCreateQuizPopup} setQuizType={setQuizType} setQuestionSets={setQuestionSets} setTimer={setTimer} 
        setPollQuestion = {setPollQuestion} setOptionType={setOptionType} setOptionSets={setOptionSets} setQuizPublished={setQuizPublished} />}

        {showQAAnalysis && <QAWiseAnalysis quiz={quiz} />}

        {showPollAnalysis && <PollWiseAnalysis quiz={quiz} />}

      </div>

      {showDeletePopup && <DeletePopup quizId={quizId} setDeletePopup={setDeletePopup} listQuizzes={listQuizzes} />}

      {showCreateQuizPage && <CreateQuiz setCreateQuizPage={setCreateQuizPage} showCreateQuizPopup={showCreateQuizPopup} showQuestionSetsPopup={showQuestionSetsPopup} setCreateQuizPopup={setCreateQuizPopup} setQuestionSetsPopup={setQuestionSetsPopup} showQuizPublished={showQuizPublished} setQuizPublished={setQuizPublished} quizId={quizId} quizType={quizType} setQuizType={setQuizType} questionSets={questionSets} setQuestionSets={setQuestionSets} timer={timer} setTimer={setTimer} pollQuestion={pollQuestion} setPollQuestion={setPollQuestion} optionType={optionType} setOptionType={setOptionType}
      optionSets = {optionSets} setOptionSets = {setOptionSets} listQuizzes={listQuizzes}  />}
      
      <ToastContainer />
    </div>
  )
}

export default Home
