import mongoose from "mongoose"
import bcrypt from "bcrypt"


const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Name is required!",
    unique: "Name is already in use!"
  },
  email: {
    type: String,
    trim: true,
    unique: "Email is already registered!",
    required: "Email is required!",
    match: [/.+\@.+\../, "Please enter a valid email address!"]
  },
  password: {
    type: String,
    required: "Password is required!"
  },
  failedLoginCount: {
    type: Number,
    default: 0
  },
  locked: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: () => Date.now(),
    immutable: true
  }
})

userSchema.pre("save", async function (next) {

  try {
    this.password = await bcrypt.hash(this.password, 10)
    next()
  } catch (err) {
    next(new Error(err))
  }
})

userSchema.pre("updateOne", async function (next) {

  if (this._update.password === undefined) next()

  const pwRegex = /^(?=.*[A-Z])(?=.*[\W_])(?=.{8,}).*$/
  if (!pwRegex.test(this._update.password)) next(new Error("Password should contain at least 8 characters, one capital letter and one special character"))

  try {
    this._update.password = await bcrypt.hash(this._update.password, 10)
    next()
  } catch (err) {
    next(new Error(err))
  }
})

export default mongoose.model("User", userSchema)