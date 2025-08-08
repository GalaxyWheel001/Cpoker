import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const GamePreferences = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [preferences, setPreferences] = useState({
    defaultStakes: 'medium',
    autoFold: false,
    autoCheck: false,
    soundEnabled: true,
    vibrationEnabled: true,
    showAnimations: true
  });

  const stakesOptions = [
    { value: 'low', label: 'Низкие ставки (1-10 USDT)' },
    { value: 'medium', label: 'Средние ставки (10-100 USDT)' },
    { value: 'high', label: 'Высокие ставки (100+ USDT)' }
  ];

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="bg-surface rounded-lg poker-shadow-interactive overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/5 poker-transition"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Settings" size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Настройки игры</h3>
            <p className="text-sm text-muted-foreground">Предпочтения и автодействия</p>
          </div>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-muted-foreground" 
        />
      </button>
      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-border">
          {/* Default Stakes */}
          <div>
            <Select
              label="Предпочитаемые ставки"
              description="Столы с этими лимитами будут показаны первыми"
              options={stakesOptions}
              value={preferences?.defaultStakes}
              onChange={(value) => handlePreferenceChange('defaultStakes', value)}
            />
          </div>

          {/* Auto Actions */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Автодействия</h4>
            <div className="space-y-3">
              <Checkbox
                label="Автоматический фолд со слабой рукой"
                description="Автоматически сбрасывать карты при очень слабой руке"
                checked={preferences?.autoFold}
                onChange={(e) => handlePreferenceChange('autoFold', e?.target?.checked)}
              />
              <Checkbox
                label="Автоматический чек"
                description="Автоматически делать чек когда это возможно"
                checked={preferences?.autoCheck}
                onChange={(e) => handlePreferenceChange('autoCheck', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Interface Settings */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Интерфейс</h4>
            <div className="space-y-3">
              <Checkbox
                label="Звуковые эффекты"
                description="Воспроизводить звуки игры"
                checked={preferences?.soundEnabled}
                onChange={(e) => handlePreferenceChange('soundEnabled', e?.target?.checked)}
              />
              <Checkbox
                label="Вибрация"
                description="Вибрация при важных событиях"
                checked={preferences?.vibrationEnabled}
                onChange={(e) => handlePreferenceChange('vibrationEnabled', e?.target?.checked)}
              />
              <Checkbox
                label="Анимации"
                description="Показывать анимации карт и фишек"
                checked={preferences?.showAnimations}
                onChange={(e) => handlePreferenceChange('showAnimations', e?.target?.checked)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePreferences;