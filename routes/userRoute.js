const express = require("express");
const UserModel = require("../models/UserModel");
const router = express.Router();
const { cloudinary } = require("../cloudinary");

router.post("/register", async function (req, res) {
    try {
      const newitem = new UserModel(req.body);
      await newitem.save();
      res.send("User added successfully");
    } catch (error) {
      console.log(error)
      return res.status(400).json(error);
    }
  });

  router.post("/login", async function (req, res) {
    try {
      const result = await UserModel.findOne({email : req.body.email , password : req.body.password});
      delete result.password
      res.send(result);
    } catch (error) {
      res.status(400).send(error);
    }
  });


//@get all users
router.get("/getallusers", async(req, res) => {
  
  try {
      const users = await UserModel.find()
      res.send(users)
  } catch (error) {
      console.log(error)
      return res.status(400).json(error);
  }

});

//@Update profile

//@Follow users
router.post("/followuser", async(req, res) => {
  const {currentuserid , receiveruserid} = req.body
  console.log(req.body);
  try {
    var currentuser = await UserModel.findOne({_id : currentuserid})
    var currentUserFollowing = currentuser.following
    currentUserFollowing.push(receiveruserid);

    currentuser.following = currentUserFollowing

    await UserModel.updateOne({_id : currentuserid} , currentuser)

    var receiveruser = await UserModel.findOne({_id : receiveruserid})
    var receiverUserFollowers   = receiveruser.followers

    receiverUserFollowers.push(currentuserid)

    receiveruser.followers = receiverUserFollowers

    await UserModel.updateOne({_id : receiveruserid} , receiveruser)

    res.send('Followed successfully')
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }

});



  module.exports = router
