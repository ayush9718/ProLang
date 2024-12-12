const Profile = require("../modules/Profile");
const bcrypt =require("bcrypt");
const OTP = require("../modules/OTP");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const mailSender = require("../utility/mailSender");
const passwordUpdated  = require("../mail/passwordUpdate");

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

        //existing user checking
        const existingUser = await Profile.findOne({email:email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message: "User already exists",
            });
        }

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

        //password hashing
        const hashpass = await bcrypt.hash(password, 10);
        const user = await Profile.create(
            {email:email},
            {
                firstName,
                lastName,
                email,
                language,
                countrycode,
                password:hashpass,
                image:`https://robohash.org/${firstName} ${lastName}`,
            }
        ).then(()=>{
            console.log("new profile created successfully");
            user.password = undefined;
            return res.status(200).json({
                success:true,
                message:"new profile created",
                user,
            })
        }).
        catch((err)=>{
            console.log("error in creating new profile :::",err);
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
        const user = await Profile.findOne({email:email});
        if(!user){
            return res.status(400).json({
                success:false,
                message: "user not found"
            });
        }
        // password validation
        if(await bcrypt.compare(password,user.password)){
            const payload = {
                email:user.email,
                _id:user._id,
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"5d"});
            user.password = undefined;
           
            res.cookie("token",token,{
                expires: new Date(Date.now()+ 5*24*60*60*1000),
                httpOnly:true
            }).status(200).json({
                success:true,
                token,
                entry,
                message:"user login success",
            })
        }
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:`problem while logging in:::: ${err}`
        });
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
			result = await OTP.findOne({ otp: otp });
		}
		const otpBody = await OTP.create({
            email,
            otp,
        });
		console.log("OTP Body", otpBody);

		res.status(200).json({
			success: true,
			message: `OTP Sent Successfully`,
			otp,
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

exports.changePassword = async (req,res) =>{
    try{   
        const{oldPassword, newPassword, confirmPassword} = req.body;
        const userid = req.user._id;
        const user = await Profile.findById(userid);
        
        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(401).json({
                success: false,
                message:" all fields are required",
            });
        }
        if(oldPassword === newPassword){
            return res.status(401).json({
                success:false,
                message:" new password and old password are same",  
            })
        }
        if(newPassword !== confirmPassword){
            return res.status(401).json({
                success: false,
                message:"new password and confirm password are not same",
            });
        }
        if(await bcrypt.compare(oldPassword, user.password)){
            const hashpass = await bcrypt.hash(newPassword, 10);
            user.password = hashpass;
            await user.save();  

            try {
                const emailResponse = await mailSender(
                    user.email,
                    "Study Notion - Password Updated",
                    passwordUpdated(
                        user.email,
                        `${user.firstName} ${user.lastName}`
                    )
                );
                console.log("Email sent successfully:", emailResponse.response);
                return res.status(200).json({
                    success:true,
                    messgae:"password updated successfully",
                    user,
                })
            } 
            
            catch (error) {
                console.error("Error occurred while sending email:", error);
                return res.status(500).json({
                    success: false,
                    message: "Error occurred while sending email",
                    error: error.message,
                });
            }
        }
    }
    catch(err){
        console.log("error occuring while changing password");
		console.error(err);
		return res.status(500).json({ success: false, err: err.message });
    }
}