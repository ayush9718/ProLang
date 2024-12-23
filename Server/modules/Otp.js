const mongoose = require("mongoose");
const {mailSender} = require("../utility/mailSender");
const {otpTemplate} = require("../mail/emailVerification");

const OTPSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 5,}
});

async function sendVerificationEmail(email, otp) {
	try {
		const mailResponse = await mailSender(
			email,
			"Verification Email",
			otpTemplate(otp)
		);
		console.log("Email sent successfully: ", mailResponse);
	} 
	catch (error) {
		console.log("Error occurred while sending email: ", error);
		throw error;
	}
}

OTPSchema.pre("save", async function (next) {

	console.log("New OTP document saved to database");
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	next();
});
module.exports = mongoose.model("OTP", OTPSchema);