import nodemailer from "nodemailer";

interface MailOptions {
  email: string;
  token: string;
}

export async function sendMail({ email, token }: MailOptions) {
  console.log("Inside sendmail and token is : "+token+" email is : "+email);
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const subject = "Reset your password";
    const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`;

    const html = `
      <div style="font-family: sans-serif;">
        <h2>${subject}</h2>
        <p>Click below to reset your password:</p>
        <a href="${resetLink}" style="display:inline-block;background:#facc15;color:black;padding:10px 15px;border-radius:8px;text-decoration:none;">
          Reset Password
        </a>
        <p>If you didn’t request this, just ignore this email.</p>
      </div>
    `;

    const mailOptions = {
      from: `"Tech Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Mail sent:", info.response);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Email not sent");
  }
}
