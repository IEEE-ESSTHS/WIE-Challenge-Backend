import asyncHandler from 'express-async-handler'
import Task from '../models/taskModel.js'

const getTasks = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword ? {
    theme: {
      $regex: req.query.keyword,
      $options: 'i'
    }
  } : {}
  
  const count = await Task.countDocuments({...keyword, ageRange: { from: req.query.from, to: req.query.to }})
  const tasks = await Task.find({...keyword, ageRange: { from: req.query.from, to: req.query.to }})

  res.json({
    count,
    tasks
  })
})

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)

  if (task) {
    res.status(201)
    res.json(task)
  } else {
    res.status(404)
    throw new Error('Task was not found')
  }
})

const createTask = asyncHandler(async (req, res) => {
  const {
    name,
    theme,
    ageRange
  } = req.body

  const task = new Task({
    name,
    theme,
    ageRange
  })

  const createdTask = await task.save()

  if (createdTask) {
    res.status(201)
    res.json({
      message: 'A new task was created'
    })
  } else {
    res.status(400)
    throw new Error('Invalid data')
  }
})

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)

  if (task) {
    await task.remove()
    res.json({
      message: 'Task was removed successfully'
    })
  } else {
    res.status(404)
    throw new Error('Task was not found')
  }
})

const updateTask = asyncHandler(async (req, res) => {
  const {
    name,
    theme,
    ageRange
  } = req.body

  const task = await Task.findById(req.params.id)

  if (task) {
    task.name = name || task.name
    task.theme = theme || task.theme
    task.ageRange = ageRange || task.ageRange

    const updatedTask = await task.save()
    res.status(201)
    res.json(updatedTask)
  } else {
    res.status(404)
    throw new Error('Task was not found')
  }
})

export default {
  getTasks,
  getTaskById,
  createTask,
  deleteTask,
  updateTask
}