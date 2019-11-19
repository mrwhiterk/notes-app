const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const Note = require('./note')
const Comment = require('./comment')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('email is invalid')
        }
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error("password cannot include the string 'password'")
        }
      }
    },
    avatar: {
      type: Buffer
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note'
      }
    ],
    likes: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

userSchema.virtual('notes', {
  ref: 'Note',
  localField: '_id',
  foreignField: 'author'
})

userSchema.methods.getLikes = function() {
  let totalLikes = 0
  this.notes.forEach(note => (totalLikes += note.likes.length))

  return totalLikes
}

userSchema.pre('find', function() {
  this.populate('notes')
})

userSchema.pre('save', async function(next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error('unable to login')
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error('Unable to login')
  }

  return user
}

userSchema.pre('remove', async function(next) {
  const user = this

  await Note.deleteMany({ author: user._id })
  await Comment.deleteMany({ author: user._id })
  await Comment.updateMany(
    {},
    {
      $pull: {
        comments: { author: user._id }
      }
    }
  )

  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
