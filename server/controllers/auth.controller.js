import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: "gmail", // Change to your email service provider
  auth: {
    user: "sawravdas01@gmail.com", // Replace with your email
    pass: "diofoensyszumjgj", // Replace with your email password
  },
});

export const forgotPass = async (req, res) => {
  const { username } = req.body;

  try {
    // Find user by 			username,

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a random password reset token
    const resetToken = Math.random().toString(36);

    // Update user's resetPasswordToken and resetPasswordExpires fields
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Send password reset email
    await transporter.sendMail({
      from: "sawravdas01@gmail.com",
      to: `${user.email}`,
      subject: "Password Reset",
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
		  Please click on the following link, or paste this into your browser to complete the process:\n\n
		  https://cuet-v2-1.onrender.com/reset/${resetToken}\n\n
		  If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    });

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resetpass = async (req, res) => {
  const { password, resetToken } = req.body;
 console.log(password ,resetToken);
  try {
    // Find user by reset token
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    console.log(user);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Update user's password
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signup = async (req, res) => {
  try {
    const {
      fullName,
      username,
      password,
      confirmPassword,
      role,
      image,
      location,
      email,
      phone
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // HASH PASSWORD HERE
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      role,
      image,
      location,
      email,
      phone
    });

    if (newUser) {
      // Generate JWT token here
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        image: newUser.image,
        role: newUser.role,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      image: user.image,
      role: user.role,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
