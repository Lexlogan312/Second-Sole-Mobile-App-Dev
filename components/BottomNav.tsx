import React from 'react';
import { Home, ShoppingBag, Search, Users, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, cartCount }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'shop', icon: ShoppingBag, label: 'Shop', hasBadge: true },
    { id: 'finder', icon: Search, label: 'Finder' },
    { id: 'community', icon: Users, label: 'Community' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 pb-safe pt-2 px-6 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 p-2 relative transition-colors ${
                isActive ? 'text-sage' : 'text-gray-400'
              }`}
            >
              <div className={`relative p-1 rounded-xl transition-all ${isActive ? 'bg-sage/10' : ''}`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {tab.hasBadge && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-charcoal text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
