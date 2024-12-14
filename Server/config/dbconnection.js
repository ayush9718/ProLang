const mongoose = require("mongoose");

require("dotenv").config();

exports.dbConnect = () => {
    mongoose.connect(process.env.MONGO_URL).then(
        () => {
            console.log("db connection successfull");
        }
    ).catch((err)=> {
        console.log("db connection failed");
        console.error(err);
    })
}