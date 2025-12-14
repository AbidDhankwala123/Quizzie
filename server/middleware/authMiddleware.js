const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const isAuthenticated = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return next(new AppError("Unauthorized", 401));
        }
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        console.log("req.user: " + req.user + "user: " + user);
        next();
    } catch (error) {
        return next(new AppError("Invalid or expired token", 401));
    }

}

module.exports = isAuthenticated