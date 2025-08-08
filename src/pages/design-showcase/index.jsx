import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import BottomTabBar from '../../components/ui/BottomTabBar';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge, StatusBadge, NotificationBadge } from '../../components/ui/Badge';
import { Progress, CircularProgress } from '../../components/ui/Progress';
import { Avatar, AvatarGroup } from '../../components/ui/Avatar';
import { Modal, ConfirmationModal } from '../../components/ui/Modal';
import StatCard from '../../components/ui/StatCard';
import TableCard from '../../components/ui/TableCard';
import UserStats from '../../components/ui/UserStats';
import TournamentCard from '../../components/ui/TournamentCard';
import Icon from '../../components/AppIcon';

const DesignShowcase = () => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Mock data
  const mockUser = {
    id: 1,
    name: "Алексей Петров",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    level: 25,
    experience: 7500,
    experienceToNext: 10000,
    balance: { chips: 125000, usdt: 450.75 },
    stats: {
      gamesPlayed: 1250,
      gamesWon: 450,
      winRate: 36.0,
      totalWinnings: 2500.50,
    },
    achievements: [
      { name: "Первая победа", points: 100, icon: "trophy" },
      { name: "Серия побед", points: 250, icon: "zap" },
      { name: "Высокие ставки", points: 500, icon: "dollar-sign" },
      { name: "Турнирный игрок", points: 300, icon: "award" },
      { name: "Социальный", points: 150, icon: "users" },
      { name: "Долгожитель", points: 400, icon: "clock" },
    ],
    rank: 15,
    status: 'online',
  };

  const mockTable = {
    id: 1,
    name: "Высокие ставки",
    gameType: "Кэш игра",
    currency: "usdt",
    buyIn: 100,
    currentPlayers: 4,
    maxPlayers: 6,
    status: "active",
    pot: 250,
    isRecommended: true,
    players: [
      { id: 1, name: "Игрок 1", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", status: 'online' },
      { id: 2, name: "Игрок 2", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face", status: 'playing' },
      { id: 3, name: "Игрок 3", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", status: 'online' },
      { id: 4, name: "Игрок 4", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", status: 'away' },
    ],
    blinds: { small: 1, big: 2 },
    timeBank: "30 сек",
    avgStack: 150,
  };

  const mockTournament = {
    id: 1,
    name: "Воскресный турнир",
    type: "scheduled",
    status: "registering",
    buyIn: 25,
    prizePool: 5000,
    guaranteedPrize: 7500,
    maxPlayers: 200,
    currentPlayers: 45,
    registeredPlayers: 156,
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
    blindStructure: "15 мин",
    isGuaranteed: true,
    isBounty: false,
    prizes: [2500, 1500, 1000],
    features: ["Гарантированный", "Быстрый"],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Демо дизайна" showBack />
      
      <div className="container-responsive py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-4xl font-bold text-gradient mb-4">
              Современный дизайн покер-рума
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Изучите все улучшения дизайна и визуальные эффекты
            </p>
          </motion.div>

          {/* Buttons Section */}
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Кнопки</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="default">Обычная</Button>
              <Button variant="gradient">Градиент</Button>
              <Button variant="glass">Стекло</Button>
              <Button variant="glow">Свечение</Button>
              <Button variant="success">Успех</Button>
              <Button variant="warning">Предупреждение</Button>
              <Button variant="danger">Опасность</Button>
              <Button variant="outline">Контур</Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button size="sm" variant="gradient">Маленькая</Button>
              <Button size="default" variant="gradient">Обычная</Button>
              <Button size="lg" variant="gradient">Большая</Button>
              <Button size="xl" variant="gradient">Очень большая</Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button variant="gradient" iconName="play" iconPosition="left">
                С иконкой
              </Button>
              <Button variant="gradient" loading>
                Загрузка
              </Button>
              <Button variant="gradient" shimmer>
                Блеск
              </Button>
            </div>
          </motion.section>

          {/* Cards Section */}
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Карточки</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card variant="default" className="hover-lift">
                <CardHeader>
                  <CardTitle>Обычная карточка</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Карточка с современными эффектами и анимациями.
                  </p>
                </CardContent>
              </Card>

              <Card variant="glass" className="hover-lift">
                <CardHeader>
                  <CardTitle>Стеклянная карточка</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Эффект размытия и прозрачности.
                  </p>
                </CardContent>
              </Card>

              <Card variant="default" glow className="hover-lift">
                <CardHeader>
                  <CardTitle>Светящаяся карточка</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Карточка с эффектом свечения.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.section>

          {/* Badges Section */}
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Бейджи</h2>
            <div className="flex flex-wrap gap-4">
              <Badge variant="default">Обычный</Badge>
              <Badge variant="secondary">Вторичный</Badge>
              <Badge variant="success">Успех</Badge>
              <Badge variant="warning">Предупреждение</Badge>
              <Badge variant="destructive">Ошибка</Badge>
              <Badge variant="gradient">Градиент</Badge>
              <Badge variant="glow">Свечение</Badge>
              <Badge variant="outline">Контур</Badge>
            </div>

            <div className="flex flex-wrap gap-4">
              <StatusBadge status="online" />
              <StatusBadge status="offline" />
              <StatusBadge status="away" />
              <StatusBadge status="busy" />
              <StatusBadge status="playing" />
            </div>

            <div className="flex flex-wrap gap-4">
              <NotificationBadge count={5} />
              <NotificationBadge count={99} />
              <NotificationBadge count={150} />
            </div>
          </motion.section>

          {/* Progress Section */}
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Прогресс</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Progress value={75} max={100} variant="default" showLabel />
                <Progress value={60} max={100} variant="gradient" showLabel />
                <Progress value={45} max={100} variant="glow" showLabel />
                <Progress value={30} max={100} variant="animated" showLabel />
              </div>
              <div className="flex justify-center">
                <CircularProgress value={75} size={120} />
              </div>
            </div>
          </motion.section>

          {/* Avatars Section */}
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Аватары</h2>
            <div className="flex flex-wrap items-center gap-6">
              <Avatar
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                alt="User"
                status="online"
                size="xl"
                ring
              />
              <Avatar
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                alt="User"
                status="playing"
                size="lg"
              />
              <Avatar
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
                alt="User"
                status="away"
                size="default"
              />
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <AvatarGroup max={5}>
                <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="User 1" />
                <Avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" alt="User 2" />
                <Avatar src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" alt="User 3" />
                <Avatar src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" alt="User 4" />
                <Avatar src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" alt="User 5" />
                <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="User 6" />
              </AvatarGroup>
            </div>
          </motion.section>

          {/* Stats Cards Section */}
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Статистика</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Игр сыграно"
                value="1,250"
                change="+12%"
                changeType="positive"
                icon="gamepad-2"
                iconColor="primary"
              />
              <StatCard
                title="Побед"
                value="450"
                change="+8%"
                changeType="positive"
                icon="trophy"
                iconColor="success"
              />
              <StatCard
                title="Винрейт"
                value="36.0%"
                change="-2%"
                changeType="negative"
                icon="trending-up"
                iconColor="accent"
              />
              <StatCard
                title="Выигрыш"
                value="2,500 USDT"
                change="+15%"
                changeType="positive"
                icon="dollar-sign"
                iconColor="warning"
              />
            </div>
          </motion.section>

          {/* Table Cards Section */}
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Карточки столов</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TableCard table={mockTable} />
              <TableCard table={{ ...mockTable, id: 2, name: "Новички", status: "waiting", isRecommended: false }} />
              <TableCard table={{ ...mockTable, id: 3, name: "Премиум", variant: "premium" }} />
            </div>
          </motion.section>

          {/* User Stats Section */}
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Статистика пользователя</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UserStats user={mockUser} />
              <UserStats user={{ ...mockUser, name: "Мария Сидорова" }} variant="glass" />
            </div>
          </motion.section>

          {/* Tournament Cards Section */}
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Турниры</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TournamentCard tournament={mockTournament} />
              <TournamentCard tournament={{ ...mockTournament, id: 2, name: "Sit & Go", type: "sit-and-go", status: "active" }} />
              <TournamentCard tournament={{ ...mockTournament, id: 3, name: "Банни турнир", type: "bounty", isBounty: true, bountyAmount: 10 }} />
            </div>
          </motion.section>

          {/* Modals Section */}
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Модальные окна</h2>
            <div className="flex gap-4">
              <Button variant="gradient" onClick={() => setShowModal(true)}>
                Открыть модал
              </Button>
              <Button variant="destructive" onClick={() => setShowConfirmModal(true)}>
                Подтверждение
              </Button>
            </div>
          </motion.section>

          {/* Animations Section */}
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Анимации</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-xl bg-card border border-border float">
                <Icon name="heart" size={32} className="text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Плавающая анимация</h3>
                <p className="text-sm text-muted-foreground">
                  Элемент плавно движется вверх и вниз
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-card border border-border pulse-glow">
                <Icon name="zap" size={32} className="text-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Пульсирующее свечение</h3>
                <p className="text-sm text-muted-foreground">
                  Эффект пульсирующего свечения
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-card border border-border shimmer">
                <Icon name="sparkles" size={32} className="text-warning mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Эффект блеска</h3>
                <p className="text-sm text-muted-foreground">
                  Анимация блеска по поверхности
                </p>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>

      <BottomTabBar />

      {/* Modals */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Демо модал"
        description="Это демонстрационное модальное окно с современными эффектами"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Модальное окно с анимациями появления и исчезновения, 
            размытием фона и современным дизайном.
          </p>
          <div className="flex gap-2">
            <Button variant="gradient" onClick={() => setShowModal(false)}>
              Закрыть
            </Button>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Отмена
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => setShowConfirmModal(false)}
        title="Подтверждение действия"
        message="Вы уверены, что хотите выполнить это действие? Это действие нельзя отменить."
        confirmText="Подтвердить"
        cancelText="Отмена"
        variant="destructive"
      />
    </div>
  );
};

export default DesignShowcase;
