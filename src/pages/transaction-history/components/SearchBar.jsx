import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SearchBar = ({ onSearch, placeholder = "Поиск транзакций..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isActive, setIsActive] = useState(false);

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
    setIsActive(false);
  };

  return (
    <div className="relative">
      <div className={`relative flex items-center bg-surface border rounded-lg poker-transition ${
        isActive ? 'border-primary' : 'border-border'
      }`}>
        <div className="absolute left-3 flex items-center">
          <Icon name="Search" size={16} className="text-muted-foreground" />
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e?.target?.value)}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none"
        />
        
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 p-1 text-muted-foreground hover:text-foreground poker-transition rounded"
          >
            <Icon name="X" size={16} />
          </button>
        )}
      </div>
      {/* Search suggestions or recent searches could go here */}
      {isActive && searchTerm && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg poker-shadow-modal z-50 max-h-48 overflow-y-auto">
          <div className="p-2">
            <div className="px-3 py-2 text-xs text-muted-foreground">
              Поиск по ID, описанию или сумме
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;