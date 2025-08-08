import React from 'react';
import { cn } from '../../utils/cn';
import Icon from '../AppIcon';

const Table = React.forwardRef(({
  className,
  children,
  variant = 'default', // 'default', 'glass', 'minimal'
  ...props
}, ref) => {
  const variants = {
    default: "w-full caption-bottom text-sm",
    glass: "w-full caption-bottom text-sm glass rounded-xl overflow-hidden",
    minimal: "w-full caption-bottom text-sm border border-border rounded-xl overflow-hidden",
  };

  return (
    <div className="w-full overflow-auto">
      <table
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
});

Table.displayName = "Table";

const TableHeader = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <thead
    ref={ref}
    className={cn("[&_tr]:border-b", className)}
    {...props}
  >
    {children}
  </thead>
));

TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  >
    {children}
  </tbody>
));

TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <tfoot
    ref={ref}
    className={cn("bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
    {...props}
  >
    {children}
  </tfoot>
));

TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef(({
  className,
  children,
  hover = true,
  selected = false,
  animated = false,
  ...props
}, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      hover && "hover:bg-muted/30",
      selected && "bg-muted/50",
      animated && "animate-pulse",
      className
    )}
    {...props}
  >
    {children}
  </tr>
));

TableRow.displayName = "TableRow";

const TableHead = React.forwardRef(({
  className,
  children,
  sortable = false,
  sortDirection = null, // 'asc', 'desc', null
  onSort,
  ...props
}, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      sortable && "cursor-pointer select-none hover:text-foreground",
      className
    )}
    onClick={sortable ? onSort : undefined}
    {...props}
  >
    <div className="flex items-center gap-2">
      {children}
      {sortable && (
        <div className="flex flex-col">
          <Icon
            name="chevron-up"
            size={12}
            className={cn(
              "transition-colors",
              sortDirection === 'asc' ? "text-foreground" : "text-muted-foreground"
            )}
          />
          <Icon
            name="chevron-down"
            size={12}
            className={cn(
              "transition-colors -mt-1",
              sortDirection === 'desc' ? "text-foreground" : "text-muted-foreground"
            )}
          />
        </div>
      )}
    </div>
  </th>
));

TableHead.displayName = "TableHead";

const TableCell = React.forwardRef(({
  className,
  children,
  variant = 'default', // 'default', 'actions', 'status', 'amount'
  ...props
}, ref) => {
  const variants = {
    default: "",
    actions: "w-[1%] whitespace-nowrap",
    status: "w-[1%] whitespace-nowrap",
    amount: "text-right font-mono",
  };

  return (
    <td
      ref={ref}
      className={cn(
        "p-4 align-middle [&:has([role=checkbox])]:pr-0",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
});

TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  >
    {children}
  </caption>
));

TableCaption.displayName = "TableCaption";

// Enhanced Table with built-in sorting and pagination
const EnhancedTable = React.forwardRef(({
  className,
  data = [],
  columns = [],
  sortable = true,
  pagination = false,
  pageSize = 10,
  searchable = false,
  loading = false,
  emptyMessage = "Нет данных для отображения",
  ...props
}, ref) => {
  const [sortConfig, setSortConfig] = React.useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = React.useMemo(() => {
    let filtered = data;
    
    if (searchable && searchQuery) {
      filtered = data.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    
    if (sortable && sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return filtered;
  }, [data, sortConfig, searchQuery, sortable, searchable]);

  const paginatedData = React.useMemo(() => {
    if (!pagination) return filteredData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  return (
    <div ref={ref} className={cn("space-y-4", className)} {...props}>
      {searchable && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Icon name="search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                sortable={sortable && column.sortable !== false}
                sortDirection={sortConfig.key === column.key ? sortConfig.direction : null}
                onSort={() => handleSort(column.key)}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span>Загрузка...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : paginatedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.key} variant={column.variant}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Показано {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, filteredData.length)} из {filteredData.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-input rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Назад
            </button>
            <span className="text-sm">
              {currentPage} из {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-input rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Вперед
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

EnhancedTable.displayName = "EnhancedTable";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  EnhancedTable,
};
