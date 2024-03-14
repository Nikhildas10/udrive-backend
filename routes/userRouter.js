const express = require("express");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { signup, login } = require("../controllers/userControl");
require("dotenv").config();

router.post("/signup",signup);
router.post("/login",login)

module.exports = router;
