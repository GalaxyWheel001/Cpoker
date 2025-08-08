import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
import NotFound from "pages/NotFound";
import PokerTableGame from './pages/poker-table-game';
import USDTDeposit from './pages/usdt-deposit';
import TransactionHistory from './pages/transaction-history';
import GameLobby from './pages/game-lobby';
import UserProfileManagement from './pages/user-profile-management';
import TelegramAuthentication from './pages/telegram-authentication';
import TournamentsPage from './pages/tournaments';
import DesignShowcase from './pages/design-showcase';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public routes */}
          <Route path="/telegram-authentication" element={<TelegramAuthentication />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <GameLobby />
            </ProtectedRoute>
          } />
          <Route path="/poker-table-game" element={
            <ProtectedRoute>
              <PokerTableGame />
            </ProtectedRoute>
          } />
          <Route path="/usdt-deposit" element={
            <ProtectedRoute>
              <USDTDeposit />
            </ProtectedRoute>
          } />
          <Route path="/transaction-history" element={
            <ProtectedRoute>
              <TransactionHistory />
            </ProtectedRoute>
          } />
          <Route path="/game-lobby" element={
            <ProtectedRoute>
              <GameLobby />
            </ProtectedRoute>
          } />
          <Route path="/user-profile-management" element={
            <ProtectedRoute>
              <UserProfileManagement />
            </ProtectedRoute>
          } />
          <Route path="/tournaments" element={
            <ProtectedRoute>
              <TournamentsPage />
            </ProtectedRoute>
          } />
          <Route path="/design-showcase" element={
            <ProtectedRoute>
              <DesignShowcase />
            </ProtectedRoute>
          } />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
