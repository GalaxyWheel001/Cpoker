import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
import NotFound from "pages/NotFound";
import PokerTableGame from './pages/poker-table-game';
import GameLobby from './pages/game-lobby';
import UserProfileManagement from './pages/user-profile-management';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <GameLobby />
            </ProtectedRoute>
          } />
          <Route path="/game-lobby" element={
            <ProtectedRoute>
              <GameLobby />
            </ProtectedRoute>
          } />
          <Route path="/poker-table-game" element={
            <ProtectedRoute>
              <PokerTableGame />
            </ProtectedRoute>
          } />
          <Route path="/user-profile-management" element={
            <ProtectedRoute>
              <UserProfileManagement />
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
