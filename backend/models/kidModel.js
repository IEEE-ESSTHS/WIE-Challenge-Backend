import mongoose from 'mongoose'

const kidSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minLength: [4, 'Minimum name length must be 4 characters']
  },
  picture: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
    default: 6
  }
}, {
  timestamps: true
})
const Kid = mongoose.model('Kid', kidSchema)

export default Kid