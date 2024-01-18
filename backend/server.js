const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 5002;

// Connect to MongoDB
mongoose.connect('mongodb+srv://Cluster54225:WnRfUV5lQ2Rw@cluster54225.4m9foig.mongodb.net', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a User model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
});

const User = mongoose.model('User', userSchema);

app.use(cors());
app.use(bodyParser.json());

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check for duplicate username or email
    const duplicateUser = await User.findOne({ $or: [{ username }, { email }] });
    if (duplicateUser) {
      res.json({ success: false, message: 'Username or email already exists. Please choose a different one.' });
      return;
    }

    const user = new User({ username, password: hashedPassword, email });
    await user.save();
    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    res.json({ success: false, message: 'Error registering user' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    let user;
    
    // Check if login is by username or email
    if (username) {
      user = await User.findOne({ username });
    } else if (email) {
      user = await User.findOne({ email });
    } else {
      res.json({ success: false, message: 'Username or email is required for login' });
      return;
    }

    if (user && bcrypt.compareSync(password, user.password)) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.json({ success: false, message: 'Invalid username, email, or password' });
    }
  } catch (error) {
    res.json({ success: false, message: 'Error during login' });
  }
});

// Check duplicate endpoint
app.post('/api/check-duplicate', async (req, res) => {
  const { username, email } = req.body;

  try {
    const duplicateUser = await User.findOne({ $or: [{ username }, { email }] });
    res.json({ exists: !!duplicateUser });
  } catch (error) {
    res.json({ error: 'Error checking for duplicate values' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
