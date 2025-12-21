import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import InputPage from './pages/InputPage';
import ResultsPage from './pages/ResultsPage';
import ChatPage from './pages/ChatPage';

const App = () => {
  const location = useLocation();

  return (
    <div className="h-full flex flex-col bg-background text-foreground overflow-hidden">
      <Navbar />
      <main className="flex-1 w-full relative overflow-hidden flex flex-col">
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/input" element={<InputPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="*" element={<AuthPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
