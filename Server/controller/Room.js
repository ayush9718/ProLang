const Rooms = require("../modules/Rooms");
const Profile = require("../modules/Profile");

exports.getRandRoom = async (req, res) => {
    try{
        const {email}= req.user;
        const userDetail= await Profile.findOne({email:email});
        const randroom= await Rooms.aggregate([
            { $match: { status: "Waiting", language:userDetail.language }},      
            { $sample: { size: 1 } }             
          ]);

          console.log("random room milgya",randroom);
        if (randroom.length == 0) {  
            return res.status(400).json({
                success:false,
                data:{randroom:{}},
                message:"dont have any waiting room right now"
            });
        }
        const rID = randroom[0]._id; 
        const updatedRoom = await Rooms.findByIdAndUpdate(
            rID,
            { status: "Learning",
            email_receiver:email,
            },{new:true});
            console.log("room schema updated and learning started",updatedRoom);
        // num joined increacing
        userDetail.numJoined = userDetail.numJoined + 1;
        await userDetail.save();

        const creatorDetail = await Profile.findOne({email:updatedRoom.email_creator});
        creatorDetail.numJoined = creatorDetail.numJoined + 1;
        await creatorDetail.save(); 
        console.log("num joined updated",userDetail.numJoined,creatorDetail.numJoined);

       return res.status(200).json({
            success:true,
            message:"getting random room successfull",
            data:updatedRoom,
        });
    }
    catch(err){
        console.log("problem in fetching random room:::",err);
        return res.status(400).json({
            success: false,
            message:"problem in fetching random room",
        })
    }

}

exports.createRoom = async (req,res) => {
    try{
        const {_id} = req.user;
        const userDetail = await Profile.findById(_id);
        console.log("user detail retriverd");
        const room = await Rooms.create({
            status:"Waiting",
            email_creator: userDetail.email,
            language:userDetail.language,
        });
        console.log("room created");

        if(!room){
            return res.status(404).json({
                success:false,
                message:"room not created",
            });
        }
        console.log("room done scene::",room);
         return res.status(200).json({
            success:true,
            data:room,
            message:"room is created"
         });
    }

    catch(err){
        console.log("error while creating room");
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"error while creating room",
        });
    }
}