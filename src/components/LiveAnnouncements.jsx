import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { Bell, X, Trash2, AlertCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";

const LiveAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [newAnnouncementId, setNewAnnouncementId] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const socketRef = useRef(null);
  const userIdRef = useRef(null);

  useEffect(() => {
    let userId = localStorage.getItem("announcement_user_id");
    if (!userId) {
      userId = "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("announcement_user_id", userId);
    }
    userIdRef.current = userId;
    fetchUnreadCount(userId);
  }, []);

  const fetchUnreadCount = async (userId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/announcements/unread-count/${userId}`
      );
      setNotificationCount(res.data.unreadCount);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    socketRef.current = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
      reconnection: true,
      query: { userId: userIdRef.current },
    });

    socketRef.current.on("connect", () => setConnectionStatus("connected"));
    socketRef.current.on("disconnect", () => setConnectionStatus("disconnected"));
    socketRef.current.on("connect_error", () => setConnectionStatus("error"));

    socketRef.current.on("initial-announcements", (data) => {
      setAnnouncements(data);
      const unreadCount = data.filter((a) => !a.readByThisUser).length;
      setNotificationCount(unreadCount);
    });

    socketRef.current.on("new-announcement", (ann) => {
      setAnnouncements((prev) => [{ ...ann, readByThisUser: false }, ...prev]);
      setNotificationCount((prev) => prev + 1);
      setNewAnnouncementId(ann.id);
      setTimeout(() => {
        setNewAnnouncementId(null);
      }, 3 * 24 * 60 * 60 * 1000); // 3 days

      playNotificationSound();
    });

    // Listen for announcement deletion
    socketRef.current.on("announcement-deleted", (deletedId) => {
      setAnnouncements((prev) => prev.filter((ann) => ann.id !== deletedId));
      // Recalculate notification count
      setNotificationCount((prev) => {
        const deletedAnn = announcements.find(a => a.id === deletedId);
        return deletedAnn && !deletedAnn.readByThisUser ? Math.max(0, prev - 1) : prev;
      });
    });

    return () => socketRef.current.disconnect();
  }, []);

  const markAsRead = async (id) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, readByThisUser: true } : a))
    );
    setNotificationCount((prev) => Math.max(0, prev - 1));
    if (socketRef.current)
      socketRef.current.emit("mark-as-read", { userId: userIdRef.current, announcementId: id });
    try {
      await axios.post(`http://localhost:5000/api/announcements/${id}/read`, {
        userId: userIdRef.current,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = () => {
    setAnnouncements((prev) => prev.map((a) => ({ ...a, readByThisUser: true })));
    setNotificationCount(0);
    if (socketRef.current)
      socketRef.current.emit("mark-all-read", { userId: userIdRef.current });
  };

  // DELETE FUNCTIONALITY
  const handleDeleteClick = (announcement) => {
    setAnnouncementToDelete(announcement);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!announcementToDelete) return;

    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/api/announcements/${announcementToDelete.id}`);
      
      // Emit socket event for real-time deletion
      if (socketRef.current) {
        socketRef.current.emit("delete-announcement", announcementToDelete.id);
      }
      
      // Remove from local state
      setAnnouncements((prev) => prev.filter((ann) => ann.id !== announcementToDelete.id));
      
      // Update notification count if the deleted announcement was unread
      if (!announcementToDelete.readByThisUser) {
        setNotificationCount((prev) => Math.max(0, prev - 1));
      }
      
      // Close confirmation dialog
      setShowDeleteConfirm(false);
      setAnnouncementToDelete(null);
    } catch (error) {
      console.error("Error deleting announcement:", error);
      alert("Failed to delete announcement. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setAnnouncementToDelete(null);
  };

  const playNotificationSound = () => {
    const audio = new Audio("/notification.mp3");
    audio.play().catch(() => {});
  };

  return (
    <>
      <Helmet>
        <title>Tullu Dimtu Secondary School</title>
      </Helmet>

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .announcement-bell {
            width: 44px;
            height: 44px;
            top: 16px;
            right: 16px;
          }
          
          .announcement-bell svg {
            width: 22px;
            height: 22px;
          }
          
          .announcement-counter {
            min-width: 16px;
            height: 16px;
            font-size: 10px;
            top: -2px;
            right: -2px;
          }
          
          .announcement-panel {
            width: 92vw;
            max-width: 100%;
            top: 80px;
            right: 4vw;
            left: 4vw;
            max-height: 70vh;
          }
          
          .announcement-panel-header {
            padding: 12px 16px;
          }
          
          .announcement-panel-title {
            font-size: 18px;
          }
          
          .announcement-panel-subtitle {
            font-size: 12px;
          }
          
          .announcement-panel-header-icon {
            width: 32px;
            height: 32px;
          }
          
          .announcement-panel-header-icon svg {
            width: 16px;
            height: 16px;
          }
          
          .announcement-panel-close {
            padding: 6px;
          }
          
          .announcement-panel-close svg {
            width: 20px;
            height: 20px;
          }
          
          .announcement-status {
            font-size: 12px;
          }
          
          .announcement-mark-all {
            font-size: 12px;
            padding: 6px 12px;
          }
          
          .announcement-list {
            padding: 12px;
            max-height: 50vh;
            space-y: 12px;
          }
          
          .announcement-item {
            padding: 16px;
          }
          
          .announcement-title {
            font-size: 16px;
          }
          
          .announcement-message {
            font-size: 14px;
            margin-bottom: 12px;
          }
          
          .announcement-new-badge {
            font-size: 10px;
            padding: 4px 8px;
          }
          
          .announcement-footer {
            padding: 10px 16px;
            font-size: 12px;
          }
          
          .announcement-empty {
            padding: 40px 0;
          }
          
          .announcement-empty-icon {
            font-size: 48px;
            margin-bottom: 16px;
          }
          
          .announcement-empty-text {
            font-size: 16px;
          }
          
          .announcement-empty-subtext {
            font-size: 12px;
          }

          /* Delete confirmation modal mobile styles */
          .delete-confirm-modal {
            width: 90vw;
            max-width: 400px;
            padding: 20px;
          }
        }
        
        @media (max-width: 480px) {
          .announcement-panel {
            width: 94vw;
            right: 3vw;
            left: 3vw;
            max-height: 75vh;
          }
          
          .announcement-panel-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .announcement-panel-header-top {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .announcement-panel-header-bottom {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .announcement-list {
            max-height: 55vh;
          }
        }
        
        @media (max-width: 360px) {
          .announcement-bell {
            width: 40px;
            height: 40px;
            top: 12px;
            right: 12px;
          }
          
          .announcement-bell svg {
            width: 20px;
            height: 20px;
          }
          
          .announcement-panel {
            top: 70px;
            max-height: 80vh;
          }
          
          .announcement-panel-title {
            font-size: 16px;
          }
          
          .announcement-item {
            padding: 12px;
          }
        }

        /* Animation for delete button */
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }

        .delete-btn:hover {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="delete-confirm-modal bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">Delete Announcement</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="font-medium text-gray-800 mb-1">{announcementToDelete?.title}</p>
              <p className="text-sm text-gray-600 truncate">{announcementToDelete?.message}</p>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Announcement
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bell Button */}
      <button
        onClick={() => {
          setIsVisible(!isVisible);
          if (!isVisible) markAllAsRead();
        }}
        className="top-5  z-50
    w-11 h-11 rounded-full
    bg-neutral-900 hover:bg-neutral-800
    text-white
    flex items-center justify-center
    shadow-md hover:shadow-lg
    transition-all duration-200
    active:scale-95"
      >
        <div className="relative">
          <Bell className="w-6 h-6 stroke-[1.8]" />
          {notificationCount > 0 && (
            <span
              className="announcement-counter absolute -top-1 -right-1
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

      {/* Announcements Panel */}
      <div
        className={`announcement-panel fixed top-24 right-6 w-[520px] max-h-[600px] z-40 transition-all duration-500 ${
          isVisible
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-full pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-300/50 backdrop-blur-sm bg-white/95">
          {/* Header */}
          <div className="announcement-panel-header bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 px-6 py-4 text-white">
            <div className="announcement-panel-header-top flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <div className="announcement-panel-header-icon w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="announcement-panel-title font-bold text-2xl">Live Announcements</h3>
                  <p className="announcement-panel-subtitle text-sm text-blue-100">Tullu Dimtu Secondary School</p>
                </div>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="announcement-panel-close p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:rotate-90"
                title="Close panel"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="announcement-panel-header-bottom flex justify-between items-center mt-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  connectionStatus === "connected"
                    ? "bg-green-400 animate-pulse"
                    : connectionStatus === "connecting"
                    ? "bg-yellow-400"
                    : "bg-red-400"
                }`} />
                <span className="announcement-status text-sm font-medium">
                  {connectionStatus === "connected"
                    ? "Live updates connected"
                    : connectionStatus === "connecting"
                    ? "Establishing connection..."
                    : "Connection disrupted"}
                </span>
              </div>
              
              {notificationCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="announcement-mark-all text-sm bg-white/25 hover:bg-white/40 px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                >
                  Mark all as read ({notificationCount})
                </button>
              )}
            </div>
          </div>

          {/* Announcements List */}
       
             <div className="announcement-list p-4 space-y-4 max-h-[500px] overflow-y-auto">
            {announcements.length === 0 ? (
              <div className="announcement-empty text-center py-12 text-gray-500">
                <div className="announcement-empty-icon text-6xl mb-4 opacity-50">📢</div>
                <p className="announcement-empty-text text-xl font-medium text-gray-600">No announcements yet</p>
                <p className="announcement-empty-subtext text-sm text-gray-400 mt-2">New announcements will appear here</p>
              </div>
            ) : (
              announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={`announcement-item p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
                    newAnnouncementId === ann.id
                      ? "bg-gradient-to-r from-blue-50/80 to-purple-50/80 border-blue-400 shadow-lg animate-pulse-subtle"
                      : ann.readByThisUser
                      ? "bg-gray-50/80 border-gray-300"
                      : "bg-gradient-to-r from-amber-50/90 to-blue-50/90 border-amber-400 shadow-md"
                  } hover:border-blue-400 hover:shadow-lg group relative`}
                  onClick={() => !ann.readByThisUser && markAsRead(ann.id)}
                >
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(ann);
                    }}
                    className="delete-btn absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:shadow-xl z-10"
                    title="Delete announcement"
                  >
                    <Trash2 className="w-4 h-4" />   this name of this name  of this name of this name of this name of this name of this name of this nmae of this name of this name of thia name of thia name of this name of this name of this name of this name of this name of this name of this name of this n
                  </button>
                  
                   <a href="/school-news">  
                   <p>this name of local ho</p>
                    
              
                     <div className="flex justify-between items-start mb-3">
                       {!ann.imageUrl && (
                <div className="mb-10 flex justify-center">
                  <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl">
                    <img 
                      src={ann.imageUrl} 
                      alt={ann.title}
                      className="w-full h-auto max-h-[500px] object-contain"
                    />  
                    {/* Optional gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                  </div>  
                </div>    
              )}
                    <h4 className="announcement-title font-bold text-lg text-gray-900 pr-4">{ann.title}</h4>
                    {!ann.readByThisUser && (
                      <span className="announcement-new-badge text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full shadow">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="announcement-message text-gray-700 text-base mb-4 leading-relaxed">{ann.message} <span className="text-blue-600">Read More...</span></p>
                   
                   </a>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200/50">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        newAnnouncementId === ann.id 
                          ? 'bg-blue-500 animate-ping' 
                          : ann.readByThisUser 
                          ? 'bg-gray-400' 
                          : 'bg-green-500'
                      }`} />
                      <span className="text-xs text-gray-500">
                        {ann.readByThisUser ? 'Read' : newAnnouncementId === ann.id ? 'Just arrived' : 'Unread'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">
                        {new Date(ann.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(ann);
                        }}
                        className="text-xs text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
      
          
          {/* Footer */}
          <div className="announcement-footer border-t border-gray-200 px-6 py-3 bg-gray-50/50">
            <div className="text-center text-sm text-gray-500">
              {announcements.length} announcement{announcements.length !== 1 ? 's' : ''} • Click to mark as read • Hover to delete
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveAnnouncements;