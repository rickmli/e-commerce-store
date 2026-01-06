import User from "../models/User.js";
import {
  deleteRefreshToken,
  getRefreshToken,
  storeRefreshToken,
} from "../services/redisService.js";
import { setCookie } from "../utils/cookie.js";
import { generateToken, verifyRefreshToken } from "../utils/token.js";

export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({ name, email, password });

    // authenticate
    const accessToken = generateToken("access", newUser._id);
    const refreshToken = generateToken("refresh", newUser._id);
    await storeRefreshToken(newUser._id, refreshToken);

    setCookie(res, "accessToken", accessToken, 15 * 60);
    setCookie(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60);

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const signout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const { userId } = verifyRefreshToken(refreshToken);
      await deleteRefreshToken(userId);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatched = await user.comparePassword(password);
    if (!passwordMatched) {
      return res.status(400).json({ message: "Password incorrect" });
    }

    const accessToken = generateToken("access", user._id);
    const refreshToken = generateToken("refresh", user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookie(res, "accessToken", accessToken, 15 * 60);
    setCookie(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// this will refresh the access token
export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not provided" });
    }

    const { userId } = verifyRefreshToken(refreshToken);
    const storedToken = await getRefreshToken(userId);

    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Refresh token invalid" });
    }

    const accessToken = generateToken("access", userId);

    setCookie(res, "accessToken", accessToken, 15 * 60);

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("Error in refreshToken controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
