 import mongoose from "mongoose";
 
 const securitySchema = new mongoose.Schema({
     name: {
         type: String,
         required: true
     },
     email: {
         type: String,
         required: true,
         unique: true
     },
     password: {
         type: String,
         required: true,
         minlength: 6
     },
     role: {
         type: String,
         enum: ['warden', 'admin', 'security'],
         default: 'security'
     }
     
 }, {timestamps: true});
 
 const Security = mongoose.model("Security", securitySchema);
 
 export default Security;