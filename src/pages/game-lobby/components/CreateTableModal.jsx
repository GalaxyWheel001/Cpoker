import React, { useState } from 'react';
import ModalOverlay from '../../../components/ui/ModalOverlay';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';


const CreateTableModal = ({ isOpen, onClose, onCreateTable }) => {
  const [formData, setFormData] = useState({
    name: '',
    gameType: 'cash',
    currency: 'chips',
    buyIn: '',
    maxPlayers: 6,
    isPrivate: false,
    password: ''
  });

  const [errors, setErrors] = useState({});

  const gameTypeOptions = [
    { value: 'cash', label: 'Кэш игра' },
    { value: 'tournament', label: 'Турнир' }
  ];

  const currencyOptions = [
    { value: 'chips', label: 'Фишки' },
    { value: 'usdt', label: 'USDT' }
  ];

  const maxPlayersOptions = [
    { value: 2, label: '2 игрока' },
    { value: 4, label: '4 игрока' },
    { value: 6, label: '6 игроков' }
  ];

  const buyInPresets = {
    chips: [1000, 5000, 10000, 25000, 50000],
    usdt: [10, 25, 50, 100, 250]
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Введите название стола';
    }

    if (!formData?.buyIn || formData?.buyIn <= 0) {
      newErrors.buyIn = 'Введите корректную сумму бай-ина';
    }

    if (formData?.isPrivate && !formData?.password?.trim()) {
      newErrors.password = 'Введите пароль для приватного стола';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onCreateTable(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      gameType: 'cash',
      currency: 'chips',
      buyIn: '',
      maxPlayers: 6,
      isPrivate: false,
      password: ''
    });
    setErrors({});
    onClose();
  };

  const handlePresetClick = (amount) => {
    handleInputChange('buyIn', amount);
  };

  return (
    <ModalOverlay
      isOpen={isOpen}
      onClose={handleClose}
      title="Создать стол"
      size="default"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Table Name */}
        <Input
          label="Название стола"
          type="text"
          placeholder="Введите название стола"
          value={formData?.name}
          onChange={(e) => handleInputChange('name', e?.target?.value)}
          error={errors?.name}
          required
        />

        {/* Game Type */}
        <Select
          label="Тип игры"
          options={gameTypeOptions}
          value={formData?.gameType}
          onChange={(value) => handleInputChange('gameType', value)}
        />

        {/* Currency */}
        <Select
          label="Валюта"
          options={currencyOptions}
          value={formData?.currency}
          onChange={(value) => handleInputChange('currency', value)}
        />

        {/* Buy-in Amount */}
        <div className="space-y-3">
          <Input
            label="Бай-ин"
            type="number"
            placeholder={`Введите сумму в ${formData?.currency === 'chips' ? 'фишках' : 'USDT'}`}
            value={formData?.buyIn}
            onChange={(e) => handleInputChange('buyIn', parseFloat(e?.target?.value) || '')}
            error={errors?.buyIn}
            required
          />
          
          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            {buyInPresets?.[formData?.currency]?.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handlePresetClick(amount)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium poker-transition ${
                  formData?.buyIn === amount
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-surface text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {amount?.toLocaleString()} {formData?.currency === 'chips' ? 'фишек' : 'USDT'}
              </button>
            ))}
          </div>
        </div>

        {/* Max Players */}
        <Select
          label="Максимум игроков"
          options={maxPlayersOptions}
          value={formData?.maxPlayers}
          onChange={(value) => handleInputChange('maxPlayers', value)}
        />

        {/* Private Table */}
        <div className="space-y-3">
          <Checkbox
            label="Приватный стол"
            description="Только игроки с паролем смогут присоединиться"
            checked={formData?.isPrivate}
            onChange={(e) => handleInputChange('isPrivate', e?.target?.checked)}
          />

          {formData?.isPrivate && (
            <Input
              label="Пароль"
              type="password"
              placeholder="Введите пароль для стола"
              value={formData?.password}
              onChange={(e) => handleInputChange('password', e?.target?.value)}
              error={errors?.password}
              required
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={handleClose}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            variant="default"
            fullWidth
            iconName="Plus"
            iconPosition="left"
          >
            Создать стол
          </Button>
        </div>
      </form>
    </ModalOverlay>
  );
};

export default CreateTableModal;