import React, { useState, useEffect } from 'react';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { FinderView } from './views/FinderView';
import { CommunityView } from './views/CommunityView';
import { ProfileView } from './views/ProfileView';
import { Shoe } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [cart, setCart] = useState<Shoe[]>([]);

  // Simple cart persistence logic for the session
  const addToCart = (shoe: Shoe) => {
    setCart([...cart, shoe]);
    // Optional: visual feedback trigger could go here
  };

  const removeFromCart = (id: string) => {
    const idx = cart.findIndex(c => c.id === id);
    if (idx > -1) {
        const newCart = [...cart];
        newCart.splice(idx, 1);
        setCart(newCart);
    }
  };

  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView setTab={setActiveTab} />;
      case 'shop':
        return <ShopView cart={cart} onAddToCart={addToCart} onRemoveFromCart={removeFromCart} />;
      case 'finder':
        return <FinderView onAddToCart={addToCart} />;
      case 'community':
        return <CommunityView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <HomeView setTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-oatmeal font-sans text-charcoal flex justify-center">
      {/* Mobile Container Simulator */}
      <div className="w-full max-w-md bg-oatmeal min-h-screen relative shadow-2xl">
        <main className="h-full w-full">
          {renderView()}
        </main>
        
        <BottomNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          cartCount={cart.length} 
        />
      </div>
    </div>
  );
};

export default App;
