// config/smtp.js → Now using Resend (no SMTP needed!)

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendContactMail = async ({ name, email, message }) => {
  const sentDate = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  try {
    const data = await resend.emails.send({
      // Change this later after verifying your domain in Resend dashboard
      from: 'Website Contact Form <onboarding@resend.dev>', 
      
      // Your personal/business email that receives the messages
      to: [process.env.RECEIVER_EMAIL], 
      
      // Allows you to reply directly to the visitor
      reply_to: email, 
      
      subject: `New Contact Form Message from ${name}`,

      // Plain text fallback (good for deliverability)
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Message:
${message}

Sent on: ${sentDate}
      `.trim(),

      // Beautiful HTML version (same design as before)
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
                      ${message.replace(/\n/g, '<br>')}
                    </td>
                  </tr>
                </table>

                <p style="font-size: 14px; color: #888888; margin-top: 30px;">
                  Sent on: <strong>${sentDate}</strong>
                </p>
              </div>

              <!-- Footer -->
              <div style="background-color: #f8f8f8; padding: 20px; text-align: center; font-size: 12px; color: #999999;">
                This email was sent from your website contact form at tpecflowers.com
              </div>
            </div>
          </body>
        </html>
      `.trim(),
    });

    console.log('Email successfully sent via Resend:', data);
    return data;
  } catch (error) {
    console.error('Failed to send email via Resend:', error);
    throw error; // Let your API route handle the error
  }
};

// Optional: Simple health check (no SMTP verify needed)
console.log('Resend email service ready (using API key from env)');