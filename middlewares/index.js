const jwt = require('jsonwebtoken')

const checkToken = (req,res,next) =>{
    const check = jwt.verify(req.body.token,process.env.JWT_SECRET);
    if(!check) return 'Invalid token'

    next();
}

module.exports = {checkToken}