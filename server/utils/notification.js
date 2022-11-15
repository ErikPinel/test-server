const { Expo } = require("expo-server-sdk");
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const utils = require('./index');
const verifyTokenMiddleware = require('../middlewares/auth')
const distance= require('./maps')
const ioEmmit= require('../index')

const ParentUser = require('../models/parentUser')












const sendPushNotification = async (targetExpoPushToken, message) => {
  console.log()
    const expo = new Expo();
    const chunks = expo.sendPushNotificationsAsync([
      { to: targetExpoPushToken, sound: "default", body: "kid is  in radius" }
    ])
  }
  
  
 function activatePushNotification(expoPushToken,message)
{
  console.log("expoPushToken")
  if (Expo.isExpoPushToken(expoPushToken)) {
    sendPushNotification(expoPushToken, "message");
      console.log("true")
  }
  else console.log("false")
    }




  module.exports = activatePushNotification;