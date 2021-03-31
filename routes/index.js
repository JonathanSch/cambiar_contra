const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');

const nodemailer = require('nodemailer');

const {nanoid} = require('nanoid');

const User = require('../models/User')

const {hashPassword,createToken} = require('../utils')

const {checkToken} = require('../middlewares');

router.post('/registrar',async (req,res)=>{
    try {
        const newUser = new User({
            email:req.body.email,
            password:req.body.password,
        });

        const userCreated = await newUser.save();

        res.send({message:userCreated}).status(201);

    } catch (error) {
        res.send({error})
    }
    
})

router.post('/login',async (req,res)=>{
    const currentUser = await User.findOne({email:req.body.email});
    if(!currentUser){
        res.send({message:"Usuario no encontrado"});
    }

    const checkPassword = bcrypt.compareSync(req.body.password,currentUser.password);

    if(checkPassword){
        const token = createToken(req.body.email,req.body.password)
        res.send({token});
    }
    else{
        res.send({message:"Contraseña incorrecta"})
    }
})

let transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASS
    }
})

router.post('/sendMail',async (req,res)=>{
    const usuario = await User.findOne({email:req.body.email});
    if(!usuario) res.send({message:"Usuario no registrado"})

    const newCodigo = nanoid(10)

    await User.updateOne({email:req.body.email},{$set:{codigoCambio:newCodigo,procesoCambio:true}});
    
    let mailOptions = {
        from:process.env.EMAIL,
        to:req.body.email,
        subject:"Cambiar contraseña",
        html:`<a href="http://localhost:3000/user/cambio?code=${newCodigo}">Apreta aqui para cambiar la contra</a>`
    }

    transport.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log(error)
        }
        if(info){
            console.log(info)
        }
        res.send({message:'Enviado'})
    })
})

router.get('/cambio',(req,res)=>{
    res.render('./cambiarConta.ejs',{
        code:req.query.code,
    });
})

router.post('/cambiarPass',async (req,res)=>{
    try {
        const user = await User.findOne({codigoCambio:req.body.codigoCambio});

        if(!user.procesoCambio) res.send({message:"Este link ya no es valido"})

        const contraHasheada = await hashPassword(req.body.password);
        
        await User.updateOne({codigoCambio:req.body.codigoCambio},{$set:{password:contraHasheada,procesoCambio:false}});
        res.send({message:'Cambio listo'})
        
    } catch (error) {
        res.send({error})
    }
})

module.exports = router;