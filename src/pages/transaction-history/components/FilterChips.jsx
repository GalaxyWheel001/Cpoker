import React from 'react';
import Icon from '../../../components/AppIcon';

const FilterChips = ({ activeFilters, onFilterChange }) => {
  const filterOptions = [
    { id: 'all', label: 'Все', icon: 'List' },
    { id: 'chips', label: 'Фишки', icon: 'Coins' },
    { id: 'usdt', label: 'USDT', icon: 'DollarSign' },
    { id: 'deposits', label: 'Пополнения', icon: 'TrendingUp' },
    { id: 'withdrawals', label: 'Выводы', icon: 'TrendingDown' },
    { id: 'games', label: 'Игры', icon: 'Spade' }
  ];

  const dateRangeOptions = [
    { id: 'today', label: 'Сегодня', icon: 'Calendar' },
    { id: 'week', label: 'Неделя', icon: 'CalendarDays' },
    { id: 'month', label: 'Месяц', icon: 'CalendarRange' }
  ];

  return (
    <div className="space-y-4">
      {/* Transaction Type Filters */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Тип транзакции</h3>
        <div className="flex flex-wrap gap-2">
          {filterOptions?.map((filter) => (
            <button
              key={filter?.id}
              onClick={() => onFilterChange('type', filter?.id)}
              className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium poker-transition ${
                activeFilters?.type === filter?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-surface text-muted-foreground hover:text-foreground hover:bg-surface/80'
              }`}
            >
              <Icon name={filter?.icon} size={14} />
              <span>{filter?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Date Range Filters */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Период</h3>
        <div className="flex flex-wrap gap-2">
          {dateRangeOptions?.map((filter) => (
            <button
              key={filter?.id}
              onClick={() => onFilterChange('dateRange', filter?.id)}
              className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium poker-transition ${
                activeFilters?.dateRange === filter?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-surface text-muted-foreground hover:text-foreground hover:bg-surface/80'
              }`}
            >
              <Icon name={filter?.icon} size={14} />
              <span>{filter?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Clear Filters */}
      {(activeFilters?.type !== 'all' || activeFilters?.dateRange !== 'month') && (
        <button
          onClick={() => onFilterChange('clear')}
          className="inline-flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground poker-transition"
        >
          <Icon name="X" size={14} />
          <span>Очистить фильтры</span>
        </button>
      )}
    </div>
  );
};

export default FilterChips;