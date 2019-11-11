const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      unique: true,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
      }
    ]
  },
  {
    timestamps: true
  }
)

noteSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'note'
})

module.exports = mongoose.model('Note', noteSchema)
