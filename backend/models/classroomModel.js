import mongoose from 'mongoose'

const classroomSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Teacher'
  },
  kids: [
    {
      kid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Kid'
      }
    }
  ]
}, {
  timstamps: true
})

const Classroom = mongoose.model('Classroom', classroomSchema)

export default Classroom