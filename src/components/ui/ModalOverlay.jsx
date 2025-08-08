import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../AppIcon';

const ModalOverlay = ({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  showCloseButton = true, 
  closeOnBackdrop = true,
  size = 'default' // 'sm', 'default', 'lg', 'xl', 'full'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e?.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    default: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  const modalContent = (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={closeOnBackdrop ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className={`relative w-full ${sizeClasses?.[size]} bg-popover border border-border rounded-lg poker-shadow-modal animate-slide-in max-h-[90vh] flex flex-col`}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
            {title && (
              <h2 className="text-lg font-semibold text-popover-foreground">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground poker-transition rounded-lg hover:bg-surface ml-auto"
              >
                <Icon name="X" size={20} />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ModalOverlay;