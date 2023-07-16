import mongoose from "mongoose"

const securityQuestions = mongoose.Schema({
  question: {
    type: String
  }
})

const securityQuestionsModel = mongoose.model("SecurityQuestion", securityQuestions)

const initialDocuments = [
  { question: "What is the name of your favorite childhood friend?" },
  { question: "What time of the day were you born?" },
  { question: "What was your dream job as a child?" },
  { question: "What is the street number of the house you grew up in?" },
  { question: "Who was your childhood hero?" }
]

securityQuestionsModel.countDocuments({})
  .then(async (count) => {
    if (count === 0) await securityQuestionsModel.insertMany(initialDocuments)
  })
  .catch(err => console.log(err))

export default securityQuestionsModel