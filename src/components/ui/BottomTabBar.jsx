import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const BottomTabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: 'Домой', icon: 'Home', path: '/' },
    { label: 'Лобби', icon: 'LayoutGrid', path: '/game-lobby' },
    { label: 'Профиль', icon: 'User', path: '/user-profile-management' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t border-border lg:hidden">
      <div className="grid grid-cols-3">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center py-2 text-xs ${active ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Icon name={tab.icon} size={18} />
              <span className="mt-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomTabBar;