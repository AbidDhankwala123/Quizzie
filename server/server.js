const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const checkError = require("./middleware/errorMiddleware");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use("/", require("./routes/userRoutes"));
app.use("/api/quiz",require("./routes/quizRoutes"));

//Handling Error Midddleware
app.use(checkError);

app.listen(process.env.PORT, () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => console.log(`Server running successfully on http://localhost:${process.env.PORT}`))
        .catch(error => console.log(error))
})
