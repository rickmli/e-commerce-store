import jwt from "jsonwebtoken";

const tokenConfig = {
  access: {
    secret: process.env.ACCESS_TOKEN_SECRET,
    expiresIn: "15m",
  },
  refresh: {
    secret: process.env.REFRESH_TOKEN_SECRET,
    expiresIn: "7d",
  },
};

export const generateToken = (tokenType, userId) => {
  const config = tokenConfig[tokenType];
  console.log(config);
  if (!config) {
    throw new Error(
      `Invalid token type: ${tokenType}. Use 'access' or 'refresh'.`
    );
  }

  return jwt.sign({ userId }, config.secret, {
    expiresIn: config.expiresIn,
  });
};

export const verifyToken = (tokenType, token) => {
  const config = tokenConfig[tokenType];
  if (!config) {
    throw new Error(
      `Invalid token type: ${tokenType}. Use 'access' or 'refresh'.`
    );
  }

  return jwt.verify(token, config.secret);
};
