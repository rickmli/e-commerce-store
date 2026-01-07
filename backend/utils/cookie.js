export const setCookie = (res, name, payload, maxAge = 15 * 60) => {
  res.cookie(name, payload, {
    httpOnly: true, // prevent XSS attacks, cannot be accessed by js
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevents CSRF attack, cross-site request forgery atttack
    maxAge: maxAge * 1000, // 15 minutes
  });
};
