const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const routes = require('./routes/api')
const app = express();
const port = process.env.PORT || 4000;
const morgan = require ("morgan")
const cors = require('cors')
const jwt = require('jsonwebtoken');
const getDis=require('./routes/map')


var socket = require('socket.io')

var server = app.listen(4000, function(){
    console.log('listening for requests on port 4000,');
});


let io = socket(server)
io.on('connection', function(socket){
  console.log(`${socket.id} is connected`)
  
  socket.on('join', () => {
    socket.join(socket.id)
    console.log(`user ${socket.id} joined room ${socket.id}`);
  })


console.log("***")
  socket.on('disOn', (location,id) => {
    console.log("on")
    socket.emit('disTo', getDis(location,String(id)))
    console.log(`user ${socket.id} joined room ${socket.id}`);
  })
 

socket.on('disconnect',()=>{
  console.log("user"+socket.id+" disconnected")
})


});


mongoose
  .connect(process.env.DB, { useNewUrlParser: true })
  .then(() => console.log(`Database connected successfully`))
  .catch((err) => console.log(err));
mongoose.Promise = global.Promise;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(cors())
app.use(bodyParser.json());
app.use((morgan("dev")))
app.use('/', routes);

app.use((err, req, res, next) => {
  console.log(err);
  next();
});





//middleware that checks if JWT token exists and verifies it if it does exist.
//In all the future routes, this helps to know if the request is authenticated or not.
app.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  
  var token = req.headers['Authorization'];

  if (!token) return next();

  token = token.replace('Bearer ', '');

  jwt.verify(token, process.env.JWT_SECRET, function(err, user) {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Please register Log in using a valid email to submit posts'
      });
    } else {
      req.user = user;
      next();
    }
  });
});

















// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });


