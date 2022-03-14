const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: "" },
    email: { type: String, required: "" },
    password: { type: String, required: "" },
    privateAccount: { type: Boolean, required: false, default: false },
    followers: [{ type: mongoose.Schema.Types.ObjectId, req: 'users' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, req: 'users' }],
    profilePicUrl: { type: String, required: false, default: '' },
    bio: { type: String, required: false, default: '' },
    savedPosts: [],
    archeivedPosts: [],
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel
