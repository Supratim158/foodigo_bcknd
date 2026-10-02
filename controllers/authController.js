const User = require('../models/userModel');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET || 'CraveDropSecret2026';
const JWT_SECRET = process.env.JWT_SEC || 'CraveDropJWTSecret2026';

module.exports = {
  createUser: async (req, res) => {
    try {
      const { userName, email, password, phone } = req.body;

      if (!userName || !email || !password) {
        return res.status(400).json({ status: false, message: 'Please provide name, email, and password' });
      }

      const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
      if (existingUser) {
        return res.status(400).json({ status: false, message: 'An account with this email already exists' });
      }

      const encryptedPassword = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();

      const newUser = new User({
        userName,
        email: email.toLowerCase().trim(),
        password: encryptedPassword,
        phone: phone || '+91 98765 43210',
        profile: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
      });

      const savedUser = await newUser.save();

      const userToken = jwt.sign(
        { id: savedUser._id, email: savedUser.email, userName: savedUser.userName },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return res.status(201).json({
        status: true,
        message: 'Account created successfully',
        token: userToken,
        user: {
          id: savedUser._id,
          name: savedUser.userName,
          email: savedUser.email,
          phone: savedUser.phone,
          avatar: savedUser.profile,
          isVip: true
        }
      });
    } catch (error) {
      console.error('Error in createUser:', error);
      return res.status(500).json({ status: false, message: error.message });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ status: false, message: 'Please enter email and password' });
      }

      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        return res.status(401).json({ status: false, message: 'User not found with this email' });
      }

      let decryptedPassword = '';
      try {
        const bytes = CryptoJS.AES.decrypt(user.password, SECRET_KEY);
        decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
      } catch (e) {
        decryptedPassword = user.password;
      }

      if (decryptedPassword !== password && user.password !== password) {
        return res.status(401).json({ status: false, message: 'Incorrect password entered' });
      }

      const userToken = jwt.sign(
        { id: user._id, email: user.email, userName: user.userName },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return res.status(200).json({
        status: true,
        message: 'Logged in successfully',
        token: userToken,
        user: {
          id: user._id,
          name: user.userName,
          email: user.email,
          phone: user.phone,
          avatar: user.profile,
          isVip: true
        }
      });
    } catch (error) {
      console.error('Error in loginUser:', error);
      return res.status(500).json({ status: false, message: error.message });
    }
  },

  verifyToken: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ status: false, message: 'No authorization token provided' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ status: false, message: 'User belonging to token no longer exists' });
      }

      return res.status(200).json({
        status: true,
        token,
        user: {
          id: user._id,
          name: user.userName,
          email: user.email,
          phone: user.phone,
          avatar: user.profile,
          isVip: true
        }
      });
    } catch (error) {
      return res.status(401).json({ status: false, message: 'Token is invalid or expired' });
    }
  }
};
