const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// @desc    Generate JWT token for Jitsi Meet (RS256)
// @route   POST /api/meetings/generate-token
// @access  Private (authenticated users)
exports.generateToken = async (req, res) => {
  try {
    const { roomName, userName, userEmail, isModerator = false } = req.body;

    // Validate inputs
    if (!roomName || !userName || !userEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Room name, user name, and email are required' 
      });
    }

    // JaaS credentials from .env (RS256 configuration)
    const appId = process.env.JAAS_APP_ID;
    const keyId = process.env.JAAS_KEY_ID;
    const privateKeyPath = process.env.JAAS_PRIVATE_KEY_PATH;
    const algorithm = process.env.JITSI_ALGORITHM || 'RS256';

    if (!appId || !keyId || !privateKeyPath) {
      return res.status(500).json({ 
        success: false, 
        message: 'Jitsi RS256 credentials not configured' 
      });
    }

    // Read private key file
    const privateKey = fs.readFileSync(
      path.join(__dirname, '..', privateKeyPath), 
      'utf8'
    );

    // Create JWT payload for RS256 (JaaS format)
    const payload = {
      aud: 'jitsi',
      iss: appId,
      sub: appId,
      room: roomName,
      context: {
        user: {
          id: req.user._id.toString(),
          name: userName,
          email: userEmail,
          moderator: isModerator
        },
        features: {
          'livestreaming': true,
          'recording': true,
          'transcription': true,
          'file-upload': true,
          'outbound-call': true
        }
      }
    };

    // Generate JWT token with RS256 algorithm
    const token = jwt.sign(payload, privateKey, {
      algorithm: algorithm,
      expiresIn: '1h',
      keyid: keyId  // Required for RS256 - identifies which key was used
    });

    res.json({
      success: true,
      token,
      roomName,
      domain: process.env.JITSI_DOMAIN || 'meet.jit.si',
      algorithm: 'RS256',
      expiresIn: '1 hour'
    });

  } catch (error) {
    console.error('Token generation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate meeting token',
      error: error.message 
    });
  }
};

// @desc    Create meeting room for booking
// @route   POST /api/meetings/create-room
// @access  Private
exports.createMeetingRoom = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Booking ID is required' 
      });
    }

    // Generate unique room name based on booking
    const roomName = `educircle-${bookingId}`;

    res.json({
      success: true,
      roomName,
      domain: process.env.JITSI_DOMAIN || 'meet.jit.si',
      meetingUrl: `https://${process.env.JITSI_DOMAIN || 'meet.jit.si'}/${roomName}`
    });

  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create meeting room',
      error: error.message 
    });
  }
};