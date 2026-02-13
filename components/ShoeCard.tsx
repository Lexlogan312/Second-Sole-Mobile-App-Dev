import React from 'react';
import { Plus } from 'lucide-react';
import { Shoe } from '../types';

interface ShoeCardProps {
  shoe: Shoe;
  matchScore?: number;
  onAdd: (shoe: Shoe) => void;
}

export const ShoeCard: React.FC<ShoeCardProps> = ({ shoe, matchScore, onAdd }) => {
  return (
    <div className="bg-white rounded-4xl p-4 shadow-sm flex flex-col h-full relative group">
      {shoe.staffPick && (
        <div className="absolute top-4 left-4 bg-sage text-white text-xs font-bold px-2 py-1 rounded-lg z-10 shadow-sm">
          Staff Pick
        </div>
      )}
      
      {matchScore && (
        <div className="absolute top-4 right-4 bg-charcoal text-white text-xs font-bold px-2 py-1 rounded-lg z-10 shadow-sm">
          {matchScore}% Match
        </div>
      )}

      <div className="relative aspect-square mb-4 rounded-3xl overflow-hidden bg-oatmeal">
        <img 
          src={shoe.image} 
          alt={shoe.name} 
          className="w-full h-full object-cover mix-blend-multiply"
          loading="lazy"
        />
      </div>
      
      <div className="flex flex-col flex-grow">
        <h3 className="text-charcoal font-bold text-lg leading-tight">{shoe.name}</h3>
        <p className="text-gray-500 text-sm mb-2">{shoe.brand}</p>
        
        <div className="flex items-center gap-2 mt-auto">
          <span className="font-semibold text-charcoal">${shoe.price}</span>
          <button 
            onClick={() => onAdd(shoe)}
            className="ml-auto w-8 h-8 rounded-full bg-charcoal text-white flex items-center justify-center active:bg-sage transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};