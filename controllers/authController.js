const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateVerificationToken } = require('../utils/generateToken');
const { sendVerificationEmail } = require('../services/emailService');

// Реєстрація
const register = async (req, res) => {
  const { email, password } = req.body;
  const verificationToken = generateVerificationToken();

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashedPassword, verificationToken });

  await sendVerificationEmail(email, verificationToken);

  res.status(201).json({ message: 'User registered. Verification email sent.' });
};

// Логін
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.verify) {
    return res.status(401).json({ message: 'Email not verified or user not found' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token });
};

// Верифікація
const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.verify = true;
  user.verificationToken = null;
  await user.save();

  res.status(200).json({ message: 'Verification successful' });
};

// Повторна відправка
const resendVerification = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'missing required field email' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.verify) {
    return res.status(400).json({ message: 'Verification has already been passed' });
  }

  await sendVerificationEmail(email, user.verificationToken);
  res.status(200).json({ message: 'Verification email sent' });
};

module.exports = { register, login, verifyEmail, resendVerification };
