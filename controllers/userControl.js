const express = require("express");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

 const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const userExists = await userModel.findOne({ email });
  if (userExists) {
    return res.json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new userModel({ email, password: hashedPassword, username });
  await newUser.save();
  return res.json({ message: "User registered" });
};

 const login = async (req, res) => {
  const { email, password } = req.body;
  const userExists = await userModel.findOne({ email });
  if (!userExists) {
    return res.json({ message: "user not registered" });
  }
  const validPassword = await bcrypt.compare(password, userExists.password);
  if (!validPassword) {
    return res.json({ message: "invalid password" });
  }
  const accessToken = jwt.sign(
    { username: userModel.username },
    `${process.env.ACCESS_KEY}`,
    { expiresIn: "5m" }
  );
  const refreshToken = jwt.sign(
    { username: userModel.username },
    `${process.env.REFRESH_KEY}`,
    { expiresIn: "5d" }
  );
  res.cookie("accessToken", accessToken, { maxAge: 60000 });
  res.cookie("refreshToken", refreshToken, {
    maxAge: 60000,
    httpOnly: true,
    secure: true,
  });
  return res.json({ status: true, message: "user logged in successfully" });
};

module.exports = {
  signup,
  login,
};