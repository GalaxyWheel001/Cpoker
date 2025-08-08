import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const BottomTabBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    {
      id: 'lobby',
      label: 'Lobby',
      icon: 'Home',
      path: '/game-lobby',
      activeIcon: 'Home'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'User',
      path: '/user-profile-management',
      activeIcon: 'User'
    },
    {
      id: 'history',
      label: 'History',
      icon: 'Clock',
      path: '/transaction-history',
      activeIcon: 'Clock'
    }
  ];

  const isActive = (path) => location.pathname === path;

  const handleTabClick = (path) => {
    navigate(path);
  };

  // Hide bottom tab bar on certain routes
  const hiddenRoutes = ['/telegram-authentication', '/poker-table-game'];
  if (hiddenRoutes?.includes(location.pathname)) {
    return null;
  }

  return (
    <>
      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border lg:hidden">
        <div className="flex items-center justify-around h-16 px-4 safe-area-pb">
          {tabs?.map((tab) => {
            const active = isActive(tab?.path);
            return (
              <button
                key={tab?.id}
                onClick={() => handleTabClick(tab?.path)}
                className={`flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg poker-transition min-w-0 flex-1 ${
                  active
                    ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-surface'
                }`}
              >
                <Icon
                  name={active ? tab?.activeIcon : tab?.icon}
                  size={20}
                  className={active ? 'text-primary' : 'text-current'}
                />
                <span className={`text-xs font-medium truncate ${
                  active ? 'text-primary' : 'text-current'
                }`}>
                  {tab?.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-64 lg:bg-background lg:border-r lg:border-border lg:z-40">
        <div className="flex flex-col w-full">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 p-6 border-b border-border">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg">
              <Icon name="Spade" size={24} color="var(--color-background)" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-foreground">Poker Room</h1>
              <p className="text-xs text-muted-foreground">Premium Gaming</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {tabs?.map((tab) => {
                const active = isActive(tab?.path);
                return (
                  <button
                    key={tab?.id}
                    onClick={() => handleTabClick(tab?.path)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg poker-transition text-left ${
                      active
                        ? 'bg-primary text-primary-foreground poker-shadow-interactive'
                        : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                    }`}
                  >
                    <Icon
                      name={active ? tab?.activeIcon : tab?.icon}
                      size={20}
                      className="flex-shrink-0"
                    />
                    <span className="font-medium">{tab?.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              <Icon name="Shield" size={16} />
              <span>Secure Gaming Platform</span>
            </div>
          </div>
        </div>
      </div>
      {/* Desktop Content Offset */}
      <div className="hidden lg:block lg:w-64 lg:flex-shrink-0" />
    </>
  );
};

export default BottomTabBar;