import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const teacherSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [4, 'Minimum name length must be 4 characters']
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

teacherSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

teacherSchema.pre('save', async function(next) {
  if (!isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(11)
  this.password = await bcrypt.hash(this.password, salt)
})

const Teacher = mongoose.model('Teacher', teacherSchema)

export default Teacher