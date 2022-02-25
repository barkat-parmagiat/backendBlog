const User = require('../models/Users');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { findOne } = require('../models/Users');

// @desc        Register user
// @route       POST
// @access      Public
exports.register = asyncHandler(async (req, res, next) => {
  const { fullname, email, password, dob } = req.body;
  // create user
  const user = await User.create({
    fullname,
    email,
    password,
    dob,
  });
  res.status(201).json({
    success: true,
    data: user,
  });
});

// @desc        login user
// @route       POST
// @access      Public

const hashedPassword = async (passwordByDb, passwordByUser) => {
  const hashedPassword = await bcrypt.compare(passwordByUser, passwordByDb);
  return hashedPassword;
};

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password, fullname } = req.body;
  const user = await User.find({
    email: email,
  }).lean();
  let objtok, success, statusCode;
  if (user.length >= 1) {
    let passDb = user[0]?.password;
    let hashedPass = await hashedPassword(passDb, password);
    if (hashedPass) {
      let token = await createToken(email, password, fullname);
      objtok = {
        token: token,
        email: user[0].email,
        fullname: user[0].fullname,
        _id: user[0]._id,
      };
      console.log(objtok);
      success = true;
      statusCode = 200;
    } else {
      success = false;
      statusCode = 400;
      objtok = { msg: 'Invalid credential' };
      //return next(new ErrorResponse('Invalid credential', 400));
    }
  } else {
    success = false;
    statusCode = 400;
    // objtok;
    // return next(new ErrorResponse('Invalid credential aa', 1));
    objtok = { msg: 'Invalid credentialaaa' };
  }
  res.status(statusCode).json({
    success: success,
    data: objtok,
  });
});

const createToken = (email, password) => {
  const token = jwt.sign(
    {
      email: email,
      password: password,
    },
    'asdfafasdf123456asdfasdfasdfsadf132sad4f56sadfsadf',
    {
      expiresIn: '2h',
    }
  );
  // console.log('Token', token);
  return token;
};

exports.changePassword = asyncHandler(async (req, res, next) => {
  // console.log('change password req', req.body);
  const userId = '618e7d5b9598ddd1390b6b74'; // need to get from token
  const user = await User.findById(userId, 'email password');
  console.log('user before', user);
  // check passwrod and confirm password
  if (req.body.password !== req.body.confirmPassword) {
    // CHeck current password
    // console.log('given passwords are not matched');
    return next(new ErrorResponse('Both password does not match.', 401));
  }
  if (!(await user.matchPassword(req.body.current_password))) {
    // CHeck current password
    return next(new ErrorResponse('Current password is incorrect', 401));
  }

  user.password = req.body.password;
  await user.save();
  console.log('user after', user);
  const token = createToken(user.email, user.password);
  console.log('Token', token);

  res.status(200).json({
    success: true,
    data: { token },
  });

  next();
});

//show profile details
exports.profile = asyncHandler(async (req, res, next) => {
  try {
    const profile_res = await User.findOne({
      email: req.params.email,
    });
    res.status(200).json({
      success: true,
      data: profile_res,
    });
  } catch (err) {}
});

//Show All User
exports.getAllUser = asyncHandler(async (req, res, next) => {
  try {
    console.log('req.user', req.user);
    const user_id = '619b666c6b680020d318c76b'; //req.body;
    const friends_res = await User.find({
      /*   _id: {
        $ne: mongoose.Types.ObjectId(user_id),
      }, */
    });
    res.status(200).json({
      success: true,
      data: friends_res,
    });
  } catch (err) {}
});

///follow
exports.followData = asyncHandler(async (req, res, next) => {
  let userid = req.params.id;
  console.log('follower', userid);
  let { followerId } = req.body;
  console.log('following id', followerId);
  try {
    // const follow_res = await User.findByIdAndUpdate(
    //   userid,
    //   { $push: { following: { user_id: followerId } } },
    //   { new: true }
    //   //  followerId,
    //   // { $push: { follower: { user_id: userid } } },
    //   // { new: true }
    // );

    // await User.findByIdAndUpdate(followerId, {
    //   $push: { follower: { user_id: userid } },
    // });

    // bulk write
    const follow_res = await User.bulkWrite([
      {
        updateOne: {
          filter: { _id: mongoose.Types.ObjectId(userid) },
          update: {
            $push: { following: { user_id: followerId } },
          },
        },
      },
      {
        updateOne: {
          filter: { _id: mongoose.Types.ObjectId(followerId) },
          update: {
            $push: { follower: { user_id: userid } },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: follow_res,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      data: { msg: 'Something went wrong!' + err },
    });
  }
});

//Unfollow
exports.unFollowData = asyncHandler(async (req, res, next) => {
  let userid = req.params.id;
  console.log('follower', userid);
  let { followerId } = req.body;
  console.log('following id', followerId);
  try {
    console.log('params hit', req.body);
    const follow_res = await User.bulkWrite([
      {
        updateOne: {
          filter: { _id: mongoose.Types.ObjectId(userid) },
          update: {
            $pull: { following: { user_id: followerId } },
          },
        },
      },
      {
        updateOne: {
          filter: { _id: mongoose.Types.ObjectId(followerId) },
          update: {
            $pull: { follower: { user_id: userid } },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: follow_res,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      data: { msg: 'Something went wrong!' + err },
    });
  }
});

//Add / edit Profile
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const profileDetails = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: profileDetails,
  });
});

//retrieve friend list (response from following)
exports.getFriendsList = asyncHandler(async (req, res, next) => {
  const usersFriends = await User.findById(req.params.id).select(
    'following.user_id'
  );
  res.status(200).json({
    success: true,
    data: usersFriends,
  });
});

//retrieve followers
exports.getFollowerList = asyncHandler(async (req, res, next) => {
  const usersFollower = await User.findById(req.params.id).select(
    'follower.user_id'
  );
  res.status(200).json({
    success: true,
    data: usersFollower,
  });
});
