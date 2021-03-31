const mongoose =require('mongoose');

const connect = () =>{
    mongoose.connect(process.env.DB_URI,{ useNewUrlParser: true },{ useUnifiedTopology: true },(err)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log('Database connected')
        }
    })
}

module.exports = {connect};