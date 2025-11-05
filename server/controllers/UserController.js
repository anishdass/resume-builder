// Controller for user registration

import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

// Controller for user registration
// Post: /api/users/registers
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if required fields are present
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user already exists
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Encrypting the password befoe creating the user
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
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

// Controller for user login
// POST: /api/users/login
export const loginUser = async (req, res) => {
  try {
    // Get email and password from the body
    const { email, password } = req.body;

    // Check if user exists. If false send 400 and the message invalid user or password
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "User does not exist" });
    }
    // Verify password. If correct send a success message
    if (!user.password) {
      res.status(400).json({ message: "Invalid Password" });
    }

    // Generate token using user id, set user password as undefined, return user created successful message
    const token = generateToken(user._id);
    user.password = undefined;

    return res.status(200).json({ message: "Login successfull", token, user });
  } catch (error) {
    // Catch block with error message
    return res.status(200).json({ message: error.message });
  }
};

// Controller for user by id
// POST: /api/users/data
export const getUserById = async (req, res) => {
  try {
    // Get email and password from the body
    const { userId } = req.userId;

    // Check if user exists
    const user = User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user
    return res.status(200).json({ user });
  } catch (error) {
    // Catch block with error message
    return res.json(400).json({ message: error.message });
  }
};

// Controller for getting user resumes
// GET: /api/users/resume
export const getUserResumes = async (req, res) => {
  try {
    // Get UserId from middleware
    const userId = req.userId;
    // get and Return User Resumes
    const resumes = await Resume.find({ userId });
    return res.status(200).json({ resumes });
  } catch (error) {
    // Catch block with error message
    return res.json(400).json({ message: error.message });
  }
};
