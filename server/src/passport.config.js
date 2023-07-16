import passport from "passport"
import { Strategy as JwtStrategy } from "passport-jwt"

import User from "./models/user.model"
import config from "./config"

var opts = {}
opts.jwtFromRequest = function (req) {
  var token = null
  if (req && req.cookies) {
    token = req.cookies.token;
  }
  return token;
}
opts.secretOrKey = config.secret


passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
  User.findById(jwt_payload.id)
    .then(user => {
      if (!user) return done(null, false)
      return done(null, user)
    })
    .catch(err => done(err, false))
}))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
})