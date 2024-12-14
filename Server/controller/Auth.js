const Profile = require("../modules/Profile");
const bcrypt =require("bcrypt");
const OTP = require("../modules/Otp");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const {mailSender} = require("../utility/mailSender");
const {passwordUpdated}  = require("../mail/PasswordUpdate");

require("dotenv").config();

// sign up controller
exports.SignUp = async (req, res) => {
    try {
        const {firstName, lastName,email, language , password, otp, countrycode} = req.body;

        if(!firstName || !lastName || !email || !language ||!otp || !password || !countrycode){
            return res.status(400).json({
                success:false,
                messsage:"all fileds are required",
            });
        }
        console.log("all fields are present");
        //existing user checking
        const existingUser = await Profile.findOne({email:email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message: "User already exists",
            });
        }
        console.log("existing user checked")
        //otp checking
        const response = await OTP.find({ email }).sort({ createdAt: "desc" }).limit(1);
		if (response.length === 0) {
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		} else if (otp !== response[0].otp) {
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		}
        console.log("otp checked");
        //password hashing
        const hashpass = await bcrypt.hash(password, 10);
        const user = await Profile.create(
            {   firstName:firstName,
                lastName:lastName,
                email:email,
                language:language,
                countrycode:countrycode,
                password:hashpass,
                image:`https://robohash.org/${firstName}${lastName}`,
                numJoined:0,
            }
        )

            console.log("new profile created successfully");
            return res.status(200).json({
                success:true,
                message:"new profile created",
                user,
            })
        

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:`problem while signing up::: ${err}`
        });
    }
}

// login in controller 
exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"all fields are required",
            });  
        }
        console.log("all fields are present");
        const user = await Profile.findOne({email:email});
        if(!user){
            return res.status(400).json({
                success:false,
                message: "user not found"
            });
        }
        console.log("user found");
        // password validation
        if(await bcrypt.compare(password,user.password)){
            console.log("password matched");

            const payload = {
                email:user.email,
                _id:user._id,
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"5d"});
            user.password = undefined;
           console.log("token created")
           return res.cookie("token",token,{
                expires: new Date(Date.now()+ 5*24*60*60*1000),
                httpOnly:true
            }).status(200).json({
                success:true,
                token,
                user,
                message:"user login success",
            });
        }
        console.log("password not matched");
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:`problem while logging in:::: ${err.message}`
        })
    }
}

// send otp conroller

exports.sendOtp = async (req, res) => {
    try {
		const { email } = req.body;
		const checkUserPresent = await Profile.findOne({ email });
		if (checkUserPresent){
			return res.status(401).json({
				success: false,
				message: `User is Already Registered`,
			});
		}
		var otp = otpGenerator.generate(6, {
			lowerCaseAlphabets: false,
			specialChars: false,
		});
		const result = await OTP.findOne({ otp: otp });
		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
			});
		}
		const otpBody = await OTP.create({
            email,
            otp,
        });
		console.log("OTP Body", otpBody);

		res.status(200).json({
			success: true,
			message: `OTP Sent Successfully`,
			otpBody,
		});
	} catch (err) {
		console.log(err.message);
		return res.status(500).json({ 
            success: false, 
            err: err.message 
        });
	}
}

// change password controller 
exports.changePassword = async (req, res) => {
	try {
		const userDetails = await Profile.findById(req.user._id);

		const { oldPassword, newPassword, confirmPassword } = req.body;

		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if(oldPassword === newPassword){
			return res.status(400).json({
				success: false,
				message: "New Password cannot be same as Old Password",
			});
		}
		
		if (!isPasswordMatch) {
            return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}


        if (newPassword !== confirmPassword) {
            return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}

		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await Profile.findByIdAndUpdate(
			req.user._id,
			{ password: encryptedPassword },
			{ new: true }
		);

        return res
			.status(200)
			.json({ 
            success: true,
             message: "Password updated successfully" });
	} catch (error) {

        console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};