import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QRCodeGenerator = ({ walletAddress, amount, onCopyAddress }) => {
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    // Generate QR code URL using a QR code service
    const qrData = `ethereum:${walletAddress}?value=${amount}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
    setQrCodeUrl(qrUrl);
  }, [walletAddress, amount]);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard?.writeText(walletAddress);
      setCopied(true);
      onCopyAddress?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* QR Code */}
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-white p-4 rounded-lg">
          <div className="w-48 h-48 flex items-center justify-center">
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="QR код для депозита"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <Icon name="QrCode" size={48} className="text-gray-400" />
              </div>
            )}
            <div className="w-full h-full bg-gray-100 hidden items-center justify-center">
              <Icon name="QrCode" size={48} className="text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm font-medium text-foreground mb-1">
            Отсканируйте QR-код
          </p>
          <p className="text-xs text-muted-foreground">
            Используйте камеру вашего кошелька
          </p>
        </div>
      </div>

      {/* Wallet Address */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Адрес кошелька
          </label>
          <div className="flex items-center space-x-1 text-xs text-primary">
            <Icon name="Shield" size={12} />
            <span>Проверено</span>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-lg p-3">
          <div className="flex items-center justify-between space-x-3">
            <div className="flex-1 min-w-0">
              <p className="font-mono text-sm text-foreground break-all">
                {walletAddress}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyAddress}
              iconName={copied ? "Check" : "Copy"}
              iconSize={16}
            >
              {copied ? 'Скопировано' : 'Копировать'}
            </Button>
          </div>
        </div>

        <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5 flex-shrink-0" />
            <div className="text-xs text-warning">
              <p className="font-medium mb-1">Важно!</p>
              <p>Отправляйте только USDT (TRC-20) на этот адрес. Другие токены будут потеряны.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Network Info */}
      <div className="bg-surface/50 border border-border rounded-lg p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Сеть:</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="font-medium text-foreground">Tron (TRC-20)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;