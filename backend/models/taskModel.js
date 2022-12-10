import mongoose from 'mongoose'

const taskSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  theme: {
    type: String,
    required: true,
    enum: ['space', 'environment']
  },
  ageRange: {
    from: {
      type: Number,
      required: true,
      default: 6
    },
    to: {
      type: Number,
      required: true,
      default: 8
    }
  }
}, {
  timestamps: true
})

const Task = mongoose.model('Task', taskSchema)

export default Task