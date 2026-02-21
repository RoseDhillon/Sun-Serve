const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { USER_ROLES } = require("../utils/constants")

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
    maxlength: [100, "Name cannot be more than 100 characters"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false, // Don't return password by default
  },
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.CUSTOMER,
    required: true,
  },
  phone: {
    type: String,
    required: [true, "Please add a phone number"],
    match: [/^\d{10}$/, "Please add a valid 10-digit phone number"],
  },
  address: {
    street: {
      type: String,
      required: [true, "Please add a street address"],
    },
    city: {
      type: String,
      required: [true, "Please add a city"],
    },
    state: {
      type: String,
      required: [true, "Please add a state"],
    },
    zipCode: {
      type: String,
      required: [true, "Please add a zip code"],
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Encrypt password using bcrypt before saving
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model("User", UserSchema)
