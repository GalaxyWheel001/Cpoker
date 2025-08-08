import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SearchBar = ({ onSearch, onFilterToggle, hasActiveFilters }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Search Input */}
      <div className="flex-1 relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Icon name="Search" size={18} className="text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Поиск столов..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-10 py-2.5 bg-surface border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent poker-transition"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground poker-transition"
          >
            <Icon name="X" size={18} />
          </button>
        )}
      </div>

      {/* Filter Button */}
      <Button
        variant={hasActiveFilters ? "default" : "outline"}
        size="default"
        onClick={onFilterToggle}
        iconName="Filter"
        className="px-3"
      >
        {hasActiveFilters && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
        )}
      </Button>
    </div>
  );
};

export default SearchBar;