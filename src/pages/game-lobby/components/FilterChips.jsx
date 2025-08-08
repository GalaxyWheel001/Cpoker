import React from 'react';
import Icon from '../../../components/AppIcon';

const FilterChips = ({ filters, activeFilters, onFilterChange }) => {
  const handleFilterClick = (filterId, value) => {
    const currentValues = activeFilters?.[filterId] || [];
    const newValues = currentValues?.includes(value)
      ? currentValues?.filter(v => v !== value)
      : [...currentValues, value];
    
    onFilterChange(filterId, newValues);
  };

  const isActive = (filterId, value) => {
    return (activeFilters?.[filterId] || [])?.includes(value);
  };

  return (
    <div className="space-y-3">
      {filters?.map((filter) => (
        <div key={filter?.id} className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">{filter?.label}</h4>
          <div className="flex flex-wrap gap-2">
            {filter?.options?.map((option) => {
              const active = isActive(filter?.id, option?.value);
              return (
                <button
                  key={option?.value}
                  onClick={() => handleFilterClick(filter?.id, option?.value)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium poker-transition ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-surface text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {option?.icon && (
                    <Icon 
                      name={option?.icon} 
                      size={16} 
                      className={active ? 'text-primary-foreground' : 'text-current'}
                    />
                  )}
                  <span>{option?.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilterChips;