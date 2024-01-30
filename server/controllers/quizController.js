const Quiz = require("../models/quiz");
const mongoose = require("mongoose");

//Get All Quiz
const getAllQuizByUserId = async (req, res) => {
    try {
        const { quizOwnerId } = req.params;

        // Get dashboard quizzes where totalImpressions > 10
        const dashboardQuizzes = await Quiz.find({ quizOwnerId, totalImpressions: { $gt: 10 } })
            .sort({ totalImpressions: -1 }); // sort by impressions desc

        // Get all analytics quizzes
        const analyticsQuizzes = await Quiz.find({ quizOwnerId })
            .sort({ createdAt: 1 }); // sort by createdAt asc

        res.status(200).json({
            status: "SUCCESS",
            dashboardQuizzes,
            analyticsQuizzes
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


//Get Quiz by id and increment impressions count by 1
const getQuizByIdAndIncreaseImpressionsByOne = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).json({ message: "No such Quiz exist" });
        }

        quiz.totalImpressions = quiz.totalImpressions + 1;

        await quiz.save();

        res.status(200).json({
            status: "SUCCESS",
            quiz
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

const getQuizById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).json({ message: "No such Quiz exist" });
        }

        res.status(200).json({
            status: "SUCCESS",
            quiz
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

//Create quiz
const createQuiz = async (req, res) => {
    try {
        const { quizOwnerId, quizName, quizType, questionSets, timer } = req.body;

        if(questionSets.length > 5){
            return res.status(400).json({message:"Maximum 5 questions are allowed"});
        }

        let invalidOptions = questionSets.filter(q => q.optionSets.filter(o => o.isCorrectAnswer).length === 0);
        console.log("invalidOptions= " + invalidOptions.length);
        if (quizType === "Q&A" && invalidOptions.length > 0) {
            return res.status(400).json({ message: "Correct answer must be selected for Q&A" });
        }

        invalidOptions = questionSets.filter(q => q.optionSets.length != 2 && q.optionSets.length != 4)
        if (invalidOptions.length > 0) {
            return res.status(400).json({ message: "Either 2 or 4 options are allowed" });
        }

        const newQuiz = await Quiz.create({ quizOwnerId, quizName, quizType, questionSets, timer });

        res.status(200).json({
            message: "Quiz created successfully",
            quizId: newQuiz._id
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message})

    }
}

//Update Quiz by id
const updateQuiz = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { questionSets } = req.body;

        const quiz = await Quiz.findByIdAndUpdate(id, { questionSets });

        if (!quiz) {
            // No quiz found with the provided ID
            return res.status(404).json({
                status: "NOT_FOUND",
                message: "No such quiz exist"
            });
        }

        res.json({
            status: "SUCCESS",
            message: "Quiz Updated Successfully",
            quiz
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }

}

//Delete Quiz by id
const deleteQuiz = async (req, res, next) => {
    try {
        const { id } = req.params;

        await Quiz.findByIdAndDelete(id);

        res.status(200).json({
            status: "SUCCESS",
            message: "Quiz Deleted Successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }

}


module.exports = { createQuiz, updateQuiz, deleteQuiz, getAllQuizByUserId, getQuizById, getQuizByIdAndIncreaseImpressionsByOne }
