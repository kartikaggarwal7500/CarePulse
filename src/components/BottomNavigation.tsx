import React from 'react';
import {
  Home,
  MessageSquare,
  BookOpen,
  Camera,
  ShieldAlert,
  User
} from 'lucide-react';
import { AppScreen } from '../types';

interface BottomNavigationProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  onOpenSos: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentScreen,
  onNavigate,
  onOpenSos,
}) => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-slate-200 backdrop-blur-md px-2 py-1 shadow-lg transition-colors"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center p-1 rounded-lg transition-colors ${
            currentScreen === 'home'
              ? 'text-cyan-700 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* AI Chat */}
        <button
          onClick={() => onNavigate('chat')}
          className={`flex flex-col items-center justify-center p-1 rounded-lg transition-colors ${
            currentScreen === 'chat'
              ? 'text-cyan-700 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">AI Chat</span>
        </button>

        {/* Center SOS Button */}
        <button
          onClick={onOpenSos}
          className="-mt-4 flex flex-col items-center justify-center"
          aria-label="Trigger Emergency Assistance SOS"
        >
          <div className="w-11 h-11 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md ring-4 ring-white active:scale-95 transition-transform">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black text-red-600 mt-0.5">
            SOS
          </span>
        </button>

        {/* First Aid Library */}
        <button
          onClick={() => onNavigate('library')}
          className={`flex flex-col items-center justify-center p-1 rounded-lg transition-colors ${
            currentScreen === 'library'
              ? 'text-cyan-700 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Library</span>
        </button>

        {/* Hazard Scanner */}
        <button
          onClick={() => onNavigate('scanner')}
          className={`flex flex-col items-center justify-center p-1 rounded-lg transition-colors ${
            currentScreen === 'scanner'
              ? 'text-cyan-700 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Camera className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Scanner</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center justify-center p-1 rounded-lg transition-colors ${
            currentScreen === 'profile'
              ? 'text-cyan-700 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Profile</span>
        </button>
      </div>
    </nav>
  );
};
