// Controller for user registration

import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

// Post: /api/users/registers
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if required fields are present
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing requuired fields" });
    }

    // Check if user already exists
    const user = User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Encrypting the password befoe creating the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      hashedPassword,
    });

    // Return success message
    const token = generateToken(newUser._id);
    newUser.password = undefined;

    return res
      .status(201)
      .json({ message: "User created successfully", token, user: newUser });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
