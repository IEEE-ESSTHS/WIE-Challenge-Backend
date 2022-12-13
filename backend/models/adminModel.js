import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const adminSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  picture: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

adminSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

adminSchema.pre('save', async function(next) {
  if (!isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(11)
  this.password = await bcrypt.hash(this.password, salt)
})

const Teacher = mongoose.model('Teacher', adminSchema)

export default Teacher