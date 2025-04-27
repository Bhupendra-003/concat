import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail({ to, subject, text, verificationLink }: { to: string, subject: string, text: string, verificationLink: string }) {
  console.log('Sending email...');
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject: 'Verify your email address',
      html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verify your email address</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #26262B; /* Dark color for text (converted from OKLCH) */
                        margin: 0;
                        padding: 0;
                        background-color: #1a1b1d;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 0 auto;/* White background */
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
                    }
                    .email-header {
                        background-color: #1a1b1d; /* Primary color (converted from OKLCH) */
                        padding: 4px 24px;
                        text-align: center;
                    }
                    h1 {
                        color: #ffffff; /* White text */
                        margin: 0;
                        font-size: 24px;
                        font-weight: 600;
                    }
                    .email-content {
                        padding: 15px;
                        background-color: #1a1b1d; /* White background */
                    }
                    .email-content p {
                        color: #ffffff;
                        margin-bottom: 20px;
                        font-size: 16px;
                    }
                    .verification-link {
                        word-break: break-all;
                        color: #0066CC;
                        text-decoration: underline;
                    }
                    .button-container {
                        text-align: center;
                        margin: 25px 0;
                    }
                    .button {
                        display: inline-block;
                        background-color: #FF4542; /* Primary color */
                        color: #ffffff !important; /* White text */
                        text-decoration: none;
                        padding: 12px 24px;
                        border-radius: 4px;
                        font-weight: 600;
                        font-size: 16px;
                    }
                    .email-footer {
                        padding: 15px;
                        text-align: center;
                        font-size: 12px;
                        color: #888888;
                        border-top: 1px solid #eeeeee;
                    }
                  span{
                    color: #FF4542
                  }
                  #brand{
                    font-size: 48px;
                    font-weight: 900;
                  }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">
                      <h1 id="brand">Con<span>Cat</span></h1>
                    </div>
                    <div class="email-content">
                      <h1>Verify your email address</h1>
                        <p>Click the button or the link to verify your email:</p>
                        <a href="${verificationLink}" class="verification-link">${verificationLink}</a>
                        <div class="button-container">
                            <a href="${verificationLink}" class="button">Verify Email</a>
                        </div>
                    </div>
                    <div class="email-footer">
                        &copy; ${new Date().getFullYear()} Concat
                    </div>
                </div>
            </body>
            </html>
            `
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
  console.log('Email sent');
  return;
}