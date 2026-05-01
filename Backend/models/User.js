const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const crypto   = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type:      String,
      required:  [true, "Name is required"],
      trim:      true,
      maxlength: 50,
    },
    email: {
      type:     String,
      required: [true, "Email is required"],
      unique:   true,
      lowercase: true,
      trim:     true,
    },
    password: {
      type:     String,
      required: [true, "Password is required"],
      minlength: 6,
      select:   false,
    },

    // ── Password reset fields ─────────────────────────────────────────────────
    resetPasswordToken:   { type: String,  select: false },
    resetPasswordExpires: { type: Date,    select: false },
  },
  { timestamps: true }
);

// ── Hash password before saving ───────────────────────────────────────────────
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ── Compare plain password with hashed ───────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Generate a password reset token (raw token returned, hashed stored) ──────
userSchema.methods.generatePasswordResetToken = function () {
  const rawToken = crypto.randomBytes(32).toString("hex");

  // Store hashed version in DB so raw token in URL can't be abused if DB leaks
  this.resetPasswordToken   = crypto.createHash("sha256").update(rawToken).digest("hex");
  this.resetPasswordExpires = Date.now() + 5 * 60 * 1000; // 15 minutes

  return rawToken; // sent in the email link
};

module.exports = mongoose.model("User", userSchema);