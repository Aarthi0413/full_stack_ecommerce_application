const User = require("../models/userModel");

const allUsers = async (req, res) => {
    try{
        console.log("userId all users", req.userId);

        const allUsers = await User.find();

        res.json({message:"All user", error:false, success:true, data:allUsers});

    }catch(error){
        res.json({message: error.message, error: true, success: false});
    }
}

module.exports = allUsers;