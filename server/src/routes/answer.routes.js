import express from "express";
import passport from "passport";

import answerCtrl from "../controllers/answer.controller";

const router = express.Router();

router
  .route("/api/answers/read")
  .post(passport.authenticate("jwt"), answerCtrl.readAnswer);
router
  .route("/api/answers/update")
  .post(passport.authenticate("jwt"), answerCtrl.updateAnswers);
router.route("/api/answers/compare").post(answerCtrl.compareAnswers);

export default router;
