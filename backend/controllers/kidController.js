import asyncHandler from 'express-async-handler'
import Kid from '../models/kidModel.js'
import Task from '../models/taskModel.js'

const authKid = asyncHandler(async (req, res) => {
  const {
    name
  } = req.body

  const kid = await Kid.findOne({name})
  if (kid) {
    res.json({
      _id: kid._id,
      name: kid.name,
      picture: kid.picture,
      age: kid.age,
      level: kid.level,
      points: kid.points,
      tasks: kid.tasks,
      token: generateToken(kid._id)
    })
  } else {
    res.status(401)
    throw new Error('Wrong username')
  }
})

const registerKid = asyncHandler(async (req, res) => {
  const {
    name,
    picture,
    age
  } = req.body

  const kidExists = await Kid.findOne({name})
  if (kidExists) {
    res.status(400)
    throw new Error('User already exists, user another name')
  }

  const kid = await Kid.create({
    name,
    picture,
    age
  })

  if (kid) {
    res.status(201)
    res.json({
      _id: kid._id,
      name: kid.name,
      picture: kid.picture,
      age: kid.age,
      level: kid.level,
      points: kid.points,
      tasks: kid.tasks,
      token: generateToken(kid._id)
    })
  } else {
    res.status(400)
    throw new Error('Invalid data')
  }
})

const getKidProfile = asyncHandler(async (req, res) => {
  const kid = await Kid.findById(req.user._id).populate('tasks')

  if (kid) {
    res.json({
      _id: kid._id,
      name: kid.name,
      picture: kid.picture,
      age: kid.age,
      level: kid.level,
      points: kid.points,
      tasks: kid.tasks
    })
  } else {
    res.status(404)
    throw new Error('Kid not found')
  }
})

const updateKidProfile = asyncHandler(async (req, res) => {
  const kid = await Kid.findById(req.user._id)

  if (kid) {
    kid.name = req.body.name || kid.name
    kid.picture = req.body.picture || kid.picture
    kid.age = req.body.age || kid.age

    const updatedKid = await Kid.save()
    res.json({
      _id: updatedKid._id,
      name: updatedKid.name,
      picture: updatedKid.picture,
      age: updatedKid.age,
      level: updatedKid.level,
      points: updatedKid.points,
      tasks: updatedKid.tasks,
      token: generateToken(updatedKid._id)
    })
  } else {
    res.status(404)
    throw new Error('Kid not found')
  }
})

const getKids = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword ? {
    name: {
      $regex: req.query.keyword,
      $options: 'i'
    }
  } : {}

  const count = await Kid.countDocuments({...keyword})
  const kids = await Kid.find({...keyword}).populate('tasks').limit(pageSize).skip(pageSize * (page - 1))

  res.json({
    count,
    kids,
    page,
    pages: Math.ceil(count / pageSize)
  })
})

const deleteKid = asyncHandler(async (req, res) => {
  const kid = await Kid.findById(req.params.id)

  if (kid) {
    await kid.remove()
    res.json({
      message: 'Kid removed'
    })
  } else {
    res.status(404)
    throw new Error('Kid not found')
  }
})

const getKidById = asyncHandler(async (req, res) => {
  const kid = await Kid.findById(req.params.id).populate('tasks')
  if (kid) {
    res.json(kid)
  } else {
    res.status(404)
    throw new Error('Kid not found')
  }
})

const changeKidLevel = asyncHandler(async (req, res) => {
  const kid = await Kid.findById(req.params.id)
  if (kid) {
    kid.level = req.body.level || kid.level
    const updatedKid = await Kid.save()
    res.json(updatedKid)
  } else {
    res.status(404)
    throw new Error('Kid not found')
  }
})

const addPoints = asyncHandler(async (req, res) => {
  const kid = await Kid.findById(req.params.id)
  if (kid) {
    kid.points += req.body.points || kid.points
    const updatedKid = await Kid.save()
    res.json(updatedKid)
  } else {
    res.status(404)
    throw new Error('Kid not found')
  }
})

const addTask = asyncHandler(async (req, res) => {
  const kid = await Kid.findById(req.params.id)
  if (kid) {
    kid.tasks.push(req.body.task)
    const updatedKid = await Kid.save()
    res.json(updatedKid)
  } else {
    res.status(404)
    throw new Error('Kid not found')
  }
})

const removeTask = asyncHandler(async (req, res) => {
  const kid = await Kid.findById(req.params.id)
  if (kid) {
    const task = kid.tasks.find(task => task._id === req.body.taskId)

    if (task) {
      kid.tasks.pull({_id: task._id})
      await kid.save()

      res.status(201).json({
        message: 'Task was removed from the list'
      })
    } else {
      res.status(404)
      throw new Error('Task not found')
    }
  } else {
    res.status(404)
    throw new Error('Kid not found')
  }
})

export {
  authKid,
  registerKid,
  getKidProfile,
  updateKidProfile,
  getKids,
  deleteKid,
  getKidById,
  changeKidLevel,
  addPoints,
  addTask,
  removeTask
}