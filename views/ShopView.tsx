import React, { useState } from 'react';
import { INVENTORY } from '../constants';
import { ShoeCard } from '../components/ShoeCard';
import { Shoe } from '../types';
import { X, CheckCircle, MapPin } from 'lucide-react';
import { Button } from '../components/Button';

interface ShopViewProps {
  cart: Shoe[];
  onAddToCart: (shoe: Shoe) => void;
  onRemoveFromCart: (id: string) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({ cart, onAddToCart, onRemoveFromCart }) => {
  const [showBag, setShowBag] = useState(false);

  const toggleBag = () => setShowBag(!showBag);

  return (
    <div className="pb-32 relative">
      <header className="px-6 py-6 sticky top-0 bg-oatmeal z-10 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-charcoal">Inventory</h1>
        <button 
          onClick={toggleBag}
          className="text-sage font-bold text-sm bg-white px-4 py-2 rounded-full shadow-sm"
        >
          Bag ({cart.length})
        </button>
      </header>

      <div className="px-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
        {INVENTORY.map(shoe => (
          <ShoeCard key={shoe.id} shoe={shoe} onAdd={onAddToCart} />
        ))}
      </div>

      {/* Bag Modal Overlay */}
      {showBag && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-charcoal/40 backdrop-blur-sm" onClick={toggleBag}>
          <div 
            className="bg-white w-full max-w-md h-[80vh] rounded-t-4xl sm:rounded-4xl flex flex-col shadow-2xl overflow-hidden" 
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
              <h2 className="text-xl font-bold text-charcoal">Your Bag</h2>
              <button onClick={toggleBag} className="p-2 bg-gray-100 rounded-full">
                <X size={20} className="text-charcoal" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                  <p>Your bag is empty.</p>
                  <p className="text-sm mt-2">Go find some speed.</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex gap-4 p-4 rounded-3xl bg-oatmeal">
                    <img src={item.image} className="w-20 h-20 rounded-xl bg-white object-cover mix-blend-multiply" alt={item.name} />
                    <div className="flex-grow">
                      <h4 className="font-bold text-charcoal">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.brand}</p>
                      <p className="font-semibold mt-1">${item.price}</p>
                    </div>
                    <button onClick={() => onRemoveFromCart(item.id)} className="text-gray-400 self-start">
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 bg-white border-t border-gray-100">
              <div className="bg-sage/10 p-4 rounded-2xl mb-4 flex gap-3 items-start">
                <CheckCircle className="text-sage shrink-0" size={20} />
                <div>
                  <h5 className="text-sm font-bold text-sage">In Stock at Medina</h5>
                  <p className="text-xs text-charcoal/70 mt-1">
                    Items in your bag are available for pickup at 122 Public Square.
                  </p>
                </div>
              </div>
              <Button fullWidth onClick={() => alert("This checks in-store availability!")}>
                Check Availability <MapPin size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
