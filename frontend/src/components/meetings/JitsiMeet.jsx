import { useEffect, useRef } from 'react';

const JitsiMeet = ({ roomName, userName, userEmail, isModerator, onEndCall }) => {
  const containerRef = useRef(null);
  const apiRef = useRef(null);

  useEffect(() => {
    // Load Jitsi API script
    const loadScript = () => {
      if (window.JitsiMeetExternalAPI) {
        initMeeting();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = initMeeting;
      script.onerror = () => console.error('Failed to load Jitsi API');
      document.body.appendChild(script);
    };

    const initMeeting = () => {
      if (!containerRef.current) return;

      apiRef.current = new window.JitsiMeetExternalAPI('meet.jit.si', {
        roomName,
        width: '100%',
        height: '100%',
        parentNode: containerRef.current,
        userInfo: {
          displayName: userName,
          email: userEmail
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: false,        // ✅ DISABLE pre-join screen
          disableDeepLinking: true,
          enableWelcomePage: false,          // ✅ Disable welcome page
          enableClosePage: false             // ✅ Disable close page
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop',
            'fullscreen', 'fodeviceselection', 'hangup', 'profile',
            'chat', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'feedback', 'shortcuts',
            'tileview', 'download', 'help'
          ],
          DISPLAY_WELCOME_PAGE_CONTENT: false
        }
      });

      // Event listeners
      apiRef.current.addEventListeners({
        videoConferenceJoined: (event) => {
          console.log('✅ Joined meeting:', event.room);
        },
        videoConferenceLeft: (event) => {
          console.log('👋 Left meeting:', event.room);
          if (onEndCall) onEndCall();
        },
        readyToClose: () => {
          console.log('🔚 Meeting ready to close');
          if (onEndCall) onEndCall();
        }
      });
    };

    loadScript();

    // Cleanup on unmount
    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [roomName, userName, userEmail, isModerator, onEndCall]);

  return (
    // ✅ Smaller, responsive screen size
    <div className="w-full h-full min-h-[400px] max-h-[70vh] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl p-2">
      <div ref={containerRef} className="w-full h-full rounded-xl" />
    </div>
  );
};

export default JitsiMeet;