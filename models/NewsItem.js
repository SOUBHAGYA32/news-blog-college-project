const mongoose = require("mongoose");

const newsItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: "" },
    description: { type: String, required: "" },
    content: { type: String, required: "" },
    image: { type: String, required: true},
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        date: { type: String, required: true },
        comment: { type: String, required: true },
      },
    ],
    likes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        date: { type: String, required: true },
      },
    ],
    user: { type: Object, required: ""},
  },
  {
    timestamps: true,
  }
);

const NewsItemModel = mongoose.model('newsitems' , newsItemSchema)

module.exports = NewsItemModel
