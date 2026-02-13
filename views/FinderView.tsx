import React, { useState } from 'react';
import { ArrowRight, Check, RotateCcw } from 'lucide-react';
import { Button } from '../components/Button';
import { QuizPreferences, Shoe } from '../types';
import { INVENTORY } from '../constants';
import { ShoeCard } from '../components/ShoeCard';
import { StorageService } from '../services/storageService';

interface FinderViewProps {
  onAddToCart: (shoe: Shoe) => void;
}

const STEPS = [
  {
    id: 'terrain',
    question: "Where do you spend most of your miles?",
    options: [
      { value: 'Road', label: 'Road', desc: 'Pavement & Treadmills' },
      { value: 'Trail', label: 'Trail', desc: 'Mud, Rocks & Roots' },
      { value: 'Hybrid', label: 'Hybrid', desc: 'A bit of everything' },
    ]
  },
  {
    id: 'stability', // Changed from 'stride' to match state key
    question: "How does your foot land?",
    options: [
      { value: 'Neutral', label: 'Neutral', desc: 'I stay centered' },
      { value: 'Stability', label: 'Overpronation', desc: 'I roll inward' },
      { value: 'Supination', label: 'Supination', desc: 'I roll outward (High Arch)' },
    ]
  },
  {
    id: 'cushion',
    question: "What feel do you prefer underfoot?",
    options: [
      { value: 'Firm', label: 'Firm/Responsive', desc: 'Feel the ground, go fast' },
      { value: 'Balanced', label: 'Balanced', desc: 'Soft but supportive' },
      { value: 'Maximal', label: 'Maximal/Plush', desc: 'Running on clouds' },
    ]
  },
  {
    id: 'mileage',
    question: "What is your weekly volume?",
    options: [
      { value: 'Low', label: '0–10 miles', desc: 'Casual runner' },
      { value: 'Medium', label: '10–30 miles', desc: 'Dedicated runner' },
      { value: 'High', label: '30+ miles', desc: 'Marathon training' },
    ]
  },
  {
    id: 'width',
    question: "How much 'wiggle room' do you need?",
    options: [
      { value: 'Standard', label: 'Standard', desc: 'Normal fit' },
      { value: 'Wide', label: 'Wide/Roomy', desc: 'Wide toe-box needed' },
    ]
  },
  {
    id: 'brands',
    question: "Which brands do you trust?",
    multi: true,
    options: [
      { value: 'No Preference', label: 'No Preference', desc: 'I trust your expertise' },
      { value: 'Brooks', label: 'Brooks' },
      { value: 'Hoka', label: 'Hoka' },
      { value: 'Nike', label: 'Nike' },
      { value: 'Saucony', label: 'Saucony' },
      { value: 'New Balance', label: 'New Balance' },
      { value: 'Altra', label: 'Altra' },
      { value: 'Asics', label: 'Asics' },
      { value: 'On', label: 'On Running' },
      { value: 'Mizuno', label: 'Mizuno' },
    ]
  }
];

export const FinderView: React.FC<FinderViewProps> = ({ onAddToCart }) => {
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState<QuizPreferences>({
    terrain: null,
    stability: null,
    cushion: null,
    mileage: null,
    width: null,
    brands: [],
  });
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (value: any) => {
    const currentStepId = STEPS[step].id;

    if (currentStepId === 'brands') {
      const currentBrands = [...prefs.brands];
      
      if (value === 'No Preference') {
        // Exclusive selection: toggle No Preference and clear others
        const isSelected = currentBrands.includes('No Preference');
        setPrefs(prev => ({ ...prev, brands: isSelected ? [] : ['No Preference'] }));
      } else {
        // Standard selection: toggle brand and ensure No Preference is removed
        let newBrands = currentBrands.filter(b => b !== 'No Preference');
        
        if (newBrands.includes(value)) {
            newBrands = newBrands.filter(b => b !== value);
        } else {
            newBrands.push(value);
        }
        setPrefs(prev => ({ ...prev, brands: newBrands }));
      }
    } else {
      setPrefs(prev => ({ ...prev, [currentStepId]: value }));
      // Auto advance for single select
      if (step < STEPS.length - 1) {
        setTimeout(() => setStep(s => s + 1), 250);
      } else {
        finishQuiz();
      }
    }
  };

  const finishQuiz = () => {
    StorageService.saveQuizResults(prefs);
    setShowResults(true);
  };

  const getRecommendations = () => {
    const requiredStability = prefs.stability === 'Supination' ? 'Neutral' : prefs.stability;
    const hasNoBrandPreference = prefs.brands.includes('No Preference');

    return INVENTORY.map(shoe => {
      let score = 0;
      let eligible = true;

      // 1. Stability (35%) - HARD FILTER
      // We still assign points to eligible shoes to build the score
      if (shoe.stability !== requiredStability) {
        eligible = false;
      } else {
        score += 35;
      }

      // 2. Terrain (25%) - SOFT FILTER
      if (prefs.terrain === shoe.category) {
        score += 25;
      } else if (prefs.terrain === 'Hybrid' && shoe.category === 'Road') {
         // Allow road shoes for hybrid use (common scenario)
         score += 15;
      } else if (prefs.terrain === 'Hybrid' || shoe.category === 'Hybrid') {
        // Hybrid request fits Road/Trail (partially) OR Hybrid shoe fits Road/Trail request
        // We will filter strictly below, but if it passes filter, it gets pts.
        score += 20;
      } else {
         // Mismatch terrain (e.g. Trail shoe for Road runner)
         eligible = false; 
      }

      // 3. Cushion (20%)
      if (prefs.cushion === shoe.cushion) {
        score += 20;
      } else if (prefs.cushion === 'Balanced') {
        // Balanced users might like Firm or Maximal
        score += 10;
      } else if (shoe.cushion === 'Balanced') {
        // Balanced shoes might work for Firm/Max users
        score += 10;
      }

      // 4. Width (10%)
      if (prefs.width && shoe.widthOptions.includes(prefs.width)) {
        score += 10;
      } else if (!prefs.width || prefs.width === 'Standard') {
        // Assume standard is available on all
        score += 10;
      }

      // 5. Brand (10%)
      // If 'No Preference' is selected, everyone gets points, otherwise match specific brands
      if (hasNoBrandPreference || prefs.brands.includes(shoe.brand)) {
        score += 10;
      }

      return { shoe, score, eligible };
    })
    .filter(item => item.eligible)
    .sort((a, b) => b.score - a.score);
  };

  const recommendations = getRecommendations();

  if (showResults) {
    return (
      <div className="h-[100dvh] flex flex-col bg-oatmeal relative pb-24 overflow-y-auto animate-fade-in">
        <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-charcoal">Your Matches</h2>
            <button onClick={() => { setStep(0); setShowResults(false); }} className="text-sage text-sm font-medium flex items-center gap-1">
                <RotateCcw size={14} /> Retake
            </button>
            </div>
            
            {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
                {recommendations.map(({ shoe, score }) => (
                <ShoeCard key={shoe.id} shoe={shoe} matchScore={score} onAdd={onAddToCart} />
                ))}
            </div>
            ) : (
            <div className="text-center py-10">
                <p className="text-gray-500 mb-4">No exact matches found. Try broadening your criteria.</p>
                <Button variant="outline" onClick={() => { setStep(0); setShowResults(false); }}>Start Over</Button>
            </div>
            )}

            <div className="mt-8 p-6 bg-white rounded-3xl mb-10">
            <h3 className="font-bold mb-2">Why these shoes?</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
                Based on your gait analysis, we prioritized <span className="text-sage font-bold">{prefs.stability === 'Supination' ? 'Neutral' : prefs.stability}</span> support 
                for <span className="text-sage font-bold">{prefs.terrain}</span> running.
                Since you run <span className="text-sage font-bold">{prefs.mileage}</span> volume, we looked for durability 
                matching your preference for <span className="text-sage font-bold">{prefs.cushion}</span> cushion.
            </p>
            </div>
        </div>
      </div>
    );
  }

  const currentQ = STEPS[step];

  return (
    <div className="h-[100dvh] flex flex-col bg-oatmeal relative">
      {/* Header Section - Fixed */}
      <div className="px-6 pt-8 pb-4 shrink-0 bg-oatmeal z-10">
        <div className="w-full bg-white h-2 rounded-full mb-6 overflow-hidden">
            <div 
            className="bg-sage h-full transition-all duration-500 ease-out" 
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            ></div>
        </div>
        <h2 className="text-3xl font-bold text-charcoal mb-2">{currentQ.question}</h2>
        <p className="text-gray-500 text-sm">Step {step + 1} of {STEPS.length}</p>
      </div>

      {/* Scrollable Content - Increased padding to ensure visibility behind fixed footer */}
      <div className="flex-1 overflow-y-auto px-6 pb-72">
        <div className="space-y-3">
          {currentQ.options.map((opt: any) => {
            const isSelected = currentQ.multi 
              ? prefs.brands.includes(opt.value)
              : (prefs as any)[currentQ.id] === opt.value;

            return (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`w-full p-5 rounded-3xl text-left transition-all border-2 flex justify-between items-center ${
                  isSelected 
                    ? 'bg-sage/10 border-sage text-sage' 
                    : 'bg-white border-transparent text-charcoal hover:border-sage/30'
                }`}
              >
                <div>
                  <span className="block font-bold text-lg">{opt.label}</span>
                  {opt.desc && <span className="text-xs opacity-70 block mt-1">{opt.desc}</span>}
                </div>
                {isSelected && <Check size={20} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fixed Action Footer */}
      <div className="absolute bottom-20 left-0 right-0 p-6 pt-12 bg-gradient-to-t from-oatmeal via-oatmeal to-transparent z-20 pointer-events-none">
        <div className="pointer-events-auto">
            {currentQ.multi && (
            <div className="mb-4">
                <Button fullWidth onClick={finishQuiz} disabled={prefs.brands.length === 0}>
                Find My Shoes
                </Button>
            </div>
            )}
            
            {step > 0 && !currentQ.multi && (
            <button onClick={() => setStep(step - 1)} className="w-full text-center text-gray-400 text-sm py-2 hover:text-charcoal transition-colors">
                Back
            </button>
            )}
             {step > 0 && currentQ.multi && (
                <button onClick={() => setStep(step - 1)} className="w-full text-center text-gray-400 text-sm py-2 hover:text-charcoal transition-colors">
                    Back
                </button>
            )}
        </div>
      </div>
    </div>
  );
};