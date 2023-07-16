import mongoose from "mongoose"
import bcrypt from "bcrypt"

const passwordHistory = mongoose.Schema({
  password: String,
  date: {
    type: Date,
    default: () => Date.now(),
    immutable: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
})

passwordHistory.pre("save", async function(next) {
  try {
    this.password = await bcrypt.hash(this.password, 10)
    next()
  } catch (err) {
    console.log(err)
  }
})

export default mongoose.model("PasswordHistory", passwordHistory)