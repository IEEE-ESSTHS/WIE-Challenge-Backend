import asyncHandler from 'express-async-handler'
import Tree from '../models/treeModel.js'

const getTrees = asyncHandler(async (req, res) => {
  const count = await Tree.countDocuments({})
  const trees = await Tree.find({})

  res.json({
    count,
    trees
  })
})

const getTreeById = asyncHandler(async (req, res) => {
  const tree = await Tree.findOne({specie: req.params.specie})

  if (tree) {
    res.json(tree)
  } else {
    res.status(404)
    throw new Error('Tree specie was not found')
  }
})

const createTree = asyncHandler(async (req, res) => {
  const {
    minPoints,
    maxPoints,
    specie,
    picture
  } = req.body

  const tree = new Tree({
    minPoints,
    maxPoints,
    specie,
    picture
  })

  const createdTree = await tree.save()
  if (createdTree) {
    res.status(201)
    res.json({
      message: 'A new tree was created'
    })
  } else {
    res.status(400)
    throw new Error('Invalid data')
  }
})

const deleteTree = asyncHandler(async (req, res) => {
  const tree = await Tree.findOne({specie: req.params.specie})
  if (tree) {
    await tree.remove()
    res.json({
      message: 'Tree was deleted'
    })
  } else {
    res.status(404)
    throw new Error('The tree specie was not found')
  }
})

const updateTree = asyncHandler(async (req, res) => {
  const {
    minPoints,
    maxPoints,
    specie,
    picture
  } = req.body

  const tree = await Tree.findOne({specie: req.params.specie})

  if (tree) {
    tree.minPoints = minPoints || tree.minPoints
    tree.maxPoints = maxPoints || tree.maxPoints
    tree.specie = specie || tree.specie
    tree.picture = picture || tree.picture

    const updatedTree = await tree.save()
    res.status(201)
    res.json(updatedTree)
  } else {
    res.status(404)
    throw new Error('Tree was not found')
  }
})

export {
  getTrees,
  getTreeById,
  createTree,
  deleteTree,
  updateTree
}