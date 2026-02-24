import React, { useState } from 'react';
import { Check, ChevronRight, AlertCircle, RotateCcw } from 'lucide-react';
import { Button, Card } from '../components/UI';
import { storageService } from '../services/storage';
import { GaitProfile } from '../types';
import { THEME } from '../theme';

interface FinderProps {
  onComplete: () => void;
}

const STEPS = [
  {
    id: 'gender',
    question: 'What\'s your fit preference?',
    subtitle: 'Used to narrow down shoe options.',
    options: [
      { label: "Men's", value: 'Men', desc: "Men's sizing & fit." },
      { label: "Women's", value: 'Women', desc: "Women's sizing & fit." },
      { label: 'Either / Unisex', value: 'Unisex', desc: 'Unisex models only.' },
    ]
  },
  {
    id: 'terrain',
    question: 'Where do you run most?',
    subtitle: 'Your primary running surface.',
    options: [
      { label: 'Road & Pavement', value: 'Road', desc: 'Sidewalks, streets, paved paths.' },
      { label: 'Trail & Off-Road', value: 'Trail', desc: 'Dirt, rocks, roots, and mud.' },
      { label: 'Track', value: 'Track', desc: 'Rubber track, speed work, racing.' },
      { label: 'Mixed / Hybrid', value: 'Hybrid', desc: 'A bit of everything.' },
    ]
  },
  {
    id: 'experienceLevel',
    question: 'How would you describe yourself?',
    subtitle: 'Honest answers lead to better matches.',
    options: [
      { label: 'New Runner', value: 'Beginner', desc: 'Just starting out or getting back into it.' },
      { label: 'Recreational', value: 'Intermediate', desc: 'Regular runner, a few races per year.' },
      { label: 'Competitive', value: 'Advanced', desc: 'Training plans, goal races, PRs matter.' },
      { label: 'Elite / Racer', value: 'Elite', desc: 'Podium finishes, sub-elite or elite times.' },
    ]
  },
  {
    id: 'distanceGoals',
    question: 'What\'s your primary running goal?',
    subtitle: 'Choose the one that fits best.',
    options: [
      { label: 'Speed & Track Work', value: 'Speed', desc: '5K, 10K, intervals, time trials.' },
      { label: 'Everyday Training', value: 'Daily', desc: 'Easy miles, fitness, daily runs.' },
      { label: 'Half / Full Marathon', value: 'Long', desc: '13.1–26.2 miles, tempo runs.' },
      { label: 'Ultra / Multi-Day', value: 'Ultra', desc: '50K+ or back-to-back days.' },
    ]
  },
  {
    id: 'weeklyMiles',
    question: 'How many miles do you run each week?',
    subtitle: 'Average training week.',
    options: [
      { label: 'Under 15 miles', value: 'Low', desc: '0–15 miles — casual or recovering.' },
      { label: '15–35 miles', value: 'Medium', desc: '15–35 miles — solid training load.' },
      { label: '35+ miles', value: 'High', desc: '35+ miles — high-mileage runner.' },
    ]
  },
  {
    id: 'arch',
    question: 'What is your arch profile?',
    subtitle: 'If unsure, do the wet foot test — wet your foot and step on paper.',
    options: [
      { label: 'Normal/Medium', value: 'Medium', desc: 'A visible arch — most common.' },
      { label: 'Flat / Low Arch', value: 'Low', desc: 'Full footprint, collapsed arch.' },
      { label: 'High Arch', value: 'High', desc: 'Very little footprint visible.' },
    ]
  },
  {
    id: 'pronation',
    question: 'How do your ankles roll?',
    subtitle: 'Look at the wear pattern on your old shoes — or ask our staff.',
    options: [
      { label: 'Neutral', value: 'Neutral', desc: 'Even landing, minimal rolling.' },
      { label: 'Overpronation', value: 'Over', desc: 'Ankles roll inward — inner heel worn.' },
      { label: 'Supination', value: 'Under', desc: 'Ankles roll outward — outer edge worn.' },
    ]
  },
  {
    id: 'strike',
    question: 'Where does your foot land first?',
    subtitle: 'Think about your natural stride — not what you\'re "supposed" to do.',
    options: [
      { label: 'Heel First', value: 'Heel', desc: 'Most common — heel hits first.' },
      { label: 'Midfoot', value: 'Midfoot', desc: 'Flat footed landing, balanced.' },
      { label: 'Ball of Foot', value: 'Forefoot', desc: 'On your toes — sprinters & speed.' },
    ]
  },
  {
    id: 'cushionPref',
    question: 'How do you like your ride to feel?',
    subtitle: 'No wrong answer — this is personal preference.',
    options: [
      { label: 'Firm & Ground-Feel', value: 'Firm', desc: 'Responsive, fast, connected to the road.' },
      { label: 'Balanced', value: 'Balanced', desc: 'Not too soft, not too firm.' },
      { label: 'Plush & Protective', value: 'Plush', desc: 'Soft, cloud-like, high mileage comfort.' },
    ]
  },
  {
    id: 'dropPref',
    question: 'What heel-to-toe drop do you prefer?',
    subtitle: 'Lower drop = more natural motion. Higher drop = more heel cushion.',
    options: [
      { label: 'Zero Drop (0mm)', value: 'Zero', desc: 'Natural, barefoot-style (Altra, Vivobarefoot).' },
      { label: 'Low Drop (1–6mm)', value: 'Low', desc: 'Minimal feel with some heel support.' },
      { label: 'Standard (7–10mm)', value: 'Medium', desc: 'Most popular, works for every stride type.' },
      { label: 'High Drop (11mm+)', value: 'High', desc: 'Maximum heel cushion, heel-strike friendly.' },
    ]
  },
  {
    id: 'footShape',
    question: 'What toe box width do you prefer?',
    subtitle: 'Go wide if you get blisters or black toenails.',
    options: [
      { label: 'Standard / Snug', value: 'Standard', desc: 'Performance fit, holds the foot securely.' },
      { label: 'Wide Toe Box', value: 'Wide', desc: 'Toes can splay naturally — Altra, Hoka Wide.' },
    ]
  },
  {
    id: 'injuryHistory',
    question: 'Any recurring pain or injury history?',
    subtitle: 'Select all that apply — we\'ll factor this into your matches.',
    multi: true,
    options: [
      { label: 'None — Healthy', value: 'None', desc: 'No ongoing issues.' },
      { label: 'Plantar Fasciitis', value: 'Plantar', desc: 'Heel or arch pain, especially in the morning.' },
      { label: 'Shin Splints', value: 'Shin', desc: 'Lower leg pain during or after runs.' },
      { label: "Knee Pain", value: 'Knee', desc: "Runner's knee or patellar pain." },
      { label: 'IT Band Syndrome', value: 'ITBand', desc: 'Outer knee or hip tightness.' },
      { label: 'Achilles Issues', value: 'Achilles', desc: 'Tendon pain at back of heel.' },
      { label: 'Hip or Back Pain', value: 'Hip', desc: 'Hip flexor, glute, or lower back.' },
    ]
  },
];

export const Finder: React.FC<FinderProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const profile = storageService.getProfile();

  if (profile.isGuest) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <AlertCircle size={48} className={`text-[${THEME.muted}] mb-4`} />
        <h2 className="text-xl font-bold mb-2">Account Required</h2>
        <p className={`text-[${THEME.muted}] mb-6`}>The Shoe Finder requires a local profile to save your biomechanics data.</p>
        <Button onClick={() => storageService.wipeData()}>Create Profile</Button>
      </div>
    );
  }

  const handleSelect = (value: any, isMulti: boolean) => {
    const stepId = STEPS[currentStep].id;
    if (isMulti) {
      const current = answers[stepId] || [];
      if (value === 'None') {
        setAnswers(prev => ({ ...prev, [stepId]: ['None'] }));
      } else {
        let newValues = current.includes('None') ? [] : [...current];
        if (newValues.includes(value)) {
          newValues = newValues.filter((v: any) => v !== value);
        } else {
          newValues.push(value);
        }
        setAnswers(prev => ({ ...prev, [stepId]: newValues }));
      }
    } else {
      setAnswers(prev => ({ ...prev, [stepId]: value }));
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      storageService.updateGaitProfile(answers as GaitProfile);
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const stepData = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const canProceed = !!answers[stepData.id] &&
    !(Array.isArray(answers[stepData.id]) && answers[stepData.id].length === 0);

  return (
    <div className="h-full flex flex-col overflow-x-hidden">
      {/* Progress header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-5">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className={`text-[${THEME.muted}] hover:text-white transition-colors flex-shrink-0`}
            >
              <RotateCcw size={18} />
            </button>
          )}
          <div className={`h-1.5 flex-1 bg-[${THEME.surface}] rounded-full overflow-hidden`}>
            <div
              className={`h-full bg-gradient-to-r from-[${THEME.text}] to-[${THEME.accent}] transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className={`text-xs text-[${THEME.muted}] font-mono flex-shrink-0`}>
            {currentStep + 1}/{STEPS.length}
          </span>
        </div>

        <h2 className="text-2xl font-bold mb-1">Shoe Finder</h2>
        <p className={`text-sm text-[${THEME.muted}]`}>Personalized fitting · {STEPS.length} quick questions</p>
      </div>

      {/* Question content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-4 custom-scrollbar w-full">
        <div className="mb-6">
          <h3 className="text-xl text-white font-semibold mb-1">{stepData.question}</h3>
          {'subtitle' in stepData && stepData.subtitle && (
            <p className={`text-xs text-[${THEME.muted}]`}>{stepData.subtitle}</p>
          )}
        </div>

        <div className="space-y-3 px-1">
          {stepData.options.map((opt) => {
            const stepId = stepData.id;
            const isSelected = 'multi' in stepData && stepData.multi
              ? (answers[stepId] || []).includes(opt.value)
              : answers[stepId] === opt.value;

            return (
              <Card
                key={opt.value}
                onClick={() => handleSelect(opt.value, !!(stepData as any).multi)}
                className={`transition-all duration-200 ${isSelected
                    ? `border-[${THEME.accent}] ring-1 ring-[${THEME.accent}] bg-[${THEME.surface}]`
                    : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-lg mb-0.5">{opt.label}</div>
                    <div className={`text-xs text-[${THEME.muted}]`}>{opt.desc}</div>
                  </div>
                  {isSelected && (
                    <div className={`bg-[${THEME.accent}] rounded-full p-1 flex-shrink-0`}>
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {'multi' in stepData && stepData.multi && (
          <p className={`text-xs text-[${THEME.muted}] text-center mt-4`}>
            Tap all that apply
          </p>
        )}
      </div>

      {/* Navigation footer */}
      <div className="pt-4 mt-auto">
        <Button
          fullWidth
          size="lg"
          onClick={handleNext}
          disabled={!canProceed}
        >
          {currentStep === STEPS.length - 1 ? 'Find My Matches' : 'Next'}
          {currentStep < STEPS.length - 1 && <ChevronRight size={18} className="ml-1" />}
        </Button>
      </div>
    </div>
  );
};