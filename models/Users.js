const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { model, Schema } = require('mongoose');

const FollowSchema = new mongoose.Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'UserSchema',
    required: [true, 'User id missing'],
  },
});
FollowSchema.set('timestamps', true);

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    trim: true,
    required: [true, 'Enter a first name'],
  },
  dob: {
    type: Date,
    trim: true,
    required: [true, 'Enter your Date of Birth'],
  },
  email: {
    type: String,
    required: [true, 'Enter an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Enter a password'],
    minlength: 6,
    /*  select : false */
  },
  phone: {
    type: String,
    /*   minlength: 10, */
    /*  select : false */
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  hometown: {
    type: String,
  },
  bio: {
    type: String,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
  follower: [FollowSchema],
  following: [FollowSchema],
});
UserSchema.set('timestamps', true);

UserSchema.pre('save', async function (next) {
  try {
    console.log('inc', this);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password.toString(), salt);
    this.password = hashedPassword;
    console.log('after has', hashedPassword);
    next();
  } catch (error) {
    next(error);
  }
});
// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire after 10 minitues
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
