import asyncHandler from 'express-async-handler'
import Admin from '../models/adminModel.js'
import generateToken from '../utils/generateToken.js'

const authAdmin = asyncHandler(async (req, res) => {
  const {
    email,
    password
  } = req.body

  const admin = await Admin.findOne({email})
  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      picture: admin.picture,
      token: generateToken(admin._id)
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

const registerAdmin = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    picture
  } = req.body

  const adminExist = await Admin.findOne({email})
  if (adminExist) {
    res.status(400)
    throw new Error('User already exists')
  }

  const admin = await Admin.create({
    name,
    email,
    password,
    picture
  })

  if (admin) {
    res.status(201)
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      picture: admin.picture,
      token: generateToken(admin._id)
    })
  } else {
    res.status(400)
    throw new Error('Invalid data')
  }
})

const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await admin.findById(req.user._id)

  if (admin) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      picture: admin.picture
    })
  } else {
    res.status(404)
    throw new Error('Admin not found')
  }
})

const updateAdminProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.user._id)

  if (admin) {
    admin.name = req.body.name || admin.name
    admin.email = req.body.email || admin.email
    admin.picture = req.body.picture || admin.picture

    if (req.body.password) {
      admin.password = req.body.password
    }

    const updatedAdmin = await admin.save()
    res.json({
      _id: updatedAdmin._id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      picture: updatedAdmin.picture,
      token: generateToken(updatedAdmin._id)
    })
  } else {
    res.status(404)
    throw new Error('Admin not found')
  }
})

const getAdmins = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword ? {
    name: {
      $regex: req.query.keyword,
      $options: 'i'
    }
  } : {}

  const count = await Admin.countDocuments({...keyword})
  const admins = await Admin.find({...keyword}).limit(pageSize).skip(pageSize * (page - 1))

  res.json({
    count,
    admins,
    page,
    pages: Math.ceil(count / pageSize)
  })
})

const deleteAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.params.id)

  if (admin) {
    await admin.remove()
    res.json({
      message: 'Admin removed'
    })
  } else {
    res.status(404)
    throw new Error('Admin not found')
  }
})

const getAdminById = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.params.id).select('-password')
  if (admin) {
    res.json(admin)
  } else {
    res.status(404)
    throw new Error('Admin not found')
  }
})

export {
  authAdmin,
  registerAdmin,
  getAdminProfile,
  updateAdminProfile,
  getAdmins,
  deleteAdmin,
  getAdminById
}