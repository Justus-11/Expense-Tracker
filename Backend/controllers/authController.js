const crypto = require("crypto");
const User   = require("../models/User");
const { generateToken }            = require("../utils/jwt");
const { sendPasswordResetEmail }   = require("../utils/emailService");

// ── POST /api/v2/auth/register ────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const user  = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      message: "Registration successful.",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed.", error: err.message });
  }
};

// ── POST /api/v2/auth/login ───────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password." });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful.",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed.", error: err.message });
  }
};

// ── GET /api/v2/auth/me (protected) ──────────────────────────────────────────
const getMe = async (req, res) => {
  res.status(200).json({
    user: { id: req.user._id, name: req.user.name, email: req.user.email },
  });
};

// ── POST /api/v2/auth/forgot-password ────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Please provide your email address." });
    }

    const user = await User.findOne({ email });

    // Always respond with 200 — never reveal whether the email exists
    if (!user) {
      return res.status(200).json({
        message: "If that email is registered, a reset link has been sent.",
      });
    }

    // Generate token and save hashed version to DB
    const rawToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Build reset URL pointing to your frontend reset page
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

    await sendPasswordResetEmail({
      toEmail:  user.email,
      toName:   user.name,
      resetURL,
    });

    res.status(200).json({
      message: "If that email is registered, a reset link has been sent.",
    });
  } catch (err) {
    console.error("forgotPassword error:", err);
    res.status(500).json({ message: "Could not send reset email. Please try again." });
  }
};

// ── POST /api/v2/auth/reset-password/:token ───────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { token }    = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    // Hash the raw URL token to compare with the stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken:   hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // not expired
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({ message: "Reset link is invalid or has expired." });
    }

    // Set new password and clear reset fields
    user.password             = password;
    user.resetPasswordToken   = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Auto-login: return a fresh token
    const authToken = generateToken(user._id);

    res.status(200).json({
      message: "Password reset successful.",
      token:   authToken,
      user:    { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("resetPassword error:", err);
    res.status(500).json({ message: "Password reset failed.", error: err.message });
  }
};

module.exports = { register, login, getMe, forgotPassword, resetPassword };