import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ChatOverlay = ({ isOpen, onClose, messages = [], onSendMessage, currentUser }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (newMessage?.trim()) {
      onSendMessage(newMessage?.trim());
      setNewMessage('');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const quickMessages = [
    'Удачи!',
    'Хорошая игра',
    'Отличный блеф',
    'Везет же!',
    'Время подумать',
    'Gg wp'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-2 lg:p-4 lg:items-center">
      {/* Фон */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Панель чата */}
      <div className="relative w-full max-w-md bg-background border border-border rounded-t-lg lg:rounded-lg poker-shadow-modal max-h-[85vh] lg:max-h-[80vh] flex flex-col">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-3 lg:p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="MessageCircle" size={18} className="text-primary" />
            <h3 className="font-semibold text-foreground text-sm lg:text-base">Чат игры</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
            className="h-8 w-8 lg:h-10 lg:w-10"
          />
        </div>

        {/* Сообщения */}
        <div className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-2 lg:space-y-3 min-h-0">
          {messages?.length === 0 ? (
            <div className="text-center py-6 lg:py-8">
              <Icon name="MessageCircle" size={40} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Пока сообщений нет</p>
              <p className="text-xs text-muted-foreground mt-1">Начните общение!</p>
            </div>
          ) : (
            messages?.map((message, index) => {
              const isOwnMessage = message?.userId === currentUser?.id;
              return (
                <div
                  key={index}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[85%] ${
                    isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    {/* Аватар */}
                    <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full overflow-hidden border border-border flex-shrink-0">
                      <Image
                        src={message?.avatar}
                        alt={message?.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Пузырь сообщения */}
                    <div className={`rounded-lg p-2 lg:p-3 ${
                      isOwnMessage 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-surface text-foreground'
                    }`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-medium opacity-80">
                          {message?.username}
                        </span>
                        <span className="text-xs opacity-60">
                          {formatTime(message?.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm">{message?.text}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Быстрые сообщения */}
        <div className="px-3 lg:px-4 py-2 border-t border-border">
          <div className="flex flex-wrap gap-1">
            {quickMessages?.map((msg, index) => (
              <button
                key={index}
                onClick={() => onSendMessage(msg)}
                className="px-2 py-1 text-xs bg-surface hover:bg-surface/80 text-foreground rounded border border-border poker-transition"
              >
                {msg}
              </button>
            ))}
          </div>
        </div>

        {/* Поле ввода сообщения */}
        <form onSubmit={handleSendMessage} className="p-3 lg:p-4 border-t border-border">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Введите сообщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e?.target?.value)}
              className="flex-1 text-sm"
              maxLength={200}
            />
            <Button
              type="submit"
              variant="default"
              size="icon"
              disabled={!newMessage?.trim()}
              iconName="Send"
              className="h-10 w-10"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {newMessage?.length}/200 символов
          </p>
        </form>
      </div>
    </div>
  );
};

export default ChatOverlay;