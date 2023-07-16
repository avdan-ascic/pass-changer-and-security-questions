import User from "../models/user.model";
import SecurityQuestion from "../models/securityQuestions.model";

const readAllQuestions = async (req, res, next) => {
  try {
    const questions = await SecurityQuestion.find({});
    return res.status(200).json(questions);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const readTwoQuestions = async (req, res, next) => {
  try {
    const questions = await SecurityQuestion.aggregate().sample(2);
    res.status(200).json(questions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export default {
  readAllQuestions,
  readTwoQuestions,
};
