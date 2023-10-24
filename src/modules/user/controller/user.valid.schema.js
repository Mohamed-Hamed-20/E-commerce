import joi from 'joi'
export const singup = {
  body: joi
        .object({
      firstName : joi.string().min(3).max(10),
      lastName : joi.string().min(3).max(10),
      userName: joi.string().min(3).max(20).required(),
      email : joi.string().email({tlds:{allow:["com", "net","gov"]}}).required(),
      password:joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
      cpassword: joi.string().valid(joi.ref("password")).required(),
      gender: joi.string().valid("male", "female"),
    })
    .required(),
  // paramas: joi.object().required(),
  // query: joi.object().required(),
  // file: joi.object().required(),
};

export const login = {
  body:joi.object({
      email : joi.string().email({tlds:{allow:["com", "net","gov"]}}).required(),
      password:joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
  }).required(),
};

export const forgetPass ={
  body:joi.object({
    email:joi.string().email().required(),
  }).required(),
}

export const resetpassword = {
  body:joi.object({
    email: joi.string().email().required(),
    password:joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).required(),
    confirmPassword:joi.string().valid(joi.ref("password")).required(),
    forgetCode:joi.string().min(7).max(7).required(),
  
  }).required(),
}