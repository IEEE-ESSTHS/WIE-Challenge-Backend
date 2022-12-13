import asyncHandler from 'express-async-handler'
import Teacher from '../models/teacherModel.js'
import generateToken from '../utils/generateToken.js'

const authTeacher = asyncHandler(async (req, res) => {
  const {
    email,
    password
  } = req.body

  const teacher = await Teacher.findOne({email})
  if (teacher && (await teacher.matchPassword(password))) {
    res.json({
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      picture: teacher.picture,
      token: generateToken(teacher._id)
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

const registerTeacher = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    picture
  } = req.body

  const teacherExist = await Teacher.findOne({email})
  if (teacherExist) {
    res.status(400)
    throw new Error('User already exists')
  }

  const teacher = await Teacher.create({
    name,
    email,
    password,
    picture
  })

  if (teacher) {
    res.status(201)
    res.json({
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      picture: teacher.picture,
      token: generateToken(teacher._id)
    })
  } else {
    res.status(400)
    throw new Error('Invalid data')
  }
})

const getTeacherProfile = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.user._id)

  if (teacher) {
    res.json({
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      picture: teacher.picture
    })
  } else {
    res.status(404)
    throw new Error('Teacher not found')
  }
})

const updateTeacherProfile = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.user._id)

  if (teacher) {
    teacher.name = req.body.name || teacher.name
    teacher.email = req.body.email || teacher.email
    teacher.picture = req.body.picture || teacher.picture

    if (req.body.password) {
      teacher.password = req.body.password
    }

    const updatedTeacher = await teacher.save()
    res.json({
      _id: updatedTeacher._id,
      name: updatedTeacher.name,
      email: updatedTeacher.email,
      picture: updatedTeacher.picture,
      token: generateToken(updatedTeacher._id)
    })
  } else {
    res.status(404)
    throw new Error('Teacher not found')
  }
})

const getTeachers = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword ? {
    name: {
      $regex: req.query.keyword,
      $options: 'i'
    }
  } : {}

  const count = await Teacher.countDocuments({...keyword})
  const teachers = await Teacher.find({...keyword}).limit(pageSize).skip(pageSize * (page - 1))

  res.json({
    count,
    teachers,
    page,
    pages: Math.ceil(count / pageSize)
  })
})

const deleteTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id)

  if (teacher) {
    await teacher.remove()
    res.json({
      message: 'Teacher removed'
    })
  } else {
    res.status(404)
    throw new Error('Teacher not found')
  }
})

const getTeacherById = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id).select('-password')
  if (teacher) {
    res.json(teacher)
  } else {
    res.status(404)
    throw new Error('Teacher not found')
  }
})

export {
  authTeacher,
  registerTeacher,
  getTeacherProfile,
  updateTeacherProfile,
  getTeachers,
  deleteTeacher,
  getTeacherById
}