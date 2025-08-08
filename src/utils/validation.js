// Валидация email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Валидация суммы депозита
export const validateDepositAmount = (amount, min = 10, max = 10000) => {
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return 'Введите корректную сумму';
  if (numAmount < min) return `Минимальная сумма: ${min} USDT`;
  if (numAmount > max) return `Максимальная сумма: ${max} USDT`;
  return null;
};

// Валидация имени стола
export const validateTableName = (name) => {
  if (!name || name.trim().length === 0) return 'Введите название стола';
  if (name.length < 3) return 'Название должно содержать минимум 3 символа';
  if (name.length > 50) return 'Название не должно превышать 50 символов';
  return null;
};

// Валидация бай-ина
export const validateBuyIn = (buyIn, currency = 'chips') => {
  const numBuyIn = parseInt(buyIn);
  if (isNaN(numBuyIn)) return 'Введите корректную сумму бай-ина';
  
  if (currency === 'chips') {
    if (numBuyIn < 1000) return 'Минимальный бай-ин: 1,000 фишек';
    if (numBuyIn > 1000000) return 'Максимальный бай-ин: 1,000,000 фишек';
  } else {
    if (numBuyIn < 10) return 'Минимальный бай-ин: 10 USDT';
    if (numBuyIn > 1000) return 'Максимальный бай-ин: 1,000 USDT';
  }
  
  return null;
};

// Валидация количества игроков
export const validateMaxPlayers = (maxPlayers) => {
  const numPlayers = parseInt(maxPlayers);
  if (isNaN(numPlayers)) return 'Введите корректное количество игроков';
  if (numPlayers < 2) return 'Минимум 2 игрока';
  if (numPlayers > 9) return 'Максимум 9 игроков';
  return null;
};

// Валидация сообщения чата
export const validateChatMessage = (message) => {
  if (!message || message.trim().length === 0) return 'Введите сообщение';
  if (message.length > 200) return 'Сообщение не должно превышать 200 символов';
  return null;
};

// Валидация ставки
export const validateBet = (bet, minBet, maxBet, playerStack) => {
  const numBet = parseInt(bet);
  if (isNaN(numBet)) return 'Введите корректную сумму ставки';
  if (numBet < minBet) return `Минимальная ставка: ${minBet}`;
  if (numBet > maxBet) return `Максимальная ставка: ${maxBet}`;
  if (numBet > playerStack) return 'Недостаточно фишек';
  return null;
};

// Форматирование суммы
export const formatAmount = (amount, currency = 'chips') => {
  if (currency === 'usdt') {
    return `${parseFloat(amount).toFixed(2)} USDT`;
  }
  
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`;
  }
  return amount.toLocaleString();
};

// Валидация Telegram данных
export const validateTelegramData = (data) => {
  if (!data.id) return 'Не удалось получить ID пользователя';
  if (!data.first_name) return 'Не удалось получить имя пользователя';
  if (!data.hash) return 'Не удалось получить хеш для проверки';
  return null;
};
