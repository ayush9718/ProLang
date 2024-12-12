const mongoose= require("mongoose");

const roomSchema= new mongoose.Schema({
    email_creator:{
        type:String,
        trim:true,
    },
    email_receiver:{
        type:String,
        trim:true,
    },
    language:{
        type:String,
        enum:["English","Hindi","Spanish","French","German"],
    },
    status:{
        type:String,
        enum:["Waiting","Learning"],
        required: true,
    },
    createdAt: {
		type: Date,
		default: Date.now,
		expires: 20*60,}
});

module.exports = mongoose.model("Rooms",roomSchema);