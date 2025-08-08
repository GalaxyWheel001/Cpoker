import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';
import { cn } from '../../utils/cn';

const Toast = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose, 
  position = 'top-right' 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Ждем окончания анимации
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const getToastStyles = () => {
    const baseStyles = "flex items-center p-4 rounded-lg shadow-lg max-w-sm";
    
    switch (type) {
      case 'success':
        return cn(baseStyles, "bg-success text-success-foreground");
      case 'error':
        return cn(baseStyles, "bg-error text-error-foreground");
      case 'warning':
        return cn(baseStyles, "bg-warning text-warning-foreground");
      case 'info':
      default:
        return cn(baseStyles, "bg-primary text-primary-foreground");
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'CheckCircle';
      case 'error':
        return 'XCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'info':
      default:
        return 'Info';
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'top-left':
        return "top-4 left-4";
      case 'top-center':
        return "top-4 left-1/2 transform -translate-x-1/2";
      case 'top-right':
        return "top-4 right-4";
      case 'bottom-left':
        return "bottom-4 left-4";
      case 'bottom-center':
        return "bottom-4 left-1/2 transform -translate-x-1/2";
      case 'bottom-right':
        return "bottom-4 right-4";
      default:
        return "top-4 right-4";
    }
  };

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn("fixed z-50", getPositionStyles())}
        >
          <div className={getToastStyles()}>
            <Icon 
              name={getIcon()} 
              size={20} 
              className="mr-3 flex-shrink-0" 
            />
            <div className="flex-1">
              <p className="text-sm font-medium">{message}</p>
            </div>
            <button
              onClick={handleClose}
              className="ml-3 text-current hover:opacity-70 transition-opacity"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Toast;
