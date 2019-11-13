const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

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
      // minlength: 7,
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
    ]
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

const User = mongoose.model('User', userSchema)

module.exports = User
