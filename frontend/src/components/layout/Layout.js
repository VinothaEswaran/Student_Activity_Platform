import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notificationApi } from '../../services/api';
import {
  LayoutDashboard, Calendar, Star, PlusCircle, User, Bell, LogOut, Menu, X, GraduationCap
} from 'lucide-react';
import './Layout.css';

export default function Layout() {
  const { user, logout, isOrganizer } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    notificationApi.getUnreadCount()
      .then(res => setUnread(res.data.count))
      .catch(() => {});
    const iv = setInterval(() => {
      notificationApi.getUnreadCount()
        .then(res => setUnread(res.data.count))
        .catch(() => {});
    }, 30000);
    return () => clearInterval(iv);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/events', icon: <Calendar size={18} />, label: 'Events' },
    { to: '/my-activities', icon: <Star size={18} />, label: 'My Activities' },
    ...(isOrganizer() ? [{ to: '/events/create', icon: <PlusCircle size={18} />, label: 'Create Event' }] : []),
    { to: '/profile', icon: <User size={18} />, label: 'Profile' },
  ];

  return (
    <div className={`layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <GraduationCap size={22} />
            {sidebarOpen && <span>StudentHub</span>}
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">{user?.name?.[0]?.toUpperCase()}</div>
            {sidebarOpen && (
              <div className="user-details">
                <p className="user-name">{user?.name}</p>
                <p className="user-role">{user?.role}</p>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={20} />
            </button>
          </div>
          <div className="topbar-right">
            <button className="notif-btn" onClick={() => navigate('/profile')}>
              <Bell size={18} />
              {unread > 0 && <span className="notif-badge">{unread}</span>}
            </button>
            <div className="topbar-user">
              <div className="avatar sm">{user?.name?.[0]?.toUpperCase()}</div>
              <span>{user?.name}</span>
            </div>
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
