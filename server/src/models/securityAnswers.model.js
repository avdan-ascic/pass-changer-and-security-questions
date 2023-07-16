import mongoose from 'mongoose'

const securityAnswers = mongoose.Schema({
  securityAnswer: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  secQueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SecurityQuestion"
  }
})

export default mongoose.model("SecurityAnswer", securityAnswers)

