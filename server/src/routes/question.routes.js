import express from 'express'
import passport from 'passport'

import questionCtrl from '../controllers/question.controller'

const router = express.Router()

router.route('/api/questions/readAll')
  .get(passport.authenticate('jwt'), questionCtrl.readAllQuestions)
router.route('/api/questions/readTwo')
  .get(questionCtrl.readTwoQuestions)



export default router