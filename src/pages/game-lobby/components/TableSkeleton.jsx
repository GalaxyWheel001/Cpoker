import React from 'react';

const TableSkeleton = () => {
  return (
    <div className="bg-surface border border-border rounded-lg p-4 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="h-5 bg-muted rounded w-24" />
          <div className="h-4 bg-muted rounded w-16" />
        </div>
        <div className="h-4 bg-muted rounded w-16" />
      </div>
      {/* Game Info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-4">
          <div className="h-4 bg-muted rounded w-12" />
          <div className="h-4 bg-muted rounded w-16" />
        </div>
        <div className="h-4 bg-muted rounded w-12" />
      </div>
      {/* Players */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex -space-x-2">
          {[...Array(3)]?.map((_, index) => (
            <div
              key={index}
              className="w-8 h-8 bg-muted rounded-full border-2 border-background"
            />
          ))}
        </div>
        <div className="h-4 bg-muted rounded w-12" />
      </div>
      {/* Button */}
      <div className="h-10 bg-muted rounded-lg" />
    </div>
  );
};

export default TableSkeleton;