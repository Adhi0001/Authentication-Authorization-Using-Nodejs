const jwt =require("jsonwebtoken");
require("dotenv").config();

async function auth(request,res,next){
try{
    // console.log(request.headers);
    // const token = request.headers['authorization'].split(" ")[1];
    const token = request.cookies.accessToken;
    if(!token){
        return res.json({message:"Token is required"})
    }

    jwt.verify(token,process.env.TOKEN_KEY,function (error,user){
        if (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Token expired" });
                
            } else if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: "Invalid token" });
            } else {
                return res.status(500).json({ message: "Failed to authenticate token" });
            }
        }
        // request.user=user;
        request.user = {
            userId: user.userId,
            role: user.role // Assuming you have a role field in your JWT payload
          };
        console.log("user",user);
        next();
    })

    
}catch(error){
    console.log(error);
    return res.json({message:error.message})
}

   
}

function isAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized to access this resource" });
    }
    next();
  }
  
  module.exports = {
    auth,
    isAdmin
  };