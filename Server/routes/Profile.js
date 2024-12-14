const express = require("express");
const router = express.Router();

const {ProfileUpdater,imageUpdater,getDetailByEmail,getAllDetails,deleteAccount} = require("../controller/Profile");
const {auth}= require("../middleware/auth");

router.put("/profileupdate",auth,ProfileUpdater);
router.put("/imageupdate",auth,imageUpdater);
router.get("/getdetails",auth,getAllDetails);
router.get("/getdetailsbyemail",auth,getDetailByEmail);
router.delete("/delete",auth,deleteAccount);

module.exports = router;