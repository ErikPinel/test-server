const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const utils = require('../utils/index');
const verifyTokenMiddleware = require('../middlewares/auth')
const distance= require('../utils/maps')
const ioEmmit= require('../index')
const activatePushNotification= require('../utils/notification')
const ParentUser = require('../models/parentUser')
// const ChildUser = require('../models/childUser')






//  function getDis(location,id)
// {
//     console.log(location)
// console.log("latitude : "+location?.coords?.latitude+" longtitude : "+ location?.coords?.longitude+"*******************")
// let dis;

// // console.log(id+"********************")
//  ParentUser.findOne({_id:id})
//   .then((data) => 
//   {
   
//          dis=distance( data.location[data.location.length-1].latitude,location.coords.latitude,
//              data.location[data.location.length-1].longitude,location.coords.longitude
//                  );
          
//   })
  
//   return dis;
// }


router.post('/users/parent/getUser', function(req, res, next) {
    const {id}=req.body;
    console.log("id")
    ParentUser.find({})
      .then((data) => res.json(data))
      .catch(next)
  });


//lat1, lat2, lon1, lon2
let dis;
  router.patch('/users/parent/pushNotification', function(req, res, next) {
   
   const {id}=req.body;
   const {token}=req.body;
   const {location}=req.body;
   
   console.log(id+"********************")
   activatePushNotification(token,dis)
   ParentUser.findOne({_id:id})
     .then((data) => 
     {
       
    
           dis=distance(data.location[data.location.length-1].latitude,location.coords.latitude,
                data.location[data.location.length-1].longitude,location.coords.longitude
                    );
                    if(dis<75)
                    activatePushNotification(token,dis)
     
     })
     .catch(next)
console.log(dis)
     
  

  });



router.post('/users/parent/getBaseLocations', function(req, res, next) {
    const {id}=req.body;
    console.log("id")
    ParentUser.findOne({_id:id})
      .then((data) =>res.json(data.location))
      .catch(next)
  });

router.patch('/users/parent/addBaseLocations', function(req, res, next) {
   
    const {newLocationsBaseArray,id}=req.body;
   
    
  
    ParentUser.findByIdAndUpdate(id, { $set: { location: newLocationsBaseArray} }, { new: false }).then(() => {
      res.send('User updated by id through PATCH');
    }).catch(err=>res.json(err));
  });







router.post('/users/signup', function(req, res, next) {

    var body = req.body;
    var hash = bcrypt.hashSync((body['password']), 10);

    console.log((body['email'])?.trim())
    console.log((body['phoneNumber'])?.trim())
    console.log((body['firstName'])?.trim())
    console.log((body['lastName'])?.trim())
    console.log((body['password'])?.trim())

    var user = new ParentUser({
        email: (body['email']).trim(),
        phoneNumber: (body['phoneNumber']).trim(),
        firstName: (body['firstName']).trim(),
        lastName: (body['lastName']).trim(),
        password: hash,
    });
    user.save(function(err, user) {
       if (err) throw err;
       var token = utils.generateToken(user); 
       res.json({
          user: user,  
          token: token
       });
    });
});

router.post('/users/signin', function(req, res) {
    const {email, password} = req.body
    console.log('req.body ============>');
    console.log(req.body);
    ParentUser
    .findOne({email: req.body.email})   
    .exec(function(err, user) {
        console.log('req.body.password ============>')
        console.log(req.body.password)
        console.log('user ============>')
        console.log(user)

        bcrypt.compare(req.body.password, user.password,
            function(err, valid) {
                if (!user) {
                    return res.status(404).json({
                        error: true,
                        message: 'Username or Password is Wrong'
                    })
                }
        
                var token = utils.generateToken(user);

                console.log('token ============>')
                console.log(token)

                res.json({
                    user: user,  
                    token: token
                });
            }
        );                
     });
  });
    
module.exports = router;


// router.post('/users/signup', function(req, res, next) {

//     var body = req.body;
//     var hash = bcrypt.hashSync((body['password']).trim(), 10);

//     var user = new User({
//      email: (body['email']).trim(),
//      username: (body['username']).trim(),
//      phoneNumber: (body['phoneNumber']).trim(),
//      fullName: (body['fullName']).trim(),
//      password: hash,
//      dateOfBirth: (body['dateOfBirth']).trim()
//     });
//     user.save(function(err, user) {
//        if (err) throw err;
//        var token = utils.generateToken(user); 
//        res.json({
//           user: user,  
//           token: token
//        });
//     });
// });

// router.post('/users/signin', function(req, res) {
//     const {username, password} = req.body
//     console.log('req.body ============>');
//     console.log(req.body);
//     User
//     .findOne({username: req.body.username})   
//     .exec(function(err, user) {
//         console.log('req.body.password ============>')
//         console.log(req.body.password)
//         console.log('user ============>')
//         console.log(user)

//         bcrypt.compare(req.body.password, user.password,
//             function(err, valid) {
//                 if (!user) {
//                     return res.status(404).json({
//                         error: true,
//                         message: 'Username or Password is Wrong'
//                     })
//                 }
        
//                 var token = utils.generateToken(user);

//                 console.log('token ============>')
//                 console.log(token)

//                 res.json({
//                     user: user,  
//                     token: token
//                 });
//             }
//         );                
//      });
//   });

