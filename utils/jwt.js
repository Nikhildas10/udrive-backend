require("dotenv").config();
const jwt = require("jsonwebtoken");

function generateAccessToken(username) {
  const accessToken = jwt.sign({ username }, process.env.ACCESS_KEY, {
    expiresIn: "5m",
  });
  return accessToken;
}

function generateRefreshToken(username) {
  const refreshToken = jwt.sign({ username }, process.env.REFRESH_KEY, {
    expiresIn: "5d",
  });
  return refreshToken;
}

function setCookies(res, accessToken, refreshToken) {
  res.cookie("accessToken", accessToken, { maxAge: 60000 });
  res.cookie("refreshToken", refreshToken, {
    maxAge: 60000,
    httpOnly: true,
    secure: true,
  });
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  setCookies,
};
