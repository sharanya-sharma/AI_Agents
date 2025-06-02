const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const { getUserData, mapUserVariables } = require('./interviewProfile');
const mongoose = require('mongoose');
const Call = require('./models/Call');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const fetchCallDetails = async (callId) => {
  try {
    const url = `https://api.vapi.ai/call/${callId}`;
    const headers = {
      'Authorization': `Bearer ${process.env.VAPI_API_KEY}`
    };
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching call details from VAPI:', error.response?.data || error.message);
    throw error;
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running!', timestamp: new Date().toISOString() });
});

// User data route
app.get('/api/user-data/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const userData = await getUserData(parseInt(userId));

    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    const mappedData = mapUserVariables(userData);

    res.json({
      ...userData,
      mappedVariables: mappedData
    });

  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      details: error.stack
    });
  }
});

// Call details route — now also accepts userId from query parameters
app.get('/call-details', async (req, res) => {
  try {
    const callId = req.query.call_id;
    const userId = req.query.userId || null;  // Accept userId optionally

    console.log('Received call_id:', callId, 'userId:', userId);

    if (!callId) {
      return res.status(400).json({ error: 'Call ID is required' });
    }

    // Fetch call data from VAPI API
    const callData = await fetchCallDetails(callId);

    // Add userId to callData if provided
    if (userId) {
      callData.userId = userId;
    }

    // Save or update call data in MongoDB, including userId
    const savedCall = await Call.findOneAndUpdate(
      { call_id: callData.call_id || callId },
      callData,
      { upsert: true, new: true }
    );

    res.json(savedCall);

  } catch (error) {
    console.error('Error in /call-details route:', error);
    res.status(500).json({ error: 'Failed to fetch or save call details' });
  }
});

// Error and 404 handlers
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});