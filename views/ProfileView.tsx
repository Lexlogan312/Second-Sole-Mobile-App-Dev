import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storageService';
import { UserProfile, Shoe } from '../types';
import { Button } from '../components/Button';
import { Shield, Trash2, Edit2, AlertCircle, Search, ChevronRight, X, Minus, Plus } from 'lucide-react';
import { INVENTORY } from '../constants';

export const ProfileView: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(StorageService.getUserProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [showShoeSelector, setShowShoeSelector] = useState(false);

  const percentage = Math.min((profile.currentShoeMileage / profile.shoeLimit) * 100, 100);
  const isNearLimit = profile.currentShoeMileage >= 350;

  const handleUpdateMileage = (val: number) => {
    const newMileage = Math.max(0, Math.min(val, 1000)); // Cap at 1000 for sanity
    const newProfile = { ...profile, currentShoeMileage: newMileage };
    setProfile(newProfile);
    StorageService.saveUserProfile(newProfile);
  };

  const adjustMileage = (amount: number) => {
    handleUpdateMileage(profile.currentShoeMileage + amount);
  };

  const handleSelectShoe = (shoe: Shoe) => {
    // Immediately update profile without blocking confirm dialog
    const newProfile = { 
        ...profile, 
        currentShoeName: shoe.name,
        currentShoeImage: shoe.image,
        currentShoeMileage: 0 // Reset mileage for new shoe
    };
    
    setProfile(newProfile);
    StorageService.saveUserProfile(newProfile);
    setShowShoeSelector(false);
    setIsEditing(false);
  };

  const handleWipe = () => {
    if (confirm("Are you sure? This will delete all local data.")) {
        StorageService.wipeAllData();
    }
  };

  if (showShoeSelector) {
    return (
        <div className="fixed inset-0 bg-oatmeal z-[60] overflow-y-auto animate-fade-in">
            <div className="px-6 py-8 pb-32">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-charcoal">Select Your Shoe</h2>
                    <button onClick={() => setShowShoeSelector(false)} className="p-2 bg-white rounded-full text-charcoal shadow-sm">
                        <X size={20} />
                    </button>
                </div>
                <div className="space-y-4">
                    {INVENTORY.map(shoe => (
                        <div 
                            key={shoe.id} 
                            onClick={() => handleSelectShoe(shoe)}
                            className="bg-white p-4 rounded-3xl flex items-center gap-4 shadow-sm active:scale-95 transition-transform cursor-pointer"
                        >
                            <img src={shoe.image} alt={shoe.name} className="w-16 h-16 rounded-xl object-cover mix-blend-multiply bg-oatmeal" />
                            <div>
                                <h3 className="font-bold text-charcoal">{shoe.name}</h3>
                                <p className="text-sm text-gray-500">{shoe.brand}</p>
                            </div>
                            <ChevronRight className="ml-auto text-gray-300" size={20} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="pb-32 px-6 pt-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-charcoal mb-8">My Sole Tracker</h1>

      {/* Mileage Card */}
      <div className="bg-white rounded-4xl p-8 shadow-sm mb-8 relative overflow-hidden transition-all duration-300">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
                {profile.currentShoeImage ? (
                    <div className="w-16 h-16 rounded-2xl bg-oatmeal overflow-hidden shrink-0">
                         <img src={profile.currentShoeImage} alt="Current Shoe" className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                ) : (
                    <div className="w-16 h-16 rounded-2xl bg-sage/10 flex items-center justify-center text-sage shrink-0">
                        <Search size={24} />
                    </div>
                )}
                <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Current Shoe</p>
                    <h2 className="text-xl font-bold text-charcoal mt-0.5 leading-tight">{profile.currentShoeName}</h2>
                </div>
            </div>
            <button 
                onClick={() => setIsEditing(!isEditing)} 
                className={`p-2 rounded-full transition-colors ${isEditing ? 'bg-sage text-white' : 'bg-oatmeal text-sage'}`}
            >
              <Edit2 size={16} />
            </button>
          </div>

          <div className="mb-3 flex items-baseline gap-2">
            <span className="text-5xl font-bold text-charcoal tracking-tight">{profile.currentShoeMileage}</span>
            <span className="text-gray-400 font-medium text-lg">/ {profile.shoeLimit} mi</span>
          </div>

          {/* Progress Bar */}
          <div className="h-4 bg-oatmeal rounded-full overflow-hidden mb-6">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${isNearLimit ? 'bg-red-400' : 'bg-sage'}`} 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          {/* Edit Mode Controls */}
          {isEditing && (
            <div className="bg-oatmeal/50 p-6 rounded-3xl mb-6 border border-sage/10 animate-fade-in">
               
               <div className="mb-6">
                   <label className="text-xs font-bold text-gray-500 mb-3 block uppercase tracking-wide">Shoe Selection</label>
                   <Button variant="secondary" fullWidth onClick={() => setShowShoeSelector(true)} className="py-3 text-sm">
                        <Search size={16} /> Select from Inventory
                   </Button>
               </div>

               <div>
                   <label className="text-xs font-bold text-gray-500 mb-3 block uppercase tracking-wide">Update Mileage</label>
                   
                   {/* Custom Slider UI */}
                   <div className="flex items-center gap-4 mb-2">
                       <button 
                            onClick={() => adjustMileage(-5)}
                            className="w-10 h-10 rounded-xl bg-white text-charcoal shadow-sm flex items-center justify-center active:bg-sage active:text-white transition-colors"
                        >
                            <Minus size={18} />
                       </button>
                       
                       <div className="flex-1 relative h-10 flex items-center">
                            <input 
                                type="range" 
                                min="0" 
                                max="600" 
                                value={profile.currentShoeMileage} 
                                onChange={(e) => handleUpdateMileage(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-sage"
                            />
                       </div>

                       <button 
                            onClick={() => adjustMileage(5)}
                            className="w-10 h-10 rounded-xl bg-white text-charcoal shadow-sm flex items-center justify-center active:bg-sage active:text-white transition-colors"
                        >
                            <Plus size={18} />
                       </button>
                   </div>
                   <div className="flex justify-between text-xs text-gray-400 font-medium px-1">
                        <span>0</span>
                        <span>Adjust via slider or buttons</span>
                        <span>600+</span>
                   </div>
               </div>
            </div>
          )}

          {isNearLimit ? (
             <div className="bg-red-50 text-red-500 p-4 rounded-2xl flex items-start gap-3 border border-red-100">
                <AlertCircle className="shrink-0" size={20} />
                <div>
                    <p className="text-sm font-bold">Time for an upgrade!</p>
                    <p className="text-xs mt-1 opacity-90">You've hit 350 miles. Visit us at 122 Public Square for your "Second-Story Discount".</p>
                </div>
             </div>
          ) : (
            !isEditing && <p className="text-sm text-gray-400">Keep running! We'll notify you at 350 miles.</p>
          )}
        </div>
      </div>

      {/* Privacy Section */}
      <div className="bg-white rounded-4xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
           <Shield className="text-sage" />
           <h3 className="font-bold text-charcoal">Privacy Dashboard</h3>
        </div>
        
        <div className="space-y-4">
            <p className="text-sm text-gray-500 leading-relaxed">
                Second Sole Medina follows a <span className="font-bold text-charcoal">Zero-Cloud</span> policy. 
                Your gait analysis, preferences, and mileage data are stored securely on this device only. 
                No personal data is ever uploaded to our servers.
            </p>

            <div className="pt-4 border-t border-gray-100">
                <Button variant="ghost" className="w-full text-red-400 hover:bg-red-50 hover:text-red-500 justify-start" onClick={handleWipe}>
                    <Trash2 size={18} /> Wipe All Data
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};