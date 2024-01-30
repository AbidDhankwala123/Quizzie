const express = require("express");
const { createQuiz,updateQuiz,deleteQuiz,getAllQuizByUserId,getQuizByIdAndIncreaseImpressionsByOne,getQuizById } = require("../controllers/quizController");
const isAuthenticated = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/getAllQuiz/:quizOwnerId",isAuthenticated,getAllQuizByUserId);//get all quizzes
router.get("/:id", isAuthenticated, getQuizById);
router.get("/playQuiz/:id",getQuizByIdAndIncreaseImpressionsByOne);//get guiz by id and increment impressions count by 1
router.post("/",isAuthenticated,createQuiz);//create quiz
router.put("/:id",isAuthenticated,updateQuiz);//update quiz by id
router.put("/playQuiz/:id",updateQuiz);//update quiz by id without Authentication while submitting play quiz
router.delete("/:id",isAuthenticated,deleteQuiz);//delete quiz by id

module.exports = router
