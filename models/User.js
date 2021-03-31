const mongoose = require('mongoose');

const {hashPassword} = require('../utils')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    codigoCambio:{
        type:String,
        default:null,
    },
    procesoCambio:{
        type:Boolean,
        default:false
    }
})

userSchema.pre('save',async function(next){
    const user = this;
    if(user.isModified('password')){
        try {
            const hashNewPassword = await hashPassword(user.password);
            user.password = hashNewPassword;
            next();
        } catch (error) {
            throw new Error(error);
        }
    }
})

module.exports = mongoose.model('User', userSchema);