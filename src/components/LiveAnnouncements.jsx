
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { Bell, BellRing, Megaphone } from 'lucide-react';
import { Helmet } from "react-helmet-async";

const LiveAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [newAnnouncementId, setNewAnnouncementId] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [deletingId, setDeletingId] = useState(null);
  const socketRef = useRef(null);
  const hasInitialized = useRef(false);
  const userIdRef = useRef(null);

  // Generate or retrieve user ID (unique per browser)
  useEffect(() => {
    // Get existing user ID from localStorage or create one
    let userId = localStorage.getItem('announcement_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('announcement_user_id', userId);
    }
    userIdRef.current = userId;
    
    console.log('👤 Current user ID:', userId);
    
    // Fetch initial unread count
    fetchUnreadCount(userId);
  }, []);

  const fetchUnreadCount = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/announcements/unread-count/${userId}`);
      setNotificationCount(response.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  // Initialize WebSocket connection
  useEffect(() => {
    console.log("🔌 Connecting to WebSocket server...");
    
    socketRef.current = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      query: { userId: userIdRef.current }
    });

    // Connection events
    socketRef.current.on("connect", () => {
      console.log("✅ Connected to announcements server");
      setConnectionStatus("connected");
    });

    socketRef.current.on("disconnect", (reason) => {
      console.log("❌ Disconnected:", reason);
      setConnectionStatus("disconnected");
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Connection error:", error.message);
      setConnectionStatus("error");
    });

    // Receive initial announcements with read status
    socketRef.current.on("initial-announcements", (data) => {
      console.log("📋 Received initial announcements:", data.length);
      setAnnouncements(data);
      hasInitialized.current = true;
      
      // Calculate unread count from data
      const unreadCount = data.filter(ann => !ann.readByThisUser).length;
      setNotificationCount(unreadCount);
    });

    // Receive NEW announcement in real-time
    socketRef.current.on("new-announcement", (announcement) => {
      console.log("🎉 NEW ANNOUNCEMENT from server:", announcement.title);
      
      // Add to beginning of list (marked as unread for current user)
      setAnnouncements(prev => [{
        ...announcement,
        readByThisUser: false
      }, ...prev]);
      
      // Highlight the new announcement
      setNewAnnouncementId(announcement.id);
      
      // Increment notification count for current user
      setNotificationCount(prev => prev + 1);
      
      // Play notification sound
      playNotificationSound();
      
      // Auto-clear highlight after 5 seconds
      setTimeout(() => {
        setNewAnnouncementId(null);
      }, 5000);
    });

    // Handle announcement deletion
    socketRef.current.on("announcement-deleted", (deletedId) => {
      console.log("🗑️ Announcement deleted via socket:", deletedId);
      
      setAnnouncements(prev => {
        const updated = prev.filter(ann => ann.id !== deletedId);
        
        // Recalculate notification count
        const unreadCount = updated.filter(ann => !ann.readByThisUser).length;
        setNotificationCount(unreadCount);
        
        return updated;
      });
    });

    // When announcement is read by any user
    socketRef.current.on("announcement-read", ({ announcementId, userId }) => {
      console.log(`👤 User ${userId} read announcement ${announcementId}`);
      
      // If it's not the current user, update the read status
      if (userId !== userIdRef.current) {
        setAnnouncements(prev => prev.map(ann => {
          if (ann.id === announcementId) {
            return ann; // Other user reading doesn't affect current user's read status
          }
          return ann;
        }));
      }
    });

    // Receive unread count updates
    socketRef.current.on("unread-count", (count) => {
      setNotificationCount(count);
    });

    // When new announcement increments everyone's count
    socketRef.current.on("increment-unread-count", () => {
      if (!isVisible) {
        setNotificationCount(prev => prev + 1);
      }
    });

    // When announcements are cleared
    socketRef.current.on("announcements-cleared", () => {
      setAnnouncements([]);
      setNotificationCount(0);
      console.log("🗑️ All announcements cleared");
    });

    // When another user marks all as read
    socketRef.current.on("user-marked-all-read", ({ userId }) => {
      console.log(`👤 User ${userId} marked all announcements as read`);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("🔌 WebSocket disconnected");
      }
    };
  }, []);

  // Function to mark an announcement as read
  const markAsRead = async (announcementId) => {
    const userId = userIdRef.current;
    
    // Update local state immediately
    setAnnouncements(prev => prev.map(ann => {
      if (ann.id === announcementId && !ann.readByThisUser) {
        return { ...ann, readByThisUser: true };
      }
      return ann;
    }));
    
    // Decrement notification count if this was unread
    setAnnouncements(prev => {
      const announcement = prev.find(ann => ann.id === announcementId);
      if (announcement && !announcement.readByThisUser) {
        setNotificationCount(prevCount => Math.max(0, prevCount - 1));
      }
      return prev;
    });

    // Send to server via WebSocket
    if (socketRef.current) {
      socketRef.current.emit('mark-as-read', {
        announcementId,
        userId
      });
    }

    // Also send to REST API
    try {
      await axios.post(`http://localhost:5000/api/announcements/${announcementId}/read`, {
        userId
      });
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  // Function to mark ALL announcements as read
  const markAllAsRead = async () => {
    const userId = userIdRef.current;
    
    // Update local state
    setAnnouncements(prev => prev.map(ann => ({
      ...ann,
      readByThisUser: true
    })));
    
    // Clear notification count
    setNotificationCount(0);
    
    // Send to server via WebSocket
    if (socketRef.current) {
      socketRef.current.emit('mark-all-read', { userId });
    }
    
    // Also send to REST API
    try {
      await axios.post(`http://localhost:5000/api/announcements/mark-all-read`, {
        userId
      });
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  // DELETE METHOD - Remove announcement
  const deleteAnnouncement = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) {
      return;
    }

    setDeletingId(id);
    
    try {
      const response = await axios.delete(`http://localhost:5000/api/announcements/${id}`);
      
      if (response.status === 200) {
        // Update local state
        setAnnouncements(prev => prev.filter(ann => ann.id !== id));
        
        if (newAnnouncementId === id) {
          setNewAnnouncementId(null);
        }
        
        console.log("✅ Announcement deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete announcement:", error);
      alert("Failed to delete announcement. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // Batch delete method
  const deleteMultipleAnnouncements = async (ids) => {
    if (!window.confirm(`Are you sure you want to delete ${ids.length} announcement(s)?`)) {
      return;
    }

    try {
      // Delete each announcement one by one
      for (const id of ids) {
        await axios.delete(`http://localhost:5000/api/announcements/${id}`);
      }
      
      // Update local state
      setAnnouncements(prev => prev.filter(ann => !ids.includes(ann.id)));
      
      // Clear new announcement highlight if any of the deleted ones were new
      if (ids.includes(newAnnouncementId)) {
        setNewAnnouncementId(null);
      }
      
      console.log(`✅ ${ids.length} announcement(s) deleted successfully`);
    } catch (error) {
      console.error("Failed to delete announcements:", error);
      alert("Failed to delete announcements. Please try again.");
    }
  };

  // Fallback: Polling every 5 seconds if WebSocket fails
  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (connectionStatus === "connected") return; // Skip if WebSocket is working
      
      try {
        const res = await axios.get("http://localhost:5000/api/announcements");
        const userId = userIdRef.current;
        
        // Get user's read status
        let readStatus = [];
        try {
          const readRes = await axios.get(`http://localhost:5000/api/announcements/unread-count/${userId}`);
          // We need to calculate which announcements are unread
        } catch (error) {
          console.error('Failed to fetch read status:', error);
        }
        
        // Merge with read status
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        // Check for new announcements (for polling fallback)
        if (hasInitialized.current && announcements.length > 0) {
          const currentIds = sorted.map(a => a.id);
          const previousIds = announcements.map(a => a.id);
          const newIds = currentIds.filter(id => !previousIds.includes(id));
          
          if (newIds.length > 0) {
            const newestAnnouncement = sorted.find(a => a.id === newIds[0]);
            if (newestAnnouncement) {
              setNewAnnouncementId(newestAnnouncement.id);
              setNotificationCount(prev => prev + 1);
              playNotificationSound();
              
              setTimeout(() => {
                setNewAnnouncementId(null);
              }, 5000);
            }
          }
        }
        
        // Mark all as unread initially (simplified)
        const announcementsWithReadStatus = sorted.map(ann => ({
          ...ann,
          readByThisUser: false // This should be fetched from server
        }));
        
        setAnnouncements(announcementsWithReadStatus);
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
      }
    };

    // Initial fetch
    fetchAnnouncements();

    // Set up polling only if WebSocket is not connected
    if (connectionStatus !== "connected") {
      const pollInterval = setInterval(fetchAnnouncements, 5000);
      return () => clearInterval(pollInterval);
    }
  }, [connectionStatus, announcements.length]);

  const playNotificationSound = () => {
    try {
      // Simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = "sine";
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      // Silent fail if audio not supported
    }
  };

  const clearNotifications = () => {
    markAllAsRead();
  };

  const scrollToAnnouncement = (id) => {
    const element = document.getElementById(`announcement-${id}`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      // Add temporary highlight
      element.classList.add('ring-4', 'ring-yellow-400');
      setTimeout(() => {
        element.classList.remove('ring-4', 'ring-yellow-400');
      }, 2000);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  const handleOpenPanel = () => {
    setIsVisible(true);
    
    // Mark all announcements as read when panel opens
    markAllAsRead();
  };

  const handleTogglePanel = () => {
    if (isVisible) {
      setIsVisible(false);
    } else {
      handleOpenPanel();
    }
  };

  return (
    <>
         <Helmet>
         <title>Tullu Dimtu Secondary School</title>
          </Helmet>
  

      {/* Toggle Button */}
    <button
  onClick={handleTogglePanel}
  className="fixed top-20 right-4 z-50
    w-11 h-11 rounded-full
    bg-neutral-900 hover:bg-neutral-800
    text-white
    flex items-center justify-center
    shadow-md hover:shadow-lg
    transition-all duration-200
    active:scale-95"
>
  <div className="relative">
    
    {/* Bell Icon */}
    <Bell className="w-6 h-6 stroke-[1.8]" />

    {/* Notification Counter (YouTube style) */}
    {notificationCount > 0 && (
      <span
        className="absolute -top-1 -right-1
        min-w-[18px] h-[18px]
        bg-red-600 text-white
        text-[11px] font-semibold
        rounded-full
        flex items-center justify-center
        leading-none"
      >
        {notificationCount > 9 ? '9+' : notificationCount}
      </span>
    )}
  </div>
</button>



      {/* Main Announcements Panel */}
      <div
        className={`fixed top-28 right-4 w-80 max-h-96 z-40 transition-all duration-300 ${
          isVisible
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-full pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className={`w-2 h-2 rounded-full ${
                    connectionStatus === "connected" ? "bg-green-400 animate-ping" : 
                    connectionStatus === "connecting" ? "bg-yellow-400 animate-pulse" : 
                    "bg-red-400"
                  }`}></div>
                </div>
                <h3 className="text-white font-bold text-lg">Live Announcements</h3>
              </div>
              <div className="flex items-center space-x-2">
                {notificationCount > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="text-xs bg-white/20 text-white px-2 py-1 rounded hover:bg-white/30"
                  >
                    Clear ({notificationCount})
                  </button>
                )}
                <div className="text-xs text-white/80 bg-white/20 px-2 py-1 rounded">
                  {announcements.length} items
                </div>
              </div>
            </div>
            <div className="text-xs text-white/60 mt-1">
              {connectionStatus === "connected" ? "✅ Live updates active" : 
               connectionStatus === "connecting" ? "🔄 Connecting..." : 
               "⚠️ Using fallback updates"}
              <span className="ml-2">👤 User: {userIdRef.current?.substring(0, 8)}...</span>
            </div>
          </div>

          {/* Announcements List */}

          <a href="/school-news">


            
          <div className="p-3 space-y-3 max-h-80 overflow-y-auto">
            {announcements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📢</div>
                <p>No announcements yet</p>
                <p className="text-sm text-gray-400 mt-1">When director publishes, it will appear here instantly!</p>
              </div>
            ) : (
              announcements.map((ann) => (
                <div
                  key={ann.id}
                  id={`announcement-${ann.id}`}
                  className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                    newAnnouncementId === ann.id
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 shadow-md"
                      : ann.readByThisUser
                      ? "bg-gray-50 border-gray-200 opacity-90"
                      : "bg-gradient-to-r from-yellow-50 to-blue-50 border-yellow-200 shadow-sm"
                  } hover:bg-blue-50 hover:border-blue-300`}
                  onClick={() => {
                    if (newAnnouncementId === ann.id) {
                      scrollToAnnouncement(ann.id);
                    }
                    if (!ann.readByThisUser) {
                      markAsRead(ann.id);
                    }
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center space-x-2">
                      {newAnnouncementId === ann.id ? (
                        <span className="text-red-500 animate-pulse">●</span>
                      ) : ann.readByThisUser ? (
                        <span className="text-green-500">✓</span>
                      ) : (
                        <span className="text-blue-500">📣</span>
                      )}
                      <h4 className="font-semibold text-gray-800">{ann.title}</h4>
                    </div>
                    <div className="flex items-center space-x-1">
                      {newAnnouncementId === ann.id && (
                        <span className="text-xs bg-gradient-to-r from-green-400 to-blue-400 text-white px-2 py-0.5 rounded-full">
                          NEW
                        </span>
                      )}
                      {!ann.readByThisUser && newAnnouncementId !== ann.id && (
                        <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-0.5 rounded-full">
                          UNREAD
                        </span>
                      )}
                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering parent onClick
                          deleteAnnouncement(ann.id);
                        }}
                        disabled={deletingId === ann.id}
                        className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                        title="Delete announcement"
                      >
                        {deletingId === ann.id ? (
                          <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin block"></span>
                        ) : (
                          <span className="text-xs">🗑️</span>
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{ann.message}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      <span>{formatTime(ann.createdAt)}</span>
                      <span className="mx-1">•</span>
                      <span>{ann.from || 'Director'}</span>
                    </div>
                    {ann.priority === 'high' && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">⚠️ Important</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          </a>




         
          <div className="border-t border-gray-200 px-3 py-2 bg-gray-50">
            <div className="flex justify-between items-center text-sm text-gray-600">
             
              <div className="flex items-center space-x-2">
               
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded bg-blue-400"
                >
                  Hide
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveAnnouncements;