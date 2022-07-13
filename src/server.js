const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const usersRouter = require('./routes/users')

const server = express();
const port = 4000;

dotenv.config()

mongoose.connect(process.env.MONGODB_URI).then(() =>{console.log('conectado a la base de datos')}).catch(() => {console.log('error al conectar a la base de datos')});

server.use(express.json());
server.use('/api/v1', usersRouter);

server.get('/', (request, response) => {
    response.send('Hola desde la raiz');
});

server.listen( port, () => {
    console.log('servidor corriendo en el puerto: ' + port);

});

