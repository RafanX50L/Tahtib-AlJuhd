import { transporter } from "../config/mail.config";
import { env } from "../config/env.config";

export  const sendOtpEmail = async (email: string, otp: string) => {
  try {
    const mailOptions = {
      from: `"Tahtib ALJuhd" <${env.SENDER_EMAIL}>`,
      to: email,
      subject: "Tahtib ALJuhd OTP Verificaiton",
      html: `
                <h1>OTP Verification</h1>
                <p>Your OTP is: ${otp}</p>
                <p>Use this OTP to verify your email. Do not share it with anyone.</p><br />
                <p>If you did not request this verification, you can ignore this email.</p>
                <p>~ Tahtib ALJuhd</p>
                  `,
    };
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", email);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  try {
    const resetLink = `${env.RESET_PASS_URL}?token=${token}`;
    const mailOptions = {
      from: `"Tahtib ALJuhd" <${env.SENDER_EMAIL}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
                <h1>Password Reset Request</h1>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}">Reset Password</a><br />
                <p>If you did not request this, please ignore this email.</p>
                <p>~ Tahtib ALJuhd</p>
                  `, 
    };
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully to:", email);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Error sending password reset email");
  }
};