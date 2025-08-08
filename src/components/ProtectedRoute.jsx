import React from 'react';

// Временная версия для демонстрации на Netlify
// В реальном проекте здесь будет проверка аутентификации
const ProtectedRoute = ({ children }) => {
  // Для демонстрации всегда показываем контент
  // В реальном проекте здесь будет:
  // const { isAuthenticated, isLoading } = useAppSelector(state => state.auth);
  
  return children;
};

export default ProtectedRoute;
