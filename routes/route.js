const express = require("express");

const login = require("../controller/login");
const createUser = require("../controller/signup");
const auth = require("../middleware/authTokenVerification");
const userController =require('../controller/user');
const refreshToken = require("../controller/refreshToken");

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", login);
router.get("/refresh-token", refreshToken);


// Routes accessible only to authenticated users (using auth middleware)

router.get("/user/:userId", auth.auth, userController.getUserDetails);
router.put("/user/:userId", auth.auth, userController.updateUserDetails);

// router.get("/getdata",auth.auth,userController.findusers);

// Route accessible only to admin users (additional authorization logic)
router.get("/admin/getusers", auth.auth, auth.isAdmin, userController.findUsers);

router.get("/logout",auth.auth, (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.json({ message: "Logged out" });
});
module.exports = router;