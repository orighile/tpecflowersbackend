// config/smtp.js

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === "465", // true only for port 465 (SSL)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  authMethod: "LOGIN",
  debug: true,
  logger: true,
});

export const sendContactMail = ({ name, email, message }) => {
  const sentDate = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return transporter.sendMail({
    from: `"Website Contact Form" <${process.env.SMTP_USER}>`,
    to: process.env.RECEIVER_EMAIL,
    replyTo: email,
    subject: `New Contact Form Message from ${name}`,
    // Plain text version (helps avoid spam filters)
    text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Message:
${message}

Sent on: ${sentDate}
    `.trim(),

    // Professional HTML version
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>New Contact Message</title>
        </head>
        <body style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background-color: #e91e63; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">New Contact Form Message</h1>
            </div>

            <!-- Body -->
            <div style="padding: 30px;">
              <p style="font-size: 16px; color: #333333; margin-bottom: 20px;">
                You have received a new message from your website contact form.
              </p>

              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; color: #555555; width: 100px;">Name:</td>
                  <td style="padding: 10px 0; color: #333333;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; color: #555555;">Email:</td>
                  <td style="padding: 10px 0;">
                    <a href="mailto:${email}" style="color: #e91e63; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; vertical-align: top; font-weight: bold; color: #555555;">Message:</td>
                  <td style="padding: 15px; background-color: #f9f9f9; border-radius: 6px; border-left: 4px solid #e91e63; color: #333333; line-height: 1.6;">
                    ${message.replace(/\n/g, "<br>")}
                  </td>
                </tr>
              </table>

              <p style="font-size: 14px; color: #888888; margin-top: 30px;">
                Sent on: <strong>${sentDate}</strong>
              </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f8f8f8; padding: 20px; text-align: center; font-size: 12px; color: #999999;">
              This email was sent from your website contact form.
            </div>
          </div>
        </body>
      </html>
    `.trim(),
  });
};

// Verify SMTP connection on startup
transporter.verify((err) => {
  if (err) {
    console.error("SMTP CONNECTION FAILED:", err);
  } else {
    console.log("SMTP READY");
  }
});