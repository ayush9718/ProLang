const express = require("express");
const router = express.Router();

const {login,SignUp,changePassword,sendOtp}= require("../controller/Auth");

// todo
// reset password ke liye otp send karana hai and verify krna hai usse bhi
const {auth} = require("../middleware/auth");
router.post("/login",login);
router.post("/signup",SignUp);
router.post("/sendotp",sendOtp);
router.post("/changepassword",auth,changePassword);

module.exports = router;