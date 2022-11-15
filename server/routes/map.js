

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const utils = require('../utils/index');
const verifyTokenMiddleware = require('../middlewares/auth')
const distance= require('../utils/maps')
const ioEmmit= require('../index')

const ParentUser = require('../models/parentUser')








function getDis(location,id,token)
{
    console.log(location)
console.log("latitude : "+location?.coords?.latitude+" longtitude : "+ location?.coords?.longitude+"*******************")
let dis;

// console.log(id+"********************")
 ParentUser.findOne({_id:id})
  .then((data) => 
  {
         dis=distance( data.location[data.location.length-1].latitude,location.coords.latitude,
             data.location[data.location.length-1].longitude,location.coords.longitude
                 );
          console.log(dis+"*********")
  })
  


//   return dis;
}

module.exports = getDis;
