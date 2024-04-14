import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  port: 465,
  secure: true,
  host: "smtp.gmail.com",
  auth: {
    user: "itish.v007@gmail.com",
    pass: process.env.NEXT_APP_MAIL_PASS_KEY,
  },
});

export const sendMail = async (userMail: string, otp: string) => {
  try {
    await transporter.sendMail({
      from: "itish.v007@gmail.com",
      to: userMail,
      subject: "Account Verification",
      text: `This is your one time password <bold>${otp}</bold>`,
    });
  } catch (e) {
    console.log(e);
    return e;
  }
};
