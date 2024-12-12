const Profile = require("../modules/Profile");
const imageUploader = require("../utility/imageUploader");

exports.ProfileUpdater = async (req,res) =>{
    try {
		const {firstName,lastName,language,} = req.body;
        const image = req.files.pfp;
		const id = req.user.id;

		const userDetails = await Profile.findById(id);

        userDetails.firstName = firstName || userDetails.firstName;
		userDetails.lastName = lastName || userDetails.lastName;
		userDetails.language = language || userDetails.language;

        if(image){
            const uploadDetails = await imageUploader(
                image,
                process.env.FOLDER_NAME,
            );
            userDetails.image = await uploadDetails.secure_url;
        }

		 await userDetails.save();

		return res.json({
			success: true,
			data:userDetails,
			message: "Profile updated successfully",
		});
	} 
    catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
            message:"error occur while updating profile",
		});
	}
}

exports.deleteAccount = async (req,res) =>{
    try {
		const id = req.user._id;
		const user = await Profile.findById({ _id: id });
		if (!user) {	
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}        
		const deleted =await Profile.findByIdAndDelete({ _id: id });
		return res.status(200).json({
			success: true,
            data:deleted,
			message: "User deleted successfully",
		});
	} catch (err) {
		console.log("error while deleting the user",err);
		return res.status(500).json({
                success: false, 
                message: "User Cannot be deleted successfully",
              });
	}
}

exports.getAllDetails = async (req, res) =>{
    try {
		const id = req.user._id;
		const userDetails = await Profile.findById(id);
        userDetails.password=undefined;
		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data:userDetails,
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
            message: "error while fetching user data",
			error: err.message,
		});
	}
}

exports.getDetailByEmail = async (req,res) => {
	try{
		const {email} = req.body;
		const userDetails = await Profile.findOne({email: email});
        const details = {
			userId:userDetails._id,
			firstName:userDetails.firstName,
			lastName:userDetails.lastName,	
			image:userDetails.image,
			countrycode:userDetails.countrycode,
		}
		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data:details,
		});
	}
	catch(err){
		return res.status(500).json({
			success: false,
            message: "error while fetching user data",
			error: err.message,
		});		
	}
}