import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/errorHandling.js";
import { tokenmodel } from "../../DB/models/Token.model.js";
import { usermodel } from "../../DB/models/user.model.js";

export const authentication = asyncHandler(async (req, res, next) => {
  let { token } = req.headers;

  //chk is token and start with what ever
  if (!token || !token.startsWith(process.env.Token_Start)) {
    return next(new Error("invalid token start with"), { cause: 400 });
  }

  // spilte startswith
  token = token.split(process.env.Token_Start)[1];
  try {
    // decode token
    const decode = jwt.verify(token, process.env.tokenKey);
    //chk token payload is right
    if (!decode.email && !decode._id) {
      return next(new Error("Invalid Token Payload"), { cause: 400 });
    }

    //chk this token in tokenDB and valid true
    const chktoken = await tokenmodel.findOne({ token: token, isvalid: true });
    if (!chktoken) {
      return next(new Error("Token not found in DB"), { cause: 400 });
    }

    //chk email in token in userDB or _id
    const user = await usermodel.findOne({ email: decode.email });
    //return next()
    req.user = user;
    return next();
  } catch (error) {
    if (error == "TokenExpiredError: jwt expired") {
      //chk and  find token and user in DB
      const findtoken = await tokenmodel.findOne({ token: token });
      if (!findtoken) {
        return next(new Error("invalid token", { cause: 400 }));
      }
      //find user
      const user = await usermodel.findById({ _id: findtoken.userID });
      if (!user) {
        return next(
          new Error("user not found , sign UP please", { cause: 400 })
        );
      }
      //generate new token
      const refreshToken = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.tokenKey,
        { expiresIn: 60 * 60 *12 }
      );
      if (!refreshToken) {
        return next(new Error("server error invalid token", { cause: 500 }));
      }
      //update DB token
      findtoken.token = refreshToken;
      await findtoken.save();
      res
        .status(200)
        .json({ message: "Done", sucess: true, token: refreshToken });
    } else {
      return next(new Error("invalid token", { cause: 400 }));
    }
  }
});
