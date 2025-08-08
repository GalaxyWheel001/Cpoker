import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import BottomTabBar from '../../components/ui/BottomTabBar';
import ModalOverlay from '../../components/ui/ModalOverlay';
import DepositAmountInput from './components/DepositAmountInput';
import PaymentMethodSelector from './components/PaymentMethodSelector';
import QRCodeGenerator from './components/QRCodeGenerator';
import TransactionFeeBreakdown from './components/TransactionFeeBreakdown';
import DepositProgress from './components/DepositProgress';
import SecurityFeatures from './components/SecurityFeatures';

const USDTDeposit = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [depositAmount, setDepositAmount] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isSecurityVerified, setIsSecurityVerified] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [transactionData, setTransactionData] = useState(null);

  // Mock user data
  const mockUser = {
    id: 1,
    name: "Алексей Петров",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    chipBalance: 25000,
    usdtBalance: 150.50
  };

  // Mock wallet address
  const mockWalletAddress = "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE";

  const steps = [
    { id: 1, title: 'Сумма', component: 'amount' },
    { id: 2, title: 'Способ оплаты', component: 'payment' },
    { id: 3, title: 'Безопасность', component: 'security' },
    { id: 4, title: 'Подтверждение', component: 'confirmation' }
  ];

  const handleAmountChange = (amount) => {
    setDepositAmount(amount);
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleSecurityVerified = (verified) => {
    setIsSecurityVerified(verified);
  };

  const handleNextStep = () => {
    if (currentStep < steps?.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmDeposit = () => {
    // Create transaction data
    const transaction = {
      id: `tx_${Date.now()}`,
      amount: depositAmount,
      method: selectedPaymentMethod,
      walletAddress: mockWalletAddress,
      timestamp: new Date(),
      hash: `0x${Math.random()?.toString(16)?.substr(2, 64)}`
    };
    
    setTransactionData(transaction);
    
    if (selectedPaymentMethod?.id === 'manual') {
      setShowQRModal(true);
    } else {
      setShowProgressModal(true);
      // Simulate transaction processing
      setTimeout(() => {
        setShowProgressModal(false);
        navigate('/transaction-history', { 
          state: { newTransaction: transaction }
        });
      }, 3000);
    }
  };

  const handleQRModalClose = () => {
    setShowQRModal(false);
    setShowProgressModal(true);
    // Simulate transaction processing after QR scan
    setTimeout(() => {
      setShowProgressModal(false);
      navigate('/transaction-history', { 
        state: { newTransaction: transactionData }
      });
    }, 5000);
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return depositAmount >= 10 && depositAmount <= 10000;
      case 2:
        return selectedPaymentMethod !== null;
      case 3:
        return isSecurityVerified;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <DepositAmountInput
            amount={depositAmount}
            onAmountChange={handleAmountChange}
            conversionRate={100}
          />
        );
      case 2:
        return (
          <PaymentMethodSelector
            selectedMethod={selectedPaymentMethod}
            onMethodSelect={handlePaymentMethodSelect}
          />
        );
      case 3:
        return (
          <SecurityFeatures
            onSecurityVerified={handleSecurityVerified}
            requiresTwoFactor={true}
          />
        );
      case 4:
        return (
          <TransactionFeeBreakdown
            amount={depositAmount}
            networkFee={1}
            processingFee={0}
            estimatedTime="2-5"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={mockUser}
        chipBalance={mockUser?.chipBalance}
        usdtBalance={mockUser?.usdtBalance}
        notifications={2}
      />
      <div className="flex-1 pb-20 lg:pb-6 lg:ml-64">
        {/* Header */}
        <div className="sticky top-14 z-30 bg-background/95 backdrop-blur border-b border-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/game-lobby')}
                className="p-2 text-muted-foreground hover:text-foreground poker-transition rounded-lg hover:bg-surface"
              >
                <Icon name="ArrowLeft" size={20} />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  Депозит USDT
                </h1>
                <p className="text-sm text-muted-foreground">
                  Пополнение баланса криптовалютой
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 bg-surface px-3 py-1.5 rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-xs font-medium text-foreground">
                Безопасно
              </span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between mb-2">
              {steps?.map((step, index) => (
                <div key={step?.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 ${
                    step?.id < currentStep 
                      ? 'bg-success border-success text-success-foreground'
                      : step?.id === currentStep
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-surface border-border text-muted-foreground'
                  }`}>
                    {step?.id < currentStep ? (
                      <Icon name="Check" size={16} />
                    ) : (
                      step?.id
                    )}
                  </div>
                  {index < steps?.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      step?.id < currentStep ? 'bg-success' : 'bg-border'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              {steps?.map((step) => (
                <span key={step?.id} className={`${
                  step?.id === currentStep ? 'text-primary font-medium' : ''
                }`}>
                  {step?.title}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 max-w-md mx-auto">
          <div className="space-y-6">
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex space-x-3 pt-4">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  iconName="ArrowLeft"
                  iconPosition="left"
                  className="flex-1"
                >
                  Назад
                </Button>
              )}
              
              {currentStep < steps?.length ? (
                <Button
                  variant="default"
                  onClick={handleNextStep}
                  disabled={!canProceedToNext()}
                  iconName="ArrowRight"
                  iconPosition="right"
                  className="flex-1"
                >
                  Далее
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={handleConfirmDeposit}
                  disabled={!canProceedToNext()}
                  iconName="CreditCard"
                  iconPosition="left"
                  className="flex-1"
                >
                  Подтвердить депозит
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* QR Code Modal */}
      <ModalOverlay
        isOpen={showQRModal}
        onClose={handleQRModalClose}
        title="Отсканируйте QR-код"
        size="default"
      >
        <div className="p-6">
          <QRCodeGenerator
            walletAddress={mockWalletAddress}
            amount={depositAmount}
            onCopyAddress={() => {}}
          />
          
          <div className="mt-6 pt-4 border-t border-border">
            <Button
              variant="default"
              fullWidth
              onClick={handleQRModalClose}
              iconName="Check"
              iconPosition="left"
            >
              Я отправил перевод
            </Button>
          </div>
        </div>
      </ModalOverlay>
      {/* Progress Modal */}
      <ModalOverlay
        isOpen={showProgressModal}
        onClose={() => {}}
        title="Обработка депозита"
        size="default"
        showCloseButton={false}
        closeOnBackdrop={false}
      >
        <div className="p-6">
          <DepositProgress
            currentStep={2}
            transactionHash={transactionData?.hash}
            confirmations={1}
            requiredConfirmations={3}
          />
        </div>
      </ModalOverlay>
      <BottomTabBar />
    </div>
  );
};

export default USDTDeposit;