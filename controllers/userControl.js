const express = require("express");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const router = express.Router();

const {
  generateAccessToken,
  generateRefreshToken,
  setCookies,
} = require("../utils/jwt");

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const userExists = await userModel.findOne({ email });
  if (userExists) {
    return res.json({ message: "User already exists" });
  }
  const newUser = new userModel({ email, password, username });
  await newUser.save();
  return res.json({ message: "User registered" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const userExists = await userModel.findOne({ email });
  if (!userExists) {
    return res.json({ message: "User not registered" });
  }
  const validPassword = await bcrypt.compare(password, userExists.password);
  if (!validPassword) {
    return res.json({ message: "Invalid password" });
  }

  const accessToken = generateAccessToken(userExists.username);
  const refreshToken = generateRefreshToken(userExists.username);

  setCookies(res, accessToken, refreshToken);

  return res.json({ status: true, message: "User logged in successfully" });
};

module.exports = {
  signup,
  login,
};
