const express = require('express');
const {
  register,
  login,
  changePassword,
  profile,
  updateProfile,
  getAllUser,
  followData,
  getFriendsList,
  getFollowerList,
  unFollowData,
} = require('../controllers/auth');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/changePassword', changePassword);

/* router.use(protect); */

router.get('/profile/:email', profile); //change to id
router.get('/friends', getAllUser);
router.put('/profile/:id', updateProfile);
router.patch('/friends/unfollow/:id', unFollowData);
router.patch('/friends/:id', followData);

router.get('/friends/list/:id', getFriendsList);
router.get('/friends/follower/:id', getFollowerList);

module.exports = router;
