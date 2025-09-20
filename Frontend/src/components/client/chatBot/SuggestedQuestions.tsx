import React from 'react';
import { Button } from '@/components/ui/button';

interface SuggestedQuestionsProps {
  onQuestionSelect: (question: string) => void;
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onQuestionSelect }) => {
  const suggestions = [
    'How many rest days should I take per week?',
    'Best exercises for building core strength?',
    'How can I improve my running endurance?',
    'What should I eat before a morning workout?',
  ];

  return (
    <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900 flex-shrink-0">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-xs sm:text-sm font-medium text-slate-400 mb-3 uppercase">Suggested Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => onQuestionSelect(suggestion)}
              className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 text-left justify-start h-auto p-2 sm:p-3 text-xs sm:text-sm"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuggestedQuestions;