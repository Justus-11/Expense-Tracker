const nodemailer = require("nodemailer");

// ── Transporter (Gmail) ───────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

// ── Send password reset email ─────────────────────────────────────────────────
const sendPasswordResetEmail = async ({ toEmail, toName, resetURL }) => {
  const mailOptions = {
    from:    `"SmartTechFinance" <${process.env.EMAIL_USER}>`,
    to:      toEmail,
    subject: "Reset your SmartTechFinance password",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;">

        <!-- Logo -->
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px;">
          <div style="background:#4f46e5;border-radius:10px;padding:8px;display:inline-block;">
            <span style="color:#fff;font-size:18px;font-weight:bold;">$</span>
          </div>
          <span style="font-size:18px;font-weight:700;color:#111827;">SmartTechFinance</span>
        </div>

        <!-- Heading -->
        <h2 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px;">
          Reset your password
        </h2>
        <p style="font-size:14px;color:#6b7280;margin:0 0 24px;">
          Hi ${toName}, we received a request to reset your password.
          Click the button below — this link expires in <strong>5 minutes</strong>.
        </p>

        <!-- CTA Button -->
        <a href="${resetURL}"
          style="display:inline-block;background:#4f46e5;color:#ffffff;text-decoration:none;
                 padding:12px 28px;border-radius:12px;font-size:14px;font-weight:600;margin-bottom:24px;">
          Reset Password
        </a>

        <!-- Fallback link -->
        <p style="font-size:12px;color:#9ca3af;margin:0 0 4px;">
          If the button doesn't work, copy and paste this link into your browser:
        </p>
        <p style="font-size:12px;color:#4f46e5;word-break:break-all;margin:0 0 24px;">
          ${resetURL}
        </p>

        <!-- Divider -->
        <hr style="border:none;border-top:1px solid #f3f4f6;margin:0 0 20px;" />

        <p style="font-size:12px;color:#9ca3af;margin:0;">
          If you didn't request a password reset, you can safely ignore this email.
          Your password will not be changed.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendPasswordResetEmail };