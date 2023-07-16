import User from "../models/user.model";
import SecurityAnswer from "../models/securityAnswers.model";

const readAnswer = async (req, res, next) => {
  try {
    const user = req.user;

    const answer = await SecurityAnswer.findOne(
      { userId: user._id, secQueId: req.body.questionId },
      null
    );

    if (!answer) return res.status(200).json({ answer: "" });
    return res.status(200).json({ answer: answer.securityAnswer });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const updateAnswers = async (req, res, next) => {
  try {
    const user = req.user;

    const answers = req.body;
    for (const row of answers) {
      const answer = await SecurityAnswer.findOne(
        { userId: user._id, secQueId: row.questionId },
        null
      );

      if (!answer) {
        await SecurityAnswer.create([
          {
            securityAnswer: row.answer.trim().toLowerCase(),
            userId: user._id,
            secQueId: row.questionId,
          },
        ]);
      } else {
        await SecurityAnswer.updateOne(
          { userId: user._id, secQueId: row.questionId },
          { securityAnswer: row.answer.trim().toLowerCase() }
        );
      }
    }

    return res.status(200).json({ message: "Answers set successfully!" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const compareAnswers = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }, null);

    const answers = req.body.answers;

    let flag = false;

    for (const answer of answers) {
      const savedAnswer = await SecurityAnswer.findOne(
        { userId: user._id, secQueId: answer.questionId },
        "securityAnswer",
        null
      );
      const userAnswer = answer.answer.trim().toLowerCase();
      if (!savedAnswer)
        return res.status(400).json({ error: "You did not answer to these questions" });
      if (savedAnswer.securityAnswer !== userAnswer) flag = true;
    }

    if (flag)
      return res
        .status(400)
        .json({ error: "One or both answers do not match!" });
    else return res.status(200).json({ data: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export default { readAnswer, updateAnswers, compareAnswers };
