const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//health check method
const checkHealth = (req, res) => {
    res.status(200).json({
        server: req.headers.host,
        service: "Job Listing Platform",
        status: "ACTIVE",
        time: new Date(),
    })
}

//registered user
const registeredUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "All Fields are required" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Password and Confirm Password do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({message:"User already exists"});
    }

    const encryptedPassword = await bcrypt.hash(password, 10)
    await User.create({ name, email, password: encryptedPassword })

    res.status(200).json({
        status: "SUCCESS",
        message: "You are Registered Successfully. Please Log In to proceed further",
    })
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Something went wrong"});
    }
    
}

//login user
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All Fields are required" });
        }
        const user = await User.findOne({ email });//user is mongoose object or mongodb object,so we need to convert it into json
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                const jwtToken = jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: 60 * 60 }) // 1 hour
                res.status(200).json({
                    status: "SUCCESS",
                    name: user.name,
                    id:user._id,
                    message: "You are Logged In Successfully",
                    jwtToken
                })
            }
            else {
                return res.status(400).json({message:"Invalid credentials"});
            }
        }
        else {
            return res.status(400).json({message:"Invalid credentials"});
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Invalid credentials"});
    }

}

module.exports = { checkHealth, registeredUser, loginUser }