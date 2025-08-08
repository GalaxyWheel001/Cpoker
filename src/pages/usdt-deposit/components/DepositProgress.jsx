import React from 'react';
import Icon from '../../../components/AppIcon';

const DepositProgress = ({ currentStep = 1, transactionHash, confirmations = 0, requiredConfirmations = 3 }) => {
  const steps = [
    {
      id: 1,
      title: 'Инициация',
      description: 'Транзакция отправлена',
      icon: 'Send'
    },
    {
      id: 2,
      title: 'Подтверждение',
      description: 'Ожидание подтверждений сети',
      icon: 'Clock'
    },
    {
      id: 3,
      title: 'Завершено',
      description: 'Средства зачислены',
      icon: 'CheckCircle'
    }
  ];

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'active';
    return 'pending';
  };

  const getStepIcon = (step, status) => {
    if (status === 'completed') return 'CheckCircle';
    if (status === 'active' && step?.id === 2) return 'Clock';
    return step?.icon;
  };

  const progressPercentage = ((currentStep - 1) / (steps?.length - 1)) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Статус депозита
        </h3>
        <p className="text-sm text-muted-foreground">
          Отслеживайте прогресс вашей транзакции
        </p>
      </div>
      {/* Progress Steps */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-border">
          <div 
            className="h-full bg-primary poker-transition-slow"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative space-y-4">
          {steps?.map((step, index) => {
            const status = getStepStatus(step?.id);
            const iconName = getStepIcon(step, status);
            
            return (
              <div key={step?.id} className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 poker-transition ${
                  status === 'completed' 
                    ? 'bg-success border-success text-success-foreground' 
                    : status === 'active' ?'bg-primary border-primary text-primary-foreground' :'bg-surface border-border text-muted-foreground'
                }`}>
                  <Icon 
                    name={iconName} 
                    size={20} 
                    className={status === 'active' && step?.id === 2 ? 'animate-spin' : ''}
                  />
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${
                    status === 'completed' || status === 'active' 
                      ? 'text-foreground' :'text-muted-foreground'
                  }`}>
                    {step?.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {step?.description}
                  </p>
                  
                  {/* Confirmation Progress for Step 2 */}
                  {step?.id === 2 && status === 'active' && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Подтверждения</span>
                        <span>{confirmations}/{requiredConfirmations}</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-1.5">
                        <div 
                          className="bg-primary h-1.5 rounded-full poker-transition-slow"
                          style={{ width: `${(confirmations / requiredConfirmations) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Transaction Hash */}
      {transactionHash && (
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Хеш транзакции
            </span>
            <button className="text-xs text-primary hover:text-primary/80 poker-transition">
              Посмотреть в блокчейне
            </button>
          </div>
          <p className="font-mono text-xs text-muted-foreground break-all">
            {transactionHash}
          </p>
        </div>
      )}
      {/* Estimated Time */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={16} className="text-primary" />
          <div className="text-sm">
            <span className="font-medium text-primary">
              Примерное время: 
            </span>
            <span className="text-primary/80 ml-1">
              {currentStep === 1 ? '1-2 минуты' : 
               currentStep === 2 ? '3-5 минут': 'Завершено'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositProgress;