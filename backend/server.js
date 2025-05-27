const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const { getUserData, mapUserVariables } = require('./interviewProfile');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Function to fetch call details from VAPI
const fetchCallDetails = async (callId) => {
  try {
    const url = `https://api.vapi.ai/call/${callId}`;
    const headers = {
      'Authorization': `Bearer ${process.env.VAPI_API_KEY}`
    };
    
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching call details from VAPI:', error);
    throw error;
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running!', timestamp: new Date().toISOString() });
});

// API endpoint to get user data
app.get('/api/user-data/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate userId
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    console.log(`Fetching data for user ID: ${userId}`);
    
    // Get user data from database using your existing function
    const userData = await getUserData(parseInt(userId));
    
    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Map user variables for VAPI using your existing function
    const mappedData = mapUserVariables(userData);
    
    console.log(`Successfully fetched data for user: ${userData.name}`);
    console.log('Raw userData:', userData);
    console.log('Mapped data:', mappedData);
    
    // Return the user data in the format expected by frontend
    res.json({
      ...userData, // Raw database data
      mappedVariables: mappedData // Processed data for VAPI
    });
    
  } catch (error) {
    console.error('Detailed error fetching user data:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      details: error.stack
    });
  }
});

// Call details endpoint - now with actual VAPI integration
app.get('/call-details', async (req, res) => {
  try {
    const { call_id } = req.query;
    
    if (!call_id) {
      return res.status(400).json({ error: 'Call ID is required' });
    }
    
    console.log(`Fetching call details for call ID: ${call_id}`);
    
    // Fetch call details from VAPI API
    const response = await fetchCallDetails(call_id);
    console.log('VAPI Response:', response);
    
    const summary = response.summary || null;
    const analysis = response.analysis || null;
    
    res.json({
      analysis: analysis,
      summary: summary
    });
    
  } catch (error) {
    console.error('Error fetching call details:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API endpoints available:`);
  console.log(`   GET http://localhost:${PORT}/health`);
  console.log(`   GET http://localhost:${PORT}/api/user-data/:userId`);
  console.log(`   GET http://localhost:${PORT}/call-details?call_id=...`);
  console.log(`\n💡 Test with: curl http://localhost:${PORT}/health`);
});