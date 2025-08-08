import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setUser } from '../../store/slices/authSlice';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(state => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Простая локальная авторизация без бэкенда
    const mockUser = {
      id: Date.now(),
      name: email.split('@')[0] || 'User',
      email,
      avatar: '',
    };
    localStorage.setItem('token', 'mock-token');
    dispatch(setUser(mockUser));
    const redirectTo = location.state?.from?.pathname || '/';
    navigate(redirectTo, { replace: true });
  };

  const goToRegister = () => navigate('/register');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card border border-border rounded-xl p-6 space-y-4">
        <h1 className="text-xl font-semibold text-foreground">Вход</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
          <Input
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
          <Button type="submit" className="w-full" loading={isLoading}>
            Войти
          </Button>
        </form>
        <div className="text-sm text-muted-foreground text-center">
          Нет аккаунта?{' '}
          <button onClick={goToRegister} className="underline text-foreground">Зарегистрироваться</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
