const express = require("express");
const router = express.Router();

const {getRandRoom,createRoom} = require("../controller/Room");
const {auth} = require("../middleware/auth");

router.get("/getrandroom",auth,getRandRoom);
router.post("/createroom",auth,createRoom);

module.exports = router;