const User = require("../database/model/user");
const bcrypt = require("bcrypt");
const { createSecretToken } = require("../tokenGeneration/generateToken");

const createUser = async (req, res) => {
  try {
    // Validate required inputs
    if (!(req.body.email && req.body.password && req.body.name && req.body.username)) {
      return res.status(400).send("All input is required");
    }

    // Check if the user already exists
    const oldUser = await User.findOne({ email: req.body.email });
    if (oldUser) {
      return res.status(409).send("User Already Exists. Please Login");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user with role 'user' (default)
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      role: 'user', // Set the role here
    });

    // Save the new user to the database
    const user = await newUser.save();

    // Generate a token
    const token = createSecretToken(user._id);

    // Set a cookie with the token (optional)
    res.cookie("token", token, {
      path: "/", // Cookie is accessible from all paths
      expires: new Date(Date.now() + 86400000), // Cookie expires in 1 day
      secure: true, // Cookie will only be sent over HTTPS
      httpOnly: true, // Cookie cannot be accessed via client-side scripts
      sameSite: "None",
    });

    res.json(user); // Return the user object in the response
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = createUser;
