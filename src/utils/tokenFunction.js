import jwt from "jsonwebtoken";

export const generateToken = ({
  payload = {},
  signature = process.env.DEFAULT_SIGNATURE,
  expiresIn = "1h",
} = {}) => {
  if (!Object.keys(payload).length) {
    return false;
  }
  const token = jwt.sign(payload, signature, { expiresIn: expiresIn });
  return token;
};

export const verifyToken = ({
  token = "",
  signature = process.env.DEFAULT_SIGNATURE,
} = {}) => {
  const decode = jwt.verify(token, signature);
  if (!decode) {
    return false;
  }
  return decode;
};
