import React from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const FloatingActionButton = ({ onClick, disabled = false, loading = false }) => {
  const location = useLocation();

  // Only show FAB on lobby page
  if (location.pathname !== '/game-lobby') {
    return null;
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full poker-shadow-interactive poker-transition flex items-center justify-center ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
      }`}
    >
      {loading ? (
        <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
      ) : (
        <Icon name="Plus" size={24} />
      )}
    </button>
  );
};

export default FloatingActionButton;