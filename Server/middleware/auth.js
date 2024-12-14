const jwt = require("jsonwebtoken");
const Profile = require("../modules/Profile");

exports.auth = async (req,res,next) =>{
    try{
        const token =  req.cookies.token 
                        || req.body.token 
                        || req.header("Authorisation").replace("Bearer ", "");
        if(!token){
            return res.status(401).json({
                    success:false,
                    message:`Token required`
            });
        }
        console.log("token is present in auth")
        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            req.user = decode;
            console.log("decode values :::",decode);
        }
        catch(err){
            return res.status(401).json({
                success:false,
                message: "invalid token entry",
            });
        }
        next();
    }
    catch(err){
        console.log("not a verified User",error);
        return res.status(401).json({
            success:false,
            message:`not a verified user :::: ${err}`
        });
    }   
}