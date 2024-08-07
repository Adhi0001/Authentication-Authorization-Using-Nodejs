const User = require("../database/model/user");

async function findUsers(req,res){
    try {
        const users = await User.find({}).lean();
        if(users.length){
            console.log(users);
           return res.status(200).json({data:users});
        }else{
         return res.status(404).json({data:[],message:"data not found"})   
        }
    } catch (error) {
        return res.status(401).json({data:[],message:"data error"})
    }
}



const getUserDetails = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
         // Check if the authenticated user is accessing their own details or an admin is accessing
      if (req.user.role === "admin" || req.user.userId === userId) {
        res.json(user);
      } else {
        return res.status(403).json({ message: "Unauthorized to access user details" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  const updateUserDetails = async (req, res) => {
    try {
      const userId = req.params.userId;
      // Only allow update if the authenticated user is updating their own details
      if (req.user.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized to update user details" });
      }
      // Update user details based on the request body
      const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      // Optionally, you can choose not to return sensitive information like password
      const { password, ...userWithoutPassword } = updatedUser.toObject();
      res.json(userWithoutPassword);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  module.exports = {
    findUsers,
    getUserDetails,
    updateUserDetails
  };
