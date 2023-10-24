import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html, bcc } = {}) => {
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: process.env.email,
      pass: process.env.password,
    },
  });
  const info = await transporter.sendMail({
    from: `"Route Acadamy👻" <${process.env.email}>`, // sender address
    to,
    bcc, // list of receivers
    subject, // Subject line
    text: "Hello world?", // plain text body
    html, // html body
  });
    return info.accepted.length <1 ?false :true
};
