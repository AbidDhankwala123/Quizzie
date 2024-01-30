const checkError = (err, req, res, next) => {
    console.error(err.stack);

    // Check for specific errors and handle them accordingly
    if (err.name === 'ValidationError') {
        // Handle Mongoose validation errors
        return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ message: "Something went wrong! Please try again after some time" })
}

module.exports = checkError