import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import Icon from '../AppIcon';

const Modal = React.forwardRef(({
  className,
  children,
  isOpen = false,
  onClose,
  variant = 'default', // 'default', 'glass', 'minimal'
  size = 'default', // 'sm', 'default', 'lg', 'xl', 'full'
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  title,
  description,
  ...props
}, ref) => {
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  const sizes = {
    sm: "max-w-md",
    default: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[95vw] max-h-[95vh]",
  };

  const variants = {
    default: "bg-card border border-border",
    glass: "glass border border-white/20",
    minimal: "bg-background border border-border",
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: 20,
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2,
      }
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeOnOverlayClick ? onClose : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            ref={ref}
            className={cn(
              "relative w-full rounded-xl shadow-2xl",
              sizes[size],
              variants[variant],
              className
            )}
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
            {...props}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex-1">
                  {title && (
                    <h2 className="text-xl font-semibold text-foreground">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {description}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    aria-label="Закрыть"
                  >
                    <Icon name="x" size={20} />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
});

Modal.displayName = "Modal";

// Confirmation Modal Component
const ConfirmationModal = React.forwardRef(({
  className,
  isOpen,
  onClose,
  onConfirm,
  title = "Подтверждение",
  message,
  confirmText = "Подтвердить",
  cancelText = "Отмена",
  variant = 'destructive', // 'default', 'destructive', 'warning'
  loading = false,
  ...props
}, ref) => {
  const variants = {
    default: {
      icon: 'help-circle',
      iconColor: 'text-primary',
      buttonVariant: 'default',
    },
    destructive: {
      icon: 'alert-triangle',
      iconColor: 'text-error',
      buttonVariant: 'destructive',
    },
    warning: {
      icon: 'alert-circle',
      iconColor: 'text-warning',
      buttonVariant: 'warning',
    },
  };

  const config = variants[variant];

  return (
    <Modal
      ref={ref}
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      className={className}
      {...props}
    >
      <div className="text-center">
        <div className={cn(
          "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4",
          config.iconColor
        )}>
          <Icon name={config.icon} size={24} />
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {title}
        </h3>
        
        {message && (
          <p className="text-sm text-muted-foreground mb-6">
            {message}
          </p>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm border border-input rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "px-4 py-2 text-sm rounded-lg transition-colors disabled:opacity-50",
              config.buttonVariant === 'default' && "bg-primary text-primary-foreground hover:bg-primary/90",
              config.buttonVariant === 'destructive' && "bg-error text-error-foreground hover:bg-error/90",
              config.buttonVariant === 'warning' && "bg-warning text-warning-foreground hover:bg-warning/90",
            )}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                Загрузка...
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
});

ConfirmationModal.displayName = "ConfirmationModal";

export { Modal, ConfirmationModal };
