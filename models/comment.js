const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
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
    note: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Note'
    },

    comments: [
      {
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
        ]
      }
    ]
  },
  {
    timestamps: true
  }
)

commentSchema.pre('find', function () {
  this.populate('author')
  this.populate('comments.author')
})

module.exports = mongoose.model('Comment', commentSchema)
