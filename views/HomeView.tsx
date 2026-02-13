import React from 'react';
import { ArrowRight, MapPin, Search } from 'lucide-react';
import { Button } from '../components/Button';
import { STORE_INFO } from '../constants';

interface HomeViewProps {
  setTab: (tab: string) => void;
}

const TEAM = [
  {
    name: 'Steve',
    role: 'Store Manager',
    bio: 'Running since \'95. Expert in gait analysis and injury prevention.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop'
  },
  {
    name: 'Sarah',
    role: 'Lead Fitter',
    bio: 'Ultra-marathoner. Loves helping beginners find their first pair.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop'
  },
  {
    name: 'Mike',
    role: 'Community Lead',
    bio: 'Coordinates the Tuesday night runs. Ask me about local trails!',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop'
  }
];

export const HomeView: React.FC<HomeViewProps> = ({ setTab }) => {
  return (
    <div className="space-y-8 pb-32 animate-fade-in">
      {/* Header */}
      <header className="px-6 pt-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Second Sole</h1>
          <p className="text-sage font-medium">Medina, OH</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
          <img src="https://lh3.googleusercontent.com/a/ACg8ocLCS26bga_K8xQJKgCwcpuhzZb-AwP8-nINpT4x68NSf8hEZPU=s400-c" alt="User" className="w-full h-full rounded-full object-cover opacity-80" />
        </div>
      </header>

      {/* Hero */}
      <section className="px-4">
        <div className="bg-charcoal rounded-4xl p-8 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4 leading-tight">Find Your <br/>Perfect Fit.</h2>
            <p className="text-white/70 mb-6 max-w-[200px]">Take our expert digital gait analysis to find the right shoe for you.</p>
            <Button variant="primary" onClick={() => setTab('finder')}>
              Start Shoe Finder <ArrowRight size={18} />
            </Button>
          </div>
          <div className="absolute right-[-40px] bottom-[-40px] w-48 h-48 bg-sage rounded-full blur-3xl opacity-20"></div>
          <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-sage rounded-full blur-2xl opacity-20"></div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-6">
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          <div className="min-w-[140px] bg-white p-4 rounded-3xl shadow-sm flex flex-col gap-3 active:scale-95 transition-transform" onClick={() => setTab('shop')}>
            <div className="w-10 h-10 rounded-2xl bg-oatmeal flex items-center justify-center text-sage">
              <Search size={20} />
            </div>
            <span className="font-semibold text-charcoal">Browse Inventory</span>
          </div>
          <div className="min-w-[140px] bg-white p-4 rounded-3xl shadow-sm flex flex-col gap-3 active:scale-95 transition-transform" onClick={() => setTab('community')}>
            <div className="w-10 h-10 rounded-2xl bg-oatmeal flex items-center justify-center text-sage">
              <MapPin size={20} />
            </div>
            <span className="font-semibold text-charcoal">Events & Trails</span>
          </div>
        </div>
      </section>

      {/* Meet the Experts */}
      <section className="px-6">
        <h3 className="text-xl font-bold text-charcoal mb-4">Meet the Experts</h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
            {TEAM.map((member, i) => (
                <div key={i} className="min-w-[220px] bg-white p-5 rounded-3xl shadow-sm flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-4 border-oatmeal">
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale-[20%]" />
                    </div>
                    <h4 className="font-bold text-lg text-charcoal">{member.name}</h4>
                    <p className="text-sage font-bold text-xs uppercase tracking-wide mb-3">{member.role}</p>
                    <p className="text-gray-500 text-xs leading-relaxed italic">"{member.bio}"</p>
                </div>
            ))}
        </div>
      </section>

      {/* Store Info */}
      <section className="px-6">
        <h3 className="text-xl font-bold text-charcoal mb-4">Visit Us</h3>
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-sage/10 rounded-xl text-sage">
              <MapPin size={24} />
            </div>
            <div>
              <h4 className="font-bold text-charcoal">Second Sole Medina</h4>
              <p className="text-gray-500">{STORE_INFO.address}</p>
              <a href={`tel:${STORE_INFO.phone}`} className="text-sage font-medium mt-1 block">{STORE_INFO.phone}</a>
            </div>
          </div>
          <div className="space-y-2 border-t border-gray-100 pt-4">
            {STORE_INFO.hours.map((h, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-400">{h.split(':')[0]}</span>
                <span className="font-medium text-charcoal">{h.split(':')[1]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};