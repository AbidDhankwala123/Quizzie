const checkError = (err, req, res, next) => {
    console.error(err);

    const statusCode = err.statusCode ? err.statusCode : 500;
    const errorMessage = err.message ? err.message : "Internal Server Error";

    res.status(statusCode).json({ errorMessage });
}

module.exports = checkError