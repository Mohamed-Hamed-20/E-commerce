import { usermodel } from "../../../../DB/models/user.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import bcrypt, { hashSync, compareSync } from "bcrypt";
import { sendEmail } from "../../../utils/sendEmail.js";
import crypto from "crypto";
import {
  SignUpTemplet,
  restpasswordTemplet,
} from "../../../utils/generateHtml.js";
import jwt from "jsonwebtoken";
import { tokenmodel } from "../../../../DB/models/Token.model.js";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890", 7);

export const register = asyncHandler(async (req, res, next) => {
  const { email, gender, password, userName, lastName, firstName } = req.body;
  // console.log({ email, firstName, lastName });
  const chkemail = await usermodel.findOne({ email });
  if (chkemail) {
    return next(new Error("email is already exist", { cause: 400 }));
  }
  //chk username
  const chkeuserName = await usermodel.findOne({ userName });
  if (chkeuserName) {
    return next(new Error("username is already exist", { cause: 400 }));
  }

  const hashpassword = hashSync(password, parseInt(process.env.salt_Round));
  const activationCode = crypto.randomBytes(64).toString("hex");
  console.log(hashpassword);
  const result = new usermodel({
    firstName,
    lastName,
    email,
    password: hashpassword,
    userName,
    gender,
    activationCode,
  });
  if (!result) {
    return next(new Error("invalid-signUP", { cause: 500 }));
  }
  await result.save();
  console.log(
    `${req.protocol}://${req.headers.host}/confirmEmail/${activationCode}`
  );
  const link = `${req.protocol}://${req.headers.host}/user/confirmEmail/${activationCode}`;
  const isSend = await sendEmail({
    to: email,
    subject: "confirm Email",
    html: `${SignUpTemplet(link)}`,
  });

  return isSend
    ? res
        .status(200)
        .json({ message: "Done and chk you inbox to confirm ur email", result })
    : next(new Error("Something went wrong!"));
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { activationCode } = req.params;
  console.log(activationCode);
  const findUser = await usermodel.findOneAndUpdate(
    { activationCode: activationCode },
    { isconfrimed: true, $unset: { activationCode: 1 } }
  );
  if (!findUser) {
    return next(new Error("user Not found ", { cause: 404 }));
  }
  return res.status(200).json({ message: "done Email confrimed", findUser });
});

export const login = asyncHandler(async (req, res, next) => {
  //get data
  const { email, password } = req.body;
  //chk email in DB
  const chkuser = await usermodel.findOne({ email: email });
  if (!chkuser) {
    return next(new Error("invalid email or password", { cause: 404 }));
  }
  //chk is confirm email
  if (chkuser.isconfrimed == false) {
    return next(new Error("please confirm ur email", { cause: 400 }));
  }
  //chk password done
  const matched = bcrypt.compareSync(password, chkuser.password);
  if (!matched) {
    return next(new Error("invalid email or password_", { cause: 404 }));
  }
  //genreate token
  const token = jwt.sign(
    { _id: chkuser._id, email: chkuser.email },
    process.env.tokenKey,
    { expiresIn: 60 * 60 }
  );
  //chk it generateed
  if (!token) {
    return next(new Error("invalid Token", { cause: 404 }));
  }
  //safe token in DB and sure he done with info
  const createToken = {
    token: token,
    userID: chkuser._id,
    agent: req.headers["user-agent"],
    expiredAt: "1h",
  };
  const safetoken = await tokenmodel.create(createToken);
  if (!safetoken) {
    return next(new Error("error try later", { cause: 400 }));
  }
  //change user status to online
  chkuser.status = "online";
  await chkuser.save();
  //resopnse done with token
  return res.json({
    message: `welcome ${chkuser.firstName} ${chkuser.lastName}`,
    token: token,
    userEmail: chkuser.email,
  });
});

export const sendForgetCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  //chk email exist
  const user = await usermodel.findOne({ email: email });
  if (!user) {
    return next(new Error("invaild email", { cause: 404 }));
  }
  //generate forget code
  const forgetCode = nanoid();
  console.log(forgetCode);
  user.forgetCode = forgetCode;
  await user.save();
  // send this code to him by email
  sendEmail({
    to: user.email,
    subject: "Resst ur password",
    html: `${restpasswordTemplet(forgetCode)}`,
  });
  //res chk ur email
  res.json({ sucuss: true, message: "chect ur email" });
});

export const resetpassword = asyncHandler(async (req, res, next) => {
  const { forgetCode, email, password } = req.body;
  //chk email exist and forgetCode right
  const user = await usermodel.findOne({ email });
  if (!user) {
    return next(new Error("invalid email", { cause: 404 }));
  }
  if (user.forgetCode != forgetCode) {
    return next(new Error("invalid forgetCode"));
  }
  // make all token for this user is false
  const tokens = await tokenmodel.findOneAndUpdate(
    { userID: user._id },
    { isvalid: false },
    { new: true }
  );
  // password using hash password
  const newpassword = hashSync(password, Number(process.env.salt_Round));
  console.log(newpassword);
  //update user table passwoed and forgetpass
  const result = await usermodel.findByIdAndUpdate(
    { _id: user._id },
    { forgetCode: null, password: newpassword },
    { new: true }
  );
  if (!result) {
    return next(new Error("server Error :(", { cause: 500 }));
  }
  return res.json({ message: "Done", result, tokens });
});

export const getuser = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const result = await usermodel.findOne({ _id: user._id });
  if (!result) {
    return next(new Error("User not found"));
  }
  return res.status(200).json({ message: "done", user: result });
});
export const ___ = asyncHandler(async (req, res, next) => {});
