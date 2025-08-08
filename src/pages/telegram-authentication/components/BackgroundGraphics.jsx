import React from 'react';

const BackgroundGraphics = () => {
  return (
    <>
      {/* Gradient Overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
      
      {/* Floating Elements */}
      <div className="fixed top-20 left-8 w-3 h-3 bg-primary/20 rounded-full animate-pulse" />
      <div className="fixed top-32 right-12 w-2 h-2 bg-accent/30 rounded-full animate-bounce" 
           style={{ animationDelay: '1s' }} />
      <div className="fixed bottom-40 left-16 w-4 h-4 bg-secondary/20 rounded-full animate-pulse" 
           style={{ animationDelay: '2s' }} />
      <div className="fixed bottom-60 right-8 w-2 h-2 bg-warning/25 rounded-full animate-bounce" 
           style={{ animationDelay: '0.5s' }} />
      
      {/* Subtle Grid Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none"
           style={{
             backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-primary) 1px, transparent 0)`,
             backgroundSize: '40px 40px'
           }} />
    </>
  );
};

export default BackgroundGraphics;