import asyncHandler from 'express-async-handler'
import Classroom from '../models/classroomModel.js'

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

export {
  getClassrooms,
  getClassroomById,
  createClassroom,
  deleteClassroom,
  updateClassroom
}