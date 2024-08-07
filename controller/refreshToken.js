const jwt = require("jsonwebtoken");
const User = require("../database/model/user");
const { createSecretToken } = require("../tokenGeneration/generateToken");

const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(403).json({ message: "Refresh token is required" });
    }

    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
        const user = await User.findById(payload.userId);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = createSecretToken(user._id);

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
            maxAge:  60 * 1000 // 1 minute
        });

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        console.error(error);
        return res.status(403).json({ message: "Invalid refresh token" });
    }
};

module.exports = refreshToken;
