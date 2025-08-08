import { useState } from 'react';
import { Trainer, Filters, Session } from '@/types/trainer';

// Mock data
const mockTrainers: Trainer[] = [
  {
    id: '101',
    name: 'Alex Carter',
    email: 'alex.carter@email.com',
    avatar: '/api/placeholder/40/40',
    status: 'interview_scheduled',
    interview: {
      adminId: 'admin101',
      startTime: new Date('2025-05-01T09:00:00'),
      endTime: new Date('2025-05-01T10:00:00'),
      date: new Date('2025-05-01'),
      roomId: 'room_501',
      completed: false,
      result: {
        communicationSkills: 0,
        technicalKnowledge: 0,
        coachingStyle: 0,
        confidencePresence: 0,
        brandAlignment: 0,
        equipmentQuality: 0,
        notes: '',
      },
    },
    professionalSummary: {
      yearsOfExperience: 3,
      specializations: ['Yoga', 'Pilates'],
      coachingType: ['Group', 'One-on-One'],
    },
  },
  {
    id: '102',
    name: 'Maria Lopez',
    email: 'maria.lopez@email.com',
    avatar: '/api/placeholder/40/40',
    status: 'applied',
    interview: null,
    professionalSummary: {
      yearsOfExperience: 7,
      specializations: ['Strength Training', 'HIIT'],
      coachingType: ['Group'],
    },
  },
  {
    id: '103',
    name: 'James Patel',
    email: 'james.patel@email.com',
    avatar: '/api/placeholder/40/40',
    status: 'interviewed',
    interview: {
      adminId: 'admin102',
      startTime: new Date('2025-05-02T14:00:00'),
      endTime: new Date('2025-05-02T15:00:00'),
      date: new Date('2025-05-02'),
      roomId: 'room_502',
      completed: true,
      result: {
        communicationSkills: 8,
        technicalKnowledge: 9,
        coachingStyle: 7,
        confidencePresence: 8,
        brandAlignment: 9,
        equipmentQuality: 8,
        notes: 'Strong candidate, great alignment with our brand.',
      },
    },
    professionalSummary: {
      yearsOfExperience: 4,
      specializations: ['Boxing', 'Cardio'],
      coachingType: ['One-on-One'],
    },
  },
  {
    id: '104',
    name: 'Sophie Nguyen',
    email: 'sophie.nguyen@email.com',
    avatar: '/api/placeholder/40/40',
    status: 'rejected',
    interview: {
      adminId: 'admin103',
      startTime: new Date('2025-05-03T11:00:00'),
      endTime: new Date('2025-05-03T12:00:00'),
      date: new Date('2025-05-03'),
      roomId: 'room_503',
      completed: false,
      result: {
        communicationSkills: 0,
        technicalKnowledge: 0,
        coachingStyle: 0,
        confidencePresence: 0,
        brandAlignment: 0,
        equipmentQuality: 0,
        notes: 'Cancelled due to scheduling conflict.',
      },
    },
    professionalSummary: {
      yearsOfExperience: 6,
      specializations: ['Zumba', 'Dance Fitness'],
      coachingType: ['Group'],
    },
  },
  {
    id: '105',
    name: 'Liam Brown',
    email: 'liam.brown@email.com',
    avatar: '/api/placeholder/40/40',
    status: 'interview_scheduled',
    interview: {
      adminId: 'admin104',
      startTime: new Date('2025-05-04T15:30:00'),
      endTime: new Date('2025-05-04T16:30:00'),
      date: new Date('2025-05-04'),
      roomId: 'room_504',
      completed: false,
      result: {
        communicationSkills: 0,
        technicalKnowledge: 0,
        coachingStyle: 0,
        confidencePresence: 0,
        brandAlignment: 0,
        equipmentQuality: 0,
        notes: '',
      },
    },
    professionalSummary: {
      yearsOfExperience: 2,
      specializations: ['Running', 'Endurance'],
      coachingType: ['One-on-One', 'Group'],
    },
  },
];

const useInterviewSchedule = () => {
  const [trainers, setTrainers] = useState<Trainer[]>(mockTrainers);
  const [activeTab, setActiveTab] = useState<'weekly' | 'pending'>('weekly');
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date('2025-04-08'));
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [showSessionModal, setShowSessionModal] = useState<boolean>(false);
  const [showTrainerModal, setShowTrainerModal] = useState<boolean>(false);
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [selectedSession, setSelectedSession] = useState<{ trainer: string; time: string; date: Date } | null>(null);
  const [filters, setFilters] = useState<Filters>({
    startDate: '',
    endDate: '',
    trainer: '',
    statuses: {
      scheduled: false,
      pending: false,
      completed: false,
      canceled: false,
    },
  });

  const stats = {
    today: trainers.filter(
      (t) => t.interview?.date && new Date(t.interview.date).toDateString() === new Date().toDateString()
    ).length,
    pending: trainers.filter((t) => t.status === 'applied').length,
    canceled: trainers.filter((t) => t.status === 'rejected').length,
    completed: trainers.filter((t) => t.status === 'interviewed').length,
  };

  const generateWeeklySchedule = (): Record<string, Session[]> => {
    const schedule: Record<string, Session[]> = {};
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      schedule[dateStr] = trainers
        .filter(
          (trainer) =>
            trainer.interview?.date &&
            new Date(trainer.interview.date).toDateString() === date.toDateString()
        )
        .map((trainer) => ({
          time: trainer.interview.startTime
            ? new Date(trainer.interview.startTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })
            : '',
          trainer: trainer.name,
          trainerId: trainer.id,
          pending: trainer.status === 'interview_scheduled' && !trainer.interview.completed,
        }));
    }
    return schedule;
  };

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + direction * 7);
    setCurrentWeekStart(newDate);
  };

  const formatWeekRange = () => {
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(currentWeekStart.getDate() + 6);
    return `${currentWeekStart.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    })} - ${weekEnd.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })}`;
  };

  const handleScheduleInterview = (trainerId: string) => {
    setSelectedTrainer(trainers.find((t) => t.id === trainerId) || null);
    setShowScheduleModal(true);
  };

  const handleUpdateTrainer = (trainerId: string) => {
    setSelectedTrainer(trainers.find((t) => t.id === trainerId) || null);
    setShowTrainerModal(true);
  };

  const handleShowSession = (trainer: string, time: string, date: Date) => {
    setSelectedSession({ trainer, time, date });
    setShowSessionModal(true);
  };

  return {
    trainers,
    setTrainers,
    activeTab,
    setActiveTab,
    currentWeekStart,
    navigateWeek,
    formatWeekRange,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    showFilterModal,
    setShowFilterModal,
    showSessionModal,
    setShowSessionModal,
    showTrainerModal,
    setShowTrainerModal,
    showScheduleModal,
    setShowScheduleModal,
    selectedTrainer,
    setSelectedTrainer,
    selectedSession,
    setSelectedSession,
    filters,
    setFilters,
    stats,
    schedule: generateWeeklySchedule(),
    handleScheduleInterview,
    handleUpdateTrainer,
    handleShowSession,
  };
};

export default useInterviewSchedule;