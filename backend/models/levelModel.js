import mongoose from 'mongoose'

const levelSchema = mongoose.Schema({
  number: {
    type: Number,
    required: true
  },
  entryPoints: {
    type: Number,
    required: true,
    default: 0
  },
  exitPoints: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
})

const Level = mongoose.model('Level', levelSchema)

export default Level