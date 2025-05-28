const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
               if(!validator.isEmail(value)){
                throw new Error("invalid email address " + value);
               }
        },
    },
    role:{ 
        type: String,
        enum: ['employee', 'admin', 'manager','superadmin'] ,
        required:true,
        },
        department: {
            type: String,
            enum: ['HR', 'IT', 'Finance', 'Facilities'],
            required: function () {
              return ['admin', 'manager', 'superadmin', 'employee'].includes(this.role);
            },
            validate: {
              validator: function (value) {
                if (this.role === "employee") {
                  return ['HR', 'IT', 'Finance'].includes(value); // employee-allowed departments
                }
                return ['HR', 'IT', 'Finance', 'Facilities'].includes(value); // broader access for others
              },
              message: "Invalid department for this role",
            }
          },
          status: {
            type: String,
            enum: ['pending', 'active', 'inactive', 'suspended', 'terminated'],
            default: function () {
              return this.role === 'superadmin' ? 'active' : 'pending';
            }
          },
    photoUrl:{
       type:String,
       default:"https://as1.ftcdn.net/v2/jpg/00/64/67/52/1000_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg",
       validate(value){
        if(!validator.isURL(value)){
            throw new Error("Invalid URL")
        }
       }
    },
    gender:{
        type:String,
        lowercase:true,
        validate(value){
            if(!["male","female","others"].includes(value)){
                 throw new Error("Gender is not valid");
            }
        }
    },
    password:{
    type:String,
    required:true,
    validate(value){
        if(!validator.isStrongPassword(value)){
            throw new Error("Please enter a strong password");
        }
    }
    },
    signUpOtp:{
        type:Number,
    },
    signUpOtpExpires:{
          type:Date,
    }
},{timestamps:true});
userSchema.methods.getJWT = async function(){
    const user  = this;
     const token =  await jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
     return token;
    }
userSchema.methods.validatePassword = async function(password){
    const user = this;
   return isPasswordValid = await bcrypt.compare(password,user.password);
}
module.exports = mongoose.model("User",userSchema);