import mongoose, { mongo } from 'mongoose'

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
  },
  level: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Level'
  },
  tasks: [
    {
      task: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Task'
      }
    }
  ]
}, {
  timestamps: true
})
const Kid = mongoose.model('Kid', kidSchema)

export default Kid