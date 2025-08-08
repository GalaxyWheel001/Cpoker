import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setUser } from '../../store/slices/authSlice';

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const mockUser = {
      id: Date.now(),
      name: name || email.split('@')[0] || 'User',
      email,
      avatar: '',
    };
    localStorage.setItem('token', 'mock-token');
    dispatch(setUser(mockUser));
    navigate('/', { replace: true });
  };

  const goToLogin = () => navigate('/login');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card border border-border rounded-xl p-6 space-y-4">
        <h1 className="text-xl font-semibold text-foreground">Регистрация</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя"
          />
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
          <Button type="submit" className="w-full">
            Создать аккаунт
          </Button>
        </form>
        <div className="text-sm text-muted-foreground text-center">
          Уже есть аккаунт?{' '}
          <button onClick={goToLogin} className="underline text-foreground">Войти</button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
