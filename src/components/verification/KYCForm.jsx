import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppSelector';
import { completeKYC } from '../../store/slices/authSlice';
import { useToast } from '../../contexts/ToastContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Icon from '../AppIcon';

const KYCForm = ({ onComplete }) => {
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useToast();
  const { isLoading } = useAppSelector(state => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    passportNumber: '',
    passportExpiry: '',
    address: {
      street: '',
      city: '',
      country: '',
      postalCode: '',
    },
  });

  const [documents, setDocuments] = useState({
    passportFront: null,
    passportBack: null,
    selfie: null,
    proofOfAddress: null,
  });

  const [step, setStep] = useState(1);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleFileChange = (field, file) => {
    setDocuments(prev => ({
      ...prev,
      [field]: file,
    }));
  };

  const validateStep1 = () => {
    return formData.firstName && formData.lastName && formData.dateOfBirth && formData.nationality;
  };

  const validateStep2 = () => {
    return formData.passportNumber && formData.passportExpiry && 
           formData.address.street && formData.address.city && 
           formData.address.country && formData.address.postalCode;
  };

  const validateStep3 = () => {
    return documents.passportFront && documents.passportBack && 
           documents.selfie && documents.proofOfAddress;
  };

  const handleSubmit = async () => {
    try {
      const kycData = new FormData();
      
      // Добавляем данные формы
      Object.keys(formData).forEach(key => {
        if (typeof formData[key] === 'object') {
          kycData.append(key, JSON.stringify(formData[key]));
        } else {
          kycData.append(key, formData[key]);
        }
      });

      // Добавляем документы
      Object.keys(documents).forEach(key => {
        if (documents[key]) {
          kycData.append(key, documents[key]);
        }
      });

      const result = await dispatch(completeKYC(kycData)).unwrap();
      showSuccess('KYC верификация успешно отправлена на проверку');
      onComplete && onComplete(result);
    } catch (error) {
      showError('Ошибка при отправке KYC: ' + error);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Личные данные</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Имя"
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          placeholder="Введите ваше имя"
          required
        />
        <Input
          label="Фамилия"
          value={formData.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          placeholder="Введите вашу фамилию"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Дата рождения"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          required
        />
        <Input
          label="Гражданство"
          value={formData.nationality}
          onChange={(e) => handleInputChange('nationality', e.target.value)}
          placeholder="Страна гражданства"
          required
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => setStep(2)}
          disabled={!validateStep1()}
          loading={isLoading}
        >
          Далее
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Документы</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Номер паспорта"
          value={formData.passportNumber}
          onChange={(e) => handleInputChange('passportNumber', e.target.value)}
          placeholder="Номер паспорта"
          required
        />
        <Input
          label="Срок действия паспорта"
          type="date"
          value={formData.passportExpiry}
          onChange={(e) => handleInputChange('passportExpiry', e.target.value)}
          required
        />
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Адрес проживания</h4>
        <Input
          label="Улица"
          value={formData.address.street}
          onChange={(e) => handleInputChange('address.street', e.target.value)}
          placeholder="Улица и номер дома"
          required
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Город"
            value={formData.address.city}
            onChange={(e) => handleInputChange('address.city', e.target.value)}
            placeholder="Город"
            required
          />
          <Input
            label="Страна"
            value={formData.address.country}
            onChange={(e) => handleInputChange('address.country', e.target.value)}
            placeholder="Страна"
            required
          />
          <Input
            label="Почтовый индекс"
            value={formData.address.postalCode}
            onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
            placeholder="Почтовый индекс"
            required
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(1)}
        >
          Назад
        </Button>
        <Button
          onClick={() => setStep(3)}
          disabled={!validateStep2()}
          loading={isLoading}
        >
          Далее
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Загрузка документов</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Лицевая сторона паспорта *
          </label>
          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange('passportFront', e.target.files[0])}
              className="hidden"
              id="passportFront"
            />
            <label htmlFor="passportFront" className="cursor-pointer">
              <Icon name="Upload" size={24} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {documents.passportFront ? documents.passportFront.name : 'Загрузить фото'}
              </p>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Обратная сторона паспорта *
          </label>
          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange('passportBack', e.target.files[0])}
              className="hidden"
              id="passportBack"
            />
            <label htmlFor="passportBack" className="cursor-pointer">
              <Icon name="Upload" size={24} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {documents.passportBack ? documents.passportBack.name : 'Загрузить фото'}
              </p>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Фото с паспортом (селфи) *
          </label>
          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange('selfie', e.target.files[0])}
              className="hidden"
              id="selfie"
            />
            <label htmlFor="selfie" className="cursor-pointer">
              <Icon name="Camera" size={24} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {documents.selfie ? documents.selfie.name : 'Загрузить селфи'}
              </p>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Подтверждение адреса *
          </label>
          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileChange('proofOfAddress', e.target.files[0])}
              className="hidden"
              id="proofOfAddress"
            />
            <label htmlFor="proofOfAddress" className="cursor-pointer">
              <Icon name="FileText" size={24} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {documents.proofOfAddress ? documents.proofOfAddress.name : 'Загрузить документ'}
              </p>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-medium text-foreground mb-2">Требования к документам:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Все документы должны быть четкими и читаемыми</li>
          <li>• Фото должны быть в формате JPG, PNG или PDF</li>
          <li>• Размер файла не более 10MB</li>
          <li>• Паспорт должен быть действительным</li>
        </ul>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(2)}
        >
          Назад
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!validateStep3()}
          loading={isLoading}
        >
          Отправить на проверку
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-lg border border-border">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">KYC Верификация</h2>
        <p className="text-muted-foreground">
          Для обеспечения безопасности и соответствия требованиям, необходимо пройти верификацию личности
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  step > stepNumber ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
};

export default KYCForm;
