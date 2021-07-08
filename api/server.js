const express = require('express');
const userRouter = require('./users/users-router');
const { logger } = require('./middleware/middleware');
const cors = require('cors');
const path = require('path');

const server = express();

// remember express by default cannot parse JSON in request bodies
server.use(express.json());
server.use(cors());
server.use(express.static(path.join(__dirname, 'client/build')))
// global middlewares and the user's router need to be connected here
server.use(logger)
server.use('/api/users', userRouter);

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
})

server.use((req, res) => {
    res.status(404).json({message: "not found, sorry"})
})


module.exports = server;