const Post = require('../models/Post');
const User = require('../models/Users');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.post = asyncHandler(async (req, res, next) => {
  const body = req.body;
  // create user
  const post = await Post.create(body);
  res.status(201).json({
    success: true,
    data: post,
  });
});

exports.getPosts = asyncHandler(async (req, res, next) => {
  let email = req.params.id;
  try {
    let posts = await Post.find({ user_id: email, status: 'A' }).sort({
      createdAt: -1,
    });
    console.log(posts);
    res.status(201).json({
      success: true,
      data: posts,
    });
  } catch {}
});

//get User & following/Follower  AllPost
exports.getUserWithFriendsAllPost = asyncHandler(async (req, res, next) => {
  console.log('by hit');
  try {
    let friendsList = [];
    let userInfo = await User.findById(req.params.id).lean();
    friendsList = userInfo.following;
    // console.log('friendList', friendsList);
    var maped_result = friendsList.map((ent) => ent.user_id.toString());
    console.log(maped_result);
    let userRelatedPost = await Post.find({
      user_id: { $in: maped_result },
      status: 'A',
    }); //.sort({ createdAt: -1 });
    console.log('relatedPost', userRelatedPost);
    res.status(200).json({
      success: true,
      data: userRelatedPost,
    });
  } catch (err) {
    console.log(err);
  }
});

exports.postComment = asyncHandler(async (req, res, next) => {
  //post id in params
  // :post_id
  /**
   * payload = {
   * user_id : 54545,
   * comment_body : "some text"
   * }
   */
  let post_id = req.params.post_id;
  let payload = req.body;
  try {
    let comments = await Post.findByIdAndUpdate(
      post_id,
      {
        $push: { comments: payload },
      },
      { new: true }
    );
    res.status(201).json({
      success: true,
      data: comments,
    });
  } catch (err) {}
});

exports.deletePost = asyncHandler(async (req, res, next) => {
  try {
    let post_id = req.params.post_id;
    let delete_res = await Post.findByIdAndUpdate(
      post_id,
      {
        $set: { status: 'D' },
      },
      { new: true }
    );
    res.status(201).json({
      success: true,
      data: delete_res,
    });
  } catch (err) {}
});

exports.editPost = asyncHandler(async (req, res, next) => {
  try {
    let post_id = req.params.post_id;
    let postbody = req.body.body;
    let edit_res = await Post.findByIdAndUpdate(
      post_id,
      {
        $set: { body: postbody },
      },
      { new: true }
    );
    res.status(201).json({
      success: true,
      data: edit_res,
    });
  } catch (err) {}
});
