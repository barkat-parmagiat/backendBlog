const { model, Schema } = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const CommentSchema = new Schema({
  comment_body: {
    type: String,
    index: true,
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});
CommentSchema.set('timestamps', true);

const PostSchema = new Schema({
  user_id: {
    type: String,
    index: true,
    required: true,
  },
  body: {
    type: String,
    trim: true,
    required: [true, 'Write your Post'],
  },
  comments: [CommentSchema],
  status: {
    type: String,
    enum: ['A', 'D'],
    default: 'A',
  },
});
PostSchema.set('timestamps', true);

module.exports = model('Post', PostSchema);
