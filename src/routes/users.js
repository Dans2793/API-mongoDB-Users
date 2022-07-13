const express = require('express');
const bcryptjs = require('bcryptjs');
const router = express.Router();
const userSchema = require('../models/Users')
const jwt = require('jsonwebtoken')

/* CRUD (create, read, update, delete) */

/* Create con metodo post */
router.post('/users', async (request, response) => {
    try {
        const hash = await bcryptjs.hash(request.body.password, 8)
        /* response.send('crear usuario...');
    console.log(request.body); */
    const newUser = userSchema({...request.body, password: hash});
    /* promesa: 
    1. pendiente
    2. si cdumplio -> then
    3. no cumplio -> catch */
    newUser.save().then((data)=>{
        response.json({success: data})
    }).catch((error)=>{response.json({failure: error})})
    } catch (error) {
        response.json({failure: error});
    }
    
}); 

/* Read con el metodo get */
router.get('/users', (request, response) => {
    /* response.send('leer todos los usuarios...'); */
    userSchema.find().then((data)=>{
        response.json({success: data})
    }).catch((error)=>{response.json({failure: error})})
});  /* todos los registros */

router.get('/users/:id', (request, response) => {
    /* response.send('leer un usuario especifico...'); */
    const {id} = request.params
    userSchema.findById(id).then((data)=>{
        response.json({success: data})
    }).catch((error)=>{response.json({failure: error})})
});  /* un registro */

/* Update con el metodo get */
router.put('/users/:id', async (request, response) => {
    /* response.send('actualizar un usuario especifico'); */
    const {id} = request.params
    const hash = await bcryptjs.hash(request.body.password, 8)
    const user = {...request.body, password: hash}

    userSchema.updateOne({_id: id}, {$set: user}).then((data)=>{
        response.json({success: data})
    }).catch((error)=>{response.json({failure: error})})
}); 

/* Delete con el metodo get */
router.delete('/users/:id', (request, response) => {
    /* response.send('eliminar un usuario'); */
    const {id} = request.params
    userSchema.deleteOne({_id: id}).then((data)=>{
        response.json({success: data})
    }).catch((error)=>{response.json({failure: error})})
}); 

/* FUNCION PARA LOGIN */

router.post('/login', async (request, response)=>{
    try {
        /* console.log(request.body); */
        const user = await userSchema.findOne({email: request.body.email,});
        
        /* console.log(user); */

        if (user) {
            /* response.json({succes: user}); */

            const isEqual = await bcryptjs.compare(request.body.password, user.password);
            /* console.log(isEqual); */
            if (isEqual) {
                /* response.json({ success: user._id }); */
                const token = jwt.sign({
                    name: user.firstName
                },
                'llaveSecreta');
                response.json({ token });
            } else {
                response.json({message: 'contrasena incorrecta'});
            }
            
        } else {
            response.json({message: 'El usuario no existe'});
        }
        return;
    } catch (error) {
        response.json({failure: error, description: 'Fallo el try'});
    }
})

module.exports = router;