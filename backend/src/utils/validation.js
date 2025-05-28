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
const validateEditProfileData = (req) => {
   const allowedEditFields = ["firstName", "lastName", "gender", "photoUrl"];
   const requiredFields = ["firstName"];
 
   const bodyKeys = Object.keys(req.body);
 
   const isEditAllowed = bodyKeys.every(field => allowedEditFields.includes(field));
   const areRequiredFieldsPresent = requiredFields.every(field => bodyKeys.includes(field) && req.body[field]);
 
   return isEditAllowed && areRequiredFieldsPresent;
 };
module.exports = {validateSignUpData,validateEditProfileData};
