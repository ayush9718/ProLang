const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const {dbConnect} = require("./config/dbconnection");
const {cloudinaryConnect} = require("./config/cloudinary");


const user = require("./routes/User");
const profile = require("./routes/Profile");	
const room = require("./routes/Room");
const contact = require("./routes/Contact");

require("dotenv").config();

// port no.
const PORT = process.env.PORT || 4000;

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

// database connection
dbConnect();
cloudinaryConnect();

//routes

app.use("/api/v1/auth", user);
app.use("/api/v1/profile", profile);
app.use("/api/v1/room", room);
app.use("/api/v1/contact", contact);	

app.get("/",()=>{
	return res.status(200).json({
		success:true,
		message:"Server is running"
	})
})
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});