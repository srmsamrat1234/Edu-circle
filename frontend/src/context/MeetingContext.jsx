import { createContext, useContext, useState } from 'react';
import { getMeetingDetails } from '../services/meetings';
import { useAuth } from './AuthContext';

const MeetingContext = createContext();

export const useMeeting = () => {
  const context = useContext(MeetingContext);
  if (!context) {
    throw new Error('useMeeting must be used within MeetingProvider');
  }
  return context;
};

export const MeetingProvider = ({ children }) => {
  const { user } = useAuth();
  const [activeMeeting, setActiveMeeting] = useState(null);
  const [meetingLoading, setMeetingLoading] = useState(false);
  const [meetingError, setMeetingError] = useState(null);

  // Start a new meeting
  const startMeeting = async (bookingId, isModerator = false) => {
    try {
      setMeetingLoading(true);
      setMeetingError(null);

      // Validate user info
      if (!user?._id || !user?.name || !user?.email) {
        throw new Error('User information not available. Please login again.');
      }

      const meetingData = await getMeetingDetails(
        bookingId, 
        isModerator,
        user.name,    // Pass userName from auth context
        user.email    // Pass userEmail from auth context
      );
      
      setActiveMeeting({
        roomName: meetingData.roomName,
        domain: meetingData.domain,
        token: meetingData.token,
        userName: user.name,
        userEmail: user.email,
        isModerator
      });

      return meetingData;
    } catch (error) {
      console.error('Error starting meeting:', error);
      setMeetingError(error.message || 'Failed to start meeting');
      throw error;
    } finally {
      setMeetingLoading(false);
    }
  };

  // End current meeting
  const endMeeting = () => {
    setActiveMeeting(null);
    setMeetingError(null);
  };

  const value = {
    activeMeeting,
    meetingLoading,
    meetingError,
    startMeeting,
    endMeeting
  };

  return (
    <MeetingContext.Provider value={value}>
      {children}
    </MeetingContext.Provider>
  );
};