import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExportButton = ({ transactions, onExport }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const exportOptions = [
    { id: 'csv', label: 'CSV файл', icon: 'FileText' },
    { id: 'pdf', label: 'PDF отчет', icon: 'FileDown' },
    { id: 'excel', label: 'Excel таблица', icon: 'Sheet' }
  ];

  const handleExport = async (format) => {
    setIsExporting(true);
    setShowOptions(false);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onExport) {
        onExport(format, transactions);
      }
      
      // Create mock download
      const filename = `transaction-history-${new Date()?.toISOString()?.split('T')?.[0]}.${format}`;
      console.log(`Экспорт завершен: ${filename}`);
      
    } catch (error) {
      console.error('Ошибка экспорта:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setShowOptions(!showOptions)}
        disabled={isExporting || transactions?.length === 0}
        loading={isExporting}
        iconName="Download"
        iconPosition="left"
        className="relative"
      >
        {isExporting ? 'Экспорт...' : 'Экспорт'}
      </Button>
      {showOptions && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowOptions(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-48 bg-popover border border-border rounded-lg poker-shadow-modal z-50">
            <div className="p-2">
              <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border">
                Выберите формат
              </div>
              {exportOptions?.map((option) => (
                <button
                  key={option?.id}
                  onClick={() => handleExport(option?.id)}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-surface rounded-lg poker-transition"
                >
                  <Icon name={option?.icon} size={16} />
                  <span>{option?.label}</span>
                </button>
              ))}
            </div>
            
            <div className="p-2 border-t border-border">
              <div className="px-3 py-2 text-xs text-muted-foreground">
                Будет экспортировано {transactions?.length} транзакций
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButton;