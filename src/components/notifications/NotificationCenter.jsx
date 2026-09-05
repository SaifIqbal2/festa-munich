import React, { useState, useEffect } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { useModernStore } from '../../stores/modernStore';
import './NotificationCenter.css';

export const NotificationCenter = () => {
  const { notifications, unreadCount, markAsRead } = useModernStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="notification-center">
      <button
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: 'relative' }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: '#d32f2f',
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none' }}>
              <X size={18} />
            </button>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <p style={{ padding: '20px', textAlign: 'center', color: 'var(--color-textSecondary)' }}>
                No notifications yet
              </p>
            ) : (
              notifications.slice(0, 10).map((notif) => (
                <div
                  key={notif.id}
                  className={`notification-item ${notif.is_read ? 'read' : 'unread'}`}
                  onClick={() => !notif.is_read && markAsRead(notif.id)}
                >
                  <div className="notification-content">
                    <h4>{notif.title}</h4>
                    <p>{notif.message}</p>
                    <small>{new Date(notif.created_at).toLocaleDateString()}</small>
                  </div>
                  {!notif.is_read && (
                    <div className="notification-unread-dot">
                      <span></span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="notification-footer">
            <a href="/account" onClick={() => setIsOpen(false)}>
              View all notifications
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
