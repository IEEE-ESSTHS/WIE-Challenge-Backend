import mongoose from 'mongoose'

const treeSchema = mongoose.Schema({
  minPoints: {
    type: Number,
    required: true,
    default: 0
  },
  maxPoints: {
    type: Number,
    required: true,
    default: 100
  },
  species: {
    type: String,
    required: true,
    enum: ['Normal', 'Grenadier', 'Olivier']
  },
  picture: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const Tree = mongoose.model('Tree', treeSchema)

export default Tree