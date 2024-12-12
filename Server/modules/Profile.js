const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    firstName:{
    type:String,
    required:true,
    trim:true,
   },
   lastName:{
    type:String,
    required:true,
    trim:true,
   },
    email:{
    type:String,
    required:true,
    trim:true,
   },
   password:{
    type:String,
    required:true,
   },
   language:{
    type:String,
    required:true,
    enum:["English","Hindi","Spanish","French","German"],
   },
   image:{
    type:String,
    trim:true,
   },
   countrycode:{
       type:Number,
       required: true
   },
   numJoined:{
    type:Number,
   },
   token:{
    type:String,
    trim:true,
   },
   resetPassExprire:{
    type:Date,
   }
});

module.exports=mongoose.model("Profile",profileSchema);