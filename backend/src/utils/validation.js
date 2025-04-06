const validator = require("validator");
const validateSignUpData = (req)=>{
       const {firstName,lastName,emailId,password,role} = req.body; 
         if(!firstName ){
              throw new Error("Enter a valid name");
          }
          else if(!role ){
            throw new Error("Enter a valid role");
        }
         else if(!validator.isEmail(emailId)){
            throw new Error("Enter a valid email")
         }
         else if(!validator.isStrongPassword(password)){
            throw new Error("Enter a strong password")
         }  
} 
module.exports = {validateSignUpData,};
