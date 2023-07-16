import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "../models/user.model";
import PasswordHistory from "../models/passwordHistory.model";
import config from "../config";


const create = async (req, res, next) => {
  try {
    const { password } = req.body;

    const user = await User.create(req.body);

    const passwordHistory = {
      password: password,
      userId: user._id,
    };

    await PasswordHistory.create(passwordHistory);
    res.status(200).json({ message: "User created successfully!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res, next) => {

  const user = await User.findOne({ email: req.body.email }, null);

  if (!user)
    return res.status(400).json({ error: "Email and password don't match!" });

  if (user.locked)
    return res
      .status(400)
      .json({ error: "This account is locked!", locked: true });

  const passwordCheck = await bcrypt.compareSync(
    req.body.password,
    user.password
  );
  if (!passwordCheck) {
    user.failedLoginCount += 1;
    await User.updateOne(
      { name: user.name },
      { failedLoginCount: user.failedLoginCount }
    );

    if (user.failedLoginCount === 3) {
      user.locked = true;
      await User.updateOne({ name: user.name }, { locked: true });
      return res
        .status(400)
        .json({ error: "This account is locked!", locked: true });
    }

    return res.status(400).json({ error: "Email and password do not match!" });
  } else {
    user.failedLoginCount = 0;
    await User.updateOne(
      { name: user.name },
      { failedLoginCount: 0, locked: false }
    );
  }

  req.session.user = user;

  const token = jwt.sign({ id: user._id }, config.secret, {
    expiresIn: "20m",
  });

  res.cookie("token", token, {
    expire: new Date() + 999,
    domain: "localhost",
    httpOnly: true,
  });

  return res.status(200).json({ user: { id: user._id, name: user.name } });
};

const updatePassword = async (req, res, next) => {
  try {
 
    let user = await User.findOne({ _id: req.user._id }, null);

    const passwordCheck = await bcrypt.compareSync(
      req.body.oldPassword,
      user.password
    );
    if (!passwordCheck)
      return res.status(400).json({ error: "Incorrect old password!" });

    const previousPasswords = await PasswordHistory.find(
      { userId: user._id },
      null
    )
      .sort({ date: -1 })
      .limit(5);
    if (previousPasswords.length > 0) {
      for (let i = 0; i < previousPasswords.length; i++) {
        const checkPrevPassword = await bcrypt.compareSync(
          req.body.newPassword,
          previousPasswords[i].password
        );
        if (checkPrevPassword)
          return res.status(400).json({
            error:
              "You used that password already. Please insert new password.",
          });
      }
    }

    user.password = req.body.newPassword;
    await User.updateOne({ name: user.name }, { password: user.password });

    await PasswordHistory.create([
      { password: user.password, userId: user._id },
    ]);

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const resetPassword = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email }, null);
    if (!user)
      return res.status(400).json({ error: "Email is not registered!" });

    const previousPasswords = await PasswordHistory.find(
      { userId: user._id },
      null
    )
      .sort({ date: -1 })
      .limit(5);
    if (previousPasswords.length > 0) {
      for (let i = 0; i < previousPasswords.length; i++) {
        const checkPrevPassword = await bcrypt.compareSync(
          req.body.newPassword,
          previousPasswords[i].password
        );
        if (checkPrevPassword)
          return res.status(400).json({
            error:
              "You used that password already. Please insert new password.",
          });
      }
    }

    user.password = req.body.newPassword;
    await User.updateOne(
      { name: user.name },
      { password: user.password, locked: false, failedLoginCount: 0 }
    );

    await PasswordHistory.create([
      { password: user.password, userId: user._id },
    ]);
    res.status(200).json({ message: "Password updated successfully!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const checkEmail = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }, null);

  if (!user) return res.status(400).json({ error: "Email is not registered!" });
  else return res.status(200).json({ message: "Email found." });
};

const logout = (req, res, next) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.clearCookie("token");
  res.status(200).json({ message: "You have been logged out." });
};

const isAuthenticated = (req, res, next) => {
  const user = req.user;
  res.status(200).json({ user: { id: user._id, name: user.name } });
};

export default {
  create,
  login,
  logout,
  isAuthenticated,
  updatePassword,
  resetPassword,
  checkEmail,
};
