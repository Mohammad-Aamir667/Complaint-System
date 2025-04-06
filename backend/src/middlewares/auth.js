const User = require("../models/user");
const jwt = require("jsonwebtoken")
const userAuth = async (req,res,next)=>{
       try{ 
        const {token} =  req.cookies;
        if(!token){
          return res.status(401).send("Please Login");
        }
        const decodedMessage = await jwt.verify(token,process.env.JWT_SECRET);
        const {_id} = decodedMessage;
        const user = await User.findById({_id});
        if(!user){
            throw new Error("no user found");
        }
        req.user = user;
        next();
    }
        catch(err){
            res.status(400).send("invalid requests");
        }
}
const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};
const isManager = (req, res, next) => {
    if (req.user.role !== "manager") {
        return res.status(403).json({ message: "Access denied. Manager only." });
    }
    next();
};
module.exports = {
    userAuth,isAdmin,isManager
}