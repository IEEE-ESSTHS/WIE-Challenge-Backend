import asyncHandler from 'express-async-handler'
import Classroom from '../models/classroomModel.js'
import Kid from '../models/kidModel.js'

const getClassrooms = asyncHandler(async (req, res) => {
  const count = await Classroom.countDocuments({})
  const classrooms = await Classroom.find({})

  res.json({
    count,
    classrooms
  })
})

const getClassroomById = asyncHandler(async (req, res) => {
  const classroom = await Classroom.findById(req.params.id).populate('teacher').populate('kid')

  if (classroom) {
    res.json(classroom)
  } else {
    res.status(404)
    throw new Error('Classroom was not found')
  }
})

const createClassroom = asyncHandler(async (req, res) => {
  const {
    name,
    teacherId,
    kids
  } = req.body

  const classroom = new Classroom({
    name,
    teacher: teacherId,
    kids
  })

  const createdClassroom = await classroom.save()
  if (createdClassroom) {
    res.status(201)
    res.json(createdClassroom)
  } else {
    res.sendStatus(400)
    throw new Error('Invalid data')
  }
})

const deleteClassroom = asyncHandler(async (req, res) => {
  const classroom = await Classroom.findById(req.params.id)

  if (classroom) {
    await classroom.remove()
    res.json({
      message: 'classroom remmoved'
    })
  } else {
    res.stale(404)
    throw new Error('Classroom was not found')
  }
})

const updateClassroom = asyncHandler(async (req, res) => {
  const {
    name,
    teacherId
  } = req.body

  const classroom = await Classroom.findById(req.params.id)
  if (classroom) {
    classroom.name = name || classroom.name
    classroom.teacher = teacherId || classroom.teacher

    const updatedClassroom = await classroom.save()
    res.json(updatedClassroom)
  } else {
    res.status(400)
    throw new Error('Classroom was found')
  }
})

const getClassroomKids = asyncHandler(async (req, res) => {
  const classroom = await Classroom.findById(req.params.id).populate('kids')
  if (classroom) {
    res.json(classroom.kids)
  } else {
    res.status(404)
    throw new Error('Classroom was not found')
  }
})

const addKidToClassroom = asyncHandler(async (req, res) => {
  const classroom = await Classroom.findById(req.params.id)
  if (classroom) {
    const kid = await Kid.findById(req.body.kidId)

    const alreadyAdded = classroom.kids.find(k => k.kid.toString() === kidId.toString())
    if (alreadyAdded) {
      res.status(400)
      throw new Error('Kid already in classroom')
    }

    if (kid) {
      classroom.kid.push(kid)
      const updatedClassroom = await classroom.save()
      res.json(updatedClassroom)
    } else {
      res.status(401)
      throw new Error('Kid was not found')
    }
  } else {
    res.status(404)
    throw new Error('Classroom was not found')
  }
})

const removeKidFromClassroom = asyncHandler(async (req, res) => {
  const classroom = await Classroom.findById(req.user._id)
  if (classroom) {
    const kid = classroom.kids.find(k => k.kid.toString() === req.query.id.toString())

    if (kid) {
      classroom.kid.pull({_id: kid._id})
      await classroom.save()

      res.status(201).json({
        message: 'Kid removed from classroom!'
      })
    } else {
      res.status(404)
      throw new Error('Kid not found')
    }
  } else {
    res.status(404)
    throw new Error('Classroom not found')
  }
})

const getTeacherClassrooms = asyncHandler(async (req, res) => {
  const count = await Classroom.countDocuments({teacher: req.user._id})
  const classrooms = await Classroom.find({teacher: req.user._id})

  res.json({
    count,
    classrooms
  })
})

const getKidClassrooms = asyncHandler(async (req, res) => {
  const count = await Classroom.countDocuments({kids: {kid: req.user._id}})
  const classrooms = await Classroom.find({kids: {kid: req.user._id}})

  res.json({
    count,
    classrooms
  })
})

export {
  getClassrooms,
  getClassroomById,
  createClassroom,
  deleteClassroom,
  updateClassroom,
  getClassroomKids,
  addKidToClassroom,
  removeKidFromClassroom,
  getTeacherClassrooms,
  getKidClassrooms
}