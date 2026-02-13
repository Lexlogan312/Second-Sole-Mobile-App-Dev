import React, { useState, useEffect } from 'react';
import { EVENTS, TRAILS } from '../constants';
import { MapPin, Calendar, ExternalLink, Check, UserPlus } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { UserProfile } from '../types';

export const CommunityView: React.FC = () => {
  const [view, setView] = useState<'events' | 'trails'>('events');
  const [profile, setProfile] = useState<UserProfile>(StorageService.getUserProfile());

  useEffect(() => {
    // Refresh profile on mount to get latest check-ins
    setProfile(StorageService.getUserProfile());
  }, []);

  const handleCheckIn = (eventId: string) => {
    const isCheckedIn = profile.checkIns.includes(eventId);
    let newCheckIns;
    
    if (isCheckedIn) {
      newCheckIns = profile.checkIns.filter(id => id !== eventId);
    } else {
      newCheckIns = [...profile.checkIns, eventId];
    }

    const newProfile = { ...profile, checkIns: newCheckIns };
    setProfile(newProfile);
    StorageService.saveUserProfile(newProfile);
  };

  return (
    <div className="pb-32 px-6">
      <header className="py-6">
        <h1 className="text-2xl font-bold text-charcoal mb-6">Community Hub</h1>
        <div className="flex p-1 bg-white rounded-full shadow-sm">
          <button 
            onClick={() => setView('events')}
            className={`flex-1 py-3 rounded-full text-sm font-bold transition-all ${view === 'events' ? 'bg-sage text-white shadow-md' : 'text-gray-400'}`}
          >
            Events
          </button>
          <button 
            onClick={() => setView('trails')}
            className={`flex-1 py-3 rounded-full text-sm font-bold transition-all ${view === 'trails' ? 'bg-sage text-white shadow-md' : 'text-gray-400'}`}
          >
            Local Trails
          </button>
        </div>
      </header>

      <div className="space-y-4 animate-fade-in">
        {view === 'events' ? (
          EVENTS.map(event => {
            const isCheckedIn = profile.checkIns.includes(event.id);
            return (
              <div key={event.id} className="bg-white p-5 rounded-3xl shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-sage/10 w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-sage shrink-0">
                    <span className="text-xs font-bold uppercase">{event.day.substring(0,3)}</span>
                    <Calendar size={20} />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-charcoal">{event.title}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <span className="w-2 h-2 rounded-full bg-sage block"></span> {event.time}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{event.location}</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <button 
                    onClick={() => handleCheckIn(event.id)}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                      isCheckedIn 
                        ? 'bg-sage text-white shadow-md shadow-sage/20' 
                        : 'bg-white border-2 border-sage/20 text-sage hover:bg-sage/5'
                    }`}
                  >
                    {isCheckedIn ? (
                      <>
                        <Check size={16} /> Checked In
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} /> Check In
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          TRAILS.map(trail => (
            <div key={trail.id} className="bg-white p-4 rounded-3xl shadow-sm group">
              <div className="h-32 rounded-2xl bg-gray-200 mb-4 overflow-hidden relative">
                 <img src={trail.image} alt={trail.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-charcoal">
                    {trail.distance}
                 </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                    <h3 className="font-bold text-charcoal">{trail.name}</h3>
                    <p className="text-sm text-sage font-medium">{trail.type}</p>
                </div>
                <button className="p-2 bg-oatmeal rounded-full text-charcoal hover:bg-sage hover:text-white transition-colors">
                    <ExternalLink size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};