const User = require("../database/model/user");
const bcrypt = require("bcrypt");
const env = require("dotenv");
const { createSecretToken, createRefreshToken } = require("../tokenGeneration/generateToken");

env.config();

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!(email && password)) {
        return res.status(400).json({ message: "All input is required" });
    }
    const user = await User.findOne({ email }).lean();
    if (!(user && (await bcrypt.compare(password, user.password)))) {
        return res.status(404).json({ message: "Invalid credentials" });
    }

    const accessToken = createSecretToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    // Store the refresh token in the database
    await User.findByIdAndUpdate(user._id, { refreshToken }, { new: true });


    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge:  60 * 1000 // 1 minute
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 5 * 60 * 1000 // 2 days
    });

    res.json({ message: "Logged in successfully" });
};

module.exports = login;
