const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createToken = (email,password) =>{
    const token = jwt.sign({email,password},process.env.JWT_SECRET);
    return token
}

const hashPassword = async (password) =>{
    return new Promise((resolve,reject)=>{
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds,function(error,salt){
            if(error){
                reject("Error in the hash process")
            }
            bcrypt.hash(password,salt,function(error,hash){
                if(error){
                    reject("Error in the hash process")
                }
                resolve(hash)
            })
        })
    })
}

module.exports = {createToken,hashPassword};