import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Session } from '@/types/trainer';

interface WeeklyScheduleProps {
  schedule: Record<string, Session[]>;
  currentWeekStart: Date;
  handleShowSession: (trainer: string, time: string, date: Date) => void;
}

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ schedule, currentWeekStart, handleShowSession }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <Card className="bg-gray-800 border-gray-700 mb-6 lg:mb-8">
      <CardContent className="p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-semibold text-white mb-4">Weekly Interview Schedule</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 lg:gap-4">
          {days.map((day, index) => {
            const date = new Date(currentWeekStart);
            date.setDate(currentWeekStart.getDate() + index);
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <div key={day} className={`text-center font-medium ${isToday ? 'text-indigo-400' : 'text-gray-400'} text-xs lg:text-sm`}>
                {day} {isToday && '(Today)'}
              </div>
            );
          })}
          {Array.from({ length: 7 }, (_, index) => {
            const date = new Date(currentWeekStart);
            date.setDate(currentWeekStart.getDate() + index);
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <div key={index} className={`text-center py-1 text-xs lg:text-sm ${isToday ? 'bg-indigo-900 rounded-full w-6 lg:w-8 mx-auto' : ''}`}>
                {date.getDate()}
              </div>
            );
          })}
          {Array.from({ length: 7 }, (_, index) => {
            const date = new Date(currentWeekStart);
            date.setDate(currentWeekStart.getDate() + index);
            const dateStr = date.toISOString().split('T')[0];
            const isToday = date.toDateString() === new Date().toDateString();
            const sessions = schedule[dateStr] || [];
            return (
              <div
                key={index}
                className={`border border-gray-700 rounded-md p-2 bg-gray-900 h-24 lg:h-32 overflow-y-auto ${isToday ? 'ring-2 ring-indigo-500' : ''}`}
              >
                {sessions.map((session, sessionIndex) => (
                  <div
                    key={sessionIndex}
                    onClick={() => handleShowSession(session.trainer, session.time, date)}
                    className={`p-2 text-xs rounded-md mb-2 text-white cursor-pointer hover:bg-opacity-80 ${session.pending ? 'bg-yellow-800' : 'bg-indigo-900'}`}
                  >
                    <div className="font-medium">
                      {session.time} - {String(parseInt(session.time.split(':')[0]) + 1).padStart(2, '0')}:{session.time.split(':')[1]}
                    </div>
                    <div className="text-gray-300">
                      Interview with {session.trainer} {session.pending ? '(Pending)' : ''}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklySchedule;