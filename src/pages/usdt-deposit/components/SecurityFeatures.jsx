import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SecurityFeatures = ({ onSecurityVerified, requiresTwoFactor = true }) => {
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerifyTwoFactor = async () => {
    setIsVerifying(true);
    
    // Mock verification - in real app, this would call an API
    setTimeout(() => {
      if (twoFactorCode === '123456') {
        setIsVerified(true);
        onSecurityVerified?.(true);
      } else {
        alert('Неверный код. Попробуйте: 123456');
      }
      setIsVerifying(false);
    }, 1500);
  };

  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'SSL Шифрование',
      description: 'Все данные защищены 256-битным шифрованием',
      status: 'active'
    },
    {
      icon: 'Lock',
      title: 'Двухфакторная аутентификация',
      description: 'Дополнительный уровень защиты вашего аккаунта',
      status: isVerified ? 'verified' : 'pending'
    },
    {
      icon: 'Eye',
      title: 'Мониторинг транзакций',
      description: 'Автоматическое обнаружение подозрительной активности',
      status: 'active'
    },
    {
      icon: 'Database',
      title: 'Холодное хранение',
      description: 'Средства хранятся в офлайн кошельках',
      status: 'active'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Security Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <Icon name="Shield" size={32} className="text-success" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Безопасность депозита
        </h3>
        <p className="text-sm text-muted-foreground">
          Ваши средства защищены многоуровневой системой безопасности
        </p>
      </div>
      {/* Security Features List */}
      <div className="space-y-3">
        {securityFeatures?.map((feature, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-surface/50 border border-border rounded-lg">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              feature?.status === 'verified' ? 'bg-success text-success-foreground' :
              feature?.status === 'active' ? 'bg-primary text-primary-foreground' :
              'bg-surface text-muted-foreground'
            }`}>
              <Icon 
                name={feature?.status === 'verified' ? 'CheckCircle' : feature?.icon} 
                size={20} 
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground text-sm">
                {feature?.title}
              </h4>
              <p className="text-xs text-muted-foreground">
                {feature?.description}
              </p>
            </div>
            <div className={`w-2 h-2 rounded-full ${
              feature?.status === 'verified' ? 'bg-success' :
              feature?.status === 'active'? 'bg-primary' : 'bg-muted-foreground'
            }`} />
          </div>
        ))}
      </div>
      {/* Two-Factor Authentication */}
      {requiresTwoFactor && !isVerified && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-start space-x-3 mb-4">
            <Icon name="Lock" size={20} className="text-warning mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-warning mb-1">
                Требуется двухфакторная аутентификация
              </h4>
              <p className="text-sm text-warning/80">
                Введите код из приложения аутентификатора для продолжения
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Введите 6-значный код"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e?.target?.value)}
              maxLength={6}
              className="text-center font-mono text-lg"
            />
            
            <Button
              variant="outline"
              fullWidth
              onClick={handleVerifyTwoFactor}
              disabled={twoFactorCode?.length !== 6 || isVerifying}
              loading={isVerifying}
            >
              Подтвердить код
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Не получили код? 
              <button className="text-primary hover:text-primary/80 ml-1">
                Отправить повторно
              </button>
            </p>
          </div>
        </div>
      )}
      {/* Verification Success */}
      {isVerified && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <div>
              <h4 className="font-medium text-success mb-1">
                Безопасность подтверждена
              </h4>
              <p className="text-sm text-success/80">
                Вы можете безопасно продолжить депозит
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface/50 border border-border rounded-lg p-3 text-center">
          <Icon name="Award" size={24} className="text-primary mx-auto mb-2" />
          <p className="text-xs font-medium text-foreground">Лицензировано</p>
          <p className="text-xs text-muted-foreground">Curacao Gaming</p>
        </div>
        <div className="bg-surface/50 border border-border rounded-lg p-3 text-center">
          <Icon name="Users" size={24} className="text-accent mx-auto mb-2" />
          <p className="text-xs font-medium text-foreground">Telegram</p>
          <p className="text-xs text-muted-foreground">Интеграция</p>
        </div>
      </div>
    </div>
  );
};

export default SecurityFeatures;