const nodemailer = require('nodemailer');

/**
 * Sends an email using Nodemailer with SMTP configurations from environment variables.
 * If SMTP credentials are not configured, it logs the email and link to the console for development.
 *
 * @param {Object} options
 * @param {string} options.email - Recipient email address
 * @param {string} options.name - Recipient name
 * @param {string} options.resetUrl - Password reset URL
 * @param {number} options.expiresInMinutes - Expiration time in minutes (default 15)
 */
const sendResetEmail = async ({ email, name, resetUrl, expiresInMinutes = 15 }) => {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '587', 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.SMTP_EMAIL;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.SMTP_PASSWORD;
  const service = process.env.SMTP_SERVICE || process.env.EMAIL_SERVICE;
  const fromEmail = process.env.EMAIL_FROM || process.env.FROM_EMAIL || `"ScholarAI Support" <no-reply@scholarship.org>`;

  const recipientName = name || 'Student';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Request</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; overflow: hidden;" cellspacing="0" cellpadding="0">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">ScholarAI</h1>
              <p style="color: #e0e7ff; margin: 6px 0 0 0; font-size: 13px;">Smart Scholarship Finder & Eligibility System</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 36px 40px;">
              <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 20px; font-weight: 600;">Password Reset Request</h2>
              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #475569;">Hello ${recipientName},</p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                We received a request to reset the password for your ScholarAI account (<strong>${email}</strong>). Click the button below to choose a new password:
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}" target="_blank" style="display: inline-block; background-color: #4f46e5; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);">Reset Password</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 8px 0; font-size: 13px; line-height: 1.5; color: #64748b;">
                This link will expire in <strong>${expiresInMinutes} minutes</strong>. If you did not request a password reset, you can safely ignore this email; your password will remain unchanged.
              </p>
              
              <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 28px 0 20px 0;">
              
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #94a3b8;">
                If the button above does not work, copy and paste this URL into your browser:<br>
                <a href="${resetUrl}" style="color: #4f46e5; word-break: break-all; text-decoration: underline;">${resetUrl}</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 40px; text-align: center; border-top: 1px solid #f1f5f9;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">&copy; ${new Date().getFullYear()} ScholarAI. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const textContent = `ScholarAI Password Reset Request

Hello ${recipientName},

We received a request to reset your password for your ScholarAI account (${email}).

Reset your password using this link:
${resetUrl}

This link is valid for ${expiresInMinutes} minutes. If you did not request this, please ignore this email.

ScholarAI Team`;

  // If SMTP is not configured, log to console for development
  if (!user || !pass) {
    console.log('\n======================================================');
    console.log('📬 [EMAIL SERVICE NOTICE] SMTP credentials not configured in environment.');
    console.log(`✉️ Recipient: ${email}`);
    console.log(`🔗 Password Reset URL: ${resetUrl}`);
    console.log('ℹ️ Set SMTP_USER and SMTP_PASS in backend/.env to send real emails.');
    console.log('======================================================\n');
    return {
      success: true,
      delivered: false,
      notice: 'SMTP credentials not configured. Reset URL printed to server logs.',
    };
  }

  // Configure transporter options
  const transportOptions = service
    ? {
        service,
        auth: { user, pass },
      }
    : {
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      };

  const transporter = nodemailer.createTransport(transportOptions);

  const mailOptions = {
    from: fromEmail,
    to: email,
    subject: 'ScholarAI - Password Reset Request',
    text: textContent,
    html: htmlContent,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 Reset email sent successfully: ${info.messageId}`);
  return { success: true, delivered: true, messageId: info.messageId };
};

module.exports = { sendResetEmail };
