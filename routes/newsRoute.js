const express = require("express");
const NewsItemModel = require("../models/NewsItem");
const { cloudinary } = require("../cloudinary");
const router = express.Router();
const moment = require("moment");

router.post("/addnewsitem", async function (req, res) { //cloudinary.uploader.upload
  try {
    const uploadResponse = await cloudinary.uploader.upload(req.body.image, {
      folder: "news-blog",
      use_filename: true,
    });
    req.body.image = uploadResponse.url;
    const newitem = new NewsItemModel(req.body);
    await newitem.save();
    res.send("News added Successfully");
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

router.get("/getallnewsitems", async function (req, res) {
  try {
    const data = await NewsItemModel.find().populate("user").sort({createdAt : -1}).exec();
    res.send(data);
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.post("/getnewsitemsbyuserid", async function (req, res) {
  try {
    const data = await NewsItemModel.find();
    const userPostedNewsItems = data.filter((obj)=>obj.postedBy.userid === req.body.userid)
    res.send(userPostedNewsItems);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getnewsitembyid", async function (req, res) {
  try {
    const data = await NewsItemModel.findOne({_id : req.body.newsid});
    res.send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});


router.post("/editnewsitem", async function (req, res) {
  try {
  
    await NewsItemModel.findOneAndUpdate({_id : req.body.newsid} , req.body)
    res.send("News edited successfully");
  } catch (error) {
    res.status(400).send(error);
  }
});


router.post("/deletenewsitem", async function (req, res) {
  try {
  
    await NewsItemModel.findOneAndDelete({_id : req.body.newsid})
    res.send("News deleted successfully");
  } catch (error) {
    res.status(400).send(error);
  }
});


//@Like or Unlike Posts
router.post("/likeorunlikepost", async (req, res) => {
  try {
    const newspost = await NewsItemModel.findOne({ _id: req.body.newsid });
    console.log(newspost);

    var likes = newspost.likes;
    console.log(likes);

    if (likes.find((obj) => obj.user == req.body.userid)) {
      const temp = likes.filter(
        (obj) => obj.user.toString() !== req.body.userid
      );

      newspost.likes = temp;
      await NewsItemModel.updateOne({ _id: req.body.newsid }, newspost);
      res.send("Post unliked successfully");
    } else {

      likes.push({
        user: req.body.userid,
        date: moment().format("MMM DD yyyy"),
      });
      newspost.likes = likes;

      await NewsItemModel.updateOne({ _id: req.body.newsid }, newspost);

      res.send("News Post liked successfully");
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

//@Comment Posts
router.post("/addcomment", async (req, res) => {
  try {
    const newspost = await NewsItemModel.findOne({ _id: req.body.newsid });

    var comments = newspost.comments;

    comments.push({
      user: req.body.userid,
      date: moment().format("MMM DD yyyy"),
      comment: req.body.comment,
    });

    newspost.comments = comments;
    await NewsItemModel.updateOne({ _id: req.body.postid }, newspost);
    res.send("Comment added successfully");
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

module.exports = router;
