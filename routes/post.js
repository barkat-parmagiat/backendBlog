const express = require('express');
const {
  post,
  getPosts,
  postComment,
  deletePost,
  editPost,
  getUserWithFriendsAllPost,
} = require('../controllers/post');

const router = express.Router();
router.post('/timeline', post);
router.post('/timeline/:post_id/comments', postComment);
router.get('/timeline/:id', getPosts);
router.get('/timeline/relatedPost/:id', getUserWithFriendsAllPost);
router.delete('/timeline/:post_id', deletePost);
router.patch('/timeline/:post_id', editPost);

module.exports = router;
