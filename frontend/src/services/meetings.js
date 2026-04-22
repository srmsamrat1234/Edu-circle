import API from './api';

// Generate JWT token for Jitsi Meet
export const generateMeetingToken = async (roomName, isModerator, userName, userEmail) => {
  try {
    console.log('🔐 Generating token for:', { roomName, userName, userEmail, isModerator });

    const response = await API.post('/meetings/generate-token', {
      roomName,
      userName,
      userEmail,
      isModerator
    });
    
    console.log('✅ Token generated successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Error generating meeting token:', error);
    console.error('📦 Error response:', error.response?.data);
    throw error;
  }
};

// Create meeting room for a booking
export const createMeetingRoom = async (bookingId) => {
  try {
    console.log('🏠 Creating room for booking:', bookingId);

    const response = await API.post('/meetings/create-room', {
      bookingId
    });
    
    console.log('✅ Room created successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Error creating meeting room:', error);
    console.error('📦 Error response:', error.response?.data);
    throw error;
  }
};

// Get meeting details (combines token + room creation)
export const getMeetingDetails = async (bookingId, isModerator, userName, userEmail) => {
  try {
    console.log('🎥 Starting meeting setup:', { bookingId, userName, userEmail, isModerator });
    
    // First create/get room
    const roomData = await createMeetingRoom(bookingId);
    
    // Then generate token with user info
    const tokenData = await generateMeetingToken(
      roomData.roomName, 
      isModerator, 
      userName, 
      userEmail
    );
    
    console.log('✅ Meeting details ready');
    
    return {
      success: true,
      roomName: roomData.roomName,
      domain: roomData.domain,
      token: tokenData.token,
      meetingUrl: roomData.meetingUrl
    };
  } catch (error) {
    console.error('❌ Error getting meeting details:', error);
    throw error;
  }
};