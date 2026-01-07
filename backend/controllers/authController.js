import User from "../models/User.js";
import {
  deleteRefreshTokenFromRedis,
  getRefreshTokenFromRedis,
  storeRefreshTokenToRedis,
} from "../services/redisService.js";
import { setCookie } from "../utils/cookie.js";
import { generateToken, verifyToken } from "../utils/token.js";
import asyncHandler from "../utils/asyncHandler.js";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    const error = new Error("User already exists");
    error.status = 400;
    throw error;
  }

  const newUser = await User.create({ name, email, password });

  // authenticate
  const accessToken = generateToken("access", newUser._id);
  const refreshToken = generateToken("refresh", newUser._id);
  await storeRefreshTokenToRedis(newUser._id, refreshToken);

  setCookie(res, "accessToken", accessToken, 15 * 60);
  setCookie(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60);

  res.status(201).json({
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  });
};
export const signout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    const { userId } = verifyToken("refresh", refreshToken);
    await deleteRefreshTokenFromRedis(userId);
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json({
    message: "Logged out successfully",
  });
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  const passwordMatched = await user.comparePassword(password);
  if (!passwordMatched) {
    const error = new Error("Password incorrect");
    error.status = 400;
    throw error;
  }

  const accessToken = generateToken("access", user._id);
  const refreshToken = generateToken("refresh", user._id);
  await storeRefreshTokenToRedis(user._id, refreshToken);

  setCookie(res, "accessToken", accessToken, 15 * 60);
  setCookie(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
};

// this will refresh the access token
export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    const error = new Error("Refresh token not provided");
    error.status = 401;
    throw error;
  }

  const { userId } = verifyToken("refresh", refreshToken);
  const storedToken = await getRefreshTokenFromRedis(userId);

  if (storedToken !== refreshToken) {
    const error = new Error("Refresh token invalid");
    error.status = 401;
    throw error;
  }

  const accessToken = generateToken("access", userId);

  setCookie(res, "accessToken", accessToken, 15 * 60);

  res.json({ message: "Token refreshed successfully" });
};

export const getProfile = async (req, res) => {
  res.json(req.user);
};
