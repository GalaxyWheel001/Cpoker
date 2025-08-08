import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const PrivacyControls = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'friends',
    showStats: true,
    allowInvites: true,
    showOnlineStatus: true,
    shareAchievements: true
  });

  const visibilityOptions = [
    { value: 'public', label: 'Публичный - виден всем' },
    { value: 'friends', label: 'Друзья - только контакты Telegram' },
    { value: 'private', label: 'Приватный - только я' }
  ];

  const handlePrivacyChange = (key, value) => {
    setPrivacy(prev => ({
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
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Lock" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Приватность</h3>
            <p className="text-sm text-muted-foreground">Управление видимостью профиля</p>
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
          {/* Profile Visibility */}
          <div>
            <Select
              label="Видимость профиля"
              description="Кто может видеть ваш профиль и статистику"
              options={visibilityOptions}
              value={privacy?.profileVisibility}
              onChange={(value) => handlePrivacyChange('profileVisibility', value)}
            />
          </div>

          {/* Privacy Options */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Настройки отображения</h4>
            <div className="space-y-3">
              <Checkbox
                label="Показывать статистику игр"
                description="Другие игроки смогут видеть ваши результаты"
                checked={privacy?.showStats}
                onChange={(e) => handlePrivacyChange('showStats', e?.target?.checked)}
              />
              <Checkbox
                label="Разрешить приглашения в игру"
                description="Другие игроки смогут приглашать вас за стол"
                checked={privacy?.allowInvites}
                onChange={(e) => handlePrivacyChange('allowInvites', e?.target?.checked)}
              />
              <Checkbox
                label="Показывать статус онлайн"
                description="Отображать когда вы в сети"
                checked={privacy?.showOnlineStatus}
                onChange={(e) => handlePrivacyChange('showOnlineStatus', e?.target?.checked)}
              />
              <Checkbox
                label="Делиться достижениями"
                description="Показывать полученные награды и бейджи"
                checked={privacy?.shareAchievements}
                onChange={(e) => handlePrivacyChange('shareAchievements', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Data Management */}
          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-foreground mb-3">Управление данными</h4>
            <div className="space-y-2">
              <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground poker-transition">
                <Icon name="Download" size={16} />
                <span>Скачать мои данные</span>
              </button>
              <button className="flex items-center space-x-2 text-sm text-destructive hover:text-destructive/80 poker-transition">
                <Icon name="Trash2" size={16} />
                <span>Удалить аккаунт</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyControls;