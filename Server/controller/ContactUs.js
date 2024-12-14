const { contactUsEmail } = require("../mail/contactFormRes")
const {mailSender} = require("../utility/mailSender")

exports.contactUsController = async (req, res) => {
  const { email, firstName, lastName, message } = req.body

  try {
    const emailRes = await mailSender(
      email,
      "Your Data send successfully",
      contactUsEmail(email, firstName, lastName, message)
    )
    return res.json({
      success: true,
      message: "Email send successfully",
      emailRes,
    })
  } 
  catch (error) {
    console.log("Error message :", error.message);
    return res.json({
      success: false,
      message: "Something went wrong...",
    });
  }
}