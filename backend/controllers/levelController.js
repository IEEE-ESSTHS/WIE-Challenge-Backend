import asyncHandler from 'express-async-handler'
import Level from '../models/levelModel.js'

const getLevels = asyncHandler(async (req, res) => {
  const count = await Level.countDocuments({})
  const levels = await Level.find({})

  res.json({
    count,
    levels
  })
})

const getLevelById = asyncHandler(async (req, res) => {
  const level = await Level.findById(req.params.id)

  if (level) {
    res.json(level)
  } else {
    res.status(404)
    throw new Error('Level not found')
  }
})

const createLevel = asyncHandler(async (req, res) => {
  const {
    number,
    entryPoints,
    exitPoints
  } = req.body

  const alreadyExists = await Level.findOne({number: number})
  if (alreadyExists) {
    res.status(403)
    throw new Error('A level with this number is already created, maybe delete it or update it')
  }

  const level = new Level({
    number,
    entryPoints,
    exitPoints
  })

  const createdLevel = await level.save()
  if (createdLevel) {
    res.status(201)
    res.json({
      message: 'A new level was created'
    })
  } else {
    res.status(400)
    throw new Error('Invalid data')
  }
})

const deleteLevel = asyncHandler(async (req, res) => {
  const level = await Level.findById(req.params.id)

  if (level) {
    await level.remove()
    res.json({
      message: 'The level was deleted'
    })
  } else {
    res.status(404)
    throw new Error('The level was not found')
  }
})

const updateLevel = asyncHandler(async (req, res) => {
  const {
    number,
    entryPoints,
    exitPoints
  } = req.body

  const level = await Level.findById(req.params.id)

  if (level) {
    level.number = number || level.number
    level.entryPoints = entryPoints || level.entryPoints
    level.exitPoints = exitPoints || level.exitPoints

    const updatedLevel = await level.save()
    res.json(updatedLevel)
  } else {
    res.status(404)
    throw new Error('Levl was not found')
  }
})

export {
  getLevels,
  getLevelById,
  createLevel,
  deleteLevel,
  updateLevel
}