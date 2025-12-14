const Quiz = require("../models/quiz");
const mongoose = require("mongoose");
const AppError = require("../utils/AppError");

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
        next(error);
    }
};


//Get Quiz by id and increment impressions count by 1
const getQuizByIdAndIncreaseImpressionsByOne = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("Invalid ID format", 400));
        }

        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return next(new AppError("No such Quiz exist", 404));
        }

        quiz.totalImpressions = quiz.totalImpressions + 1;

        await quiz.save();

        res.status(200).json({
            status: "SUCCESS",
            quiz
        })
    } catch (error) {
        next(error);
    }
}

const getQuizById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError("Invalid ID format", 400));
        }

        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return next(new AppError("No such Quiz exist", 404));
        }

        res.status(200).json({
            status: "SUCCESS",
            quiz
        })
    } catch (error) {
        next(error);
    }
}

//Create quiz
const createQuiz = async (req, res) => {
    try {
        const { quizOwnerId, quizName, quizType, questionSets, timer } = req.body;

        if (questionSets.length > 5) {
            return next(new AppError("Maximum 5 questions are allowed", 400));
        }

        let invalidOptions = questionSets.filter(q => q.optionSets.filter(o => o.isCorrectAnswer).length === 0);
        console.log("invalidOptions= " + invalidOptions.length);
        if (quizType === "Q&A" && invalidOptions.length > 0) {
            return next(new AppError("Correct answer must be selected for Q&A", 400));
        }

        const newQuiz = await Quiz.create({ quizOwnerId, quizName, quizType, questionSets, timer });

        res.status(200).json({
            message: "Quiz created successfully",
            quizId: newQuiz._id
        })
    } catch (error) {
        next(error);

    }
}

//Update Quiz by id
const updateQuiz = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { questionSets } = req.body;

        const quiz = await Quiz.findByIdAndUpdate(id, { questionSets });

        if (!quiz) {
            return next(new AppError("No such Quiz exist", 404));
        }

        res.json({
            status: "SUCCESS",
            message: "Quiz Updated Successfully",
            quiz
        })
    } catch (error) {
        next(error);
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
        next(error);
    }

}


module.exports = { createQuiz, updateQuiz, deleteQuiz, getAllQuizByUserId, getQuizById, getQuizByIdAndIncreaseImpressionsByOne }
