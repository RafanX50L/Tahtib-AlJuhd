import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Bell, Settings } from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';
import StatsCards from '@/components/admin/Interview Schedule/StatsCards';
import WeeklySchedule from '@/components/admin/Interview Schedule/WeeklySchedule';
import PendingApprovals from '@/components/admin/Interview Schedule/PendingApprovals';
import SessionModal from '@/components/admin/Interview Schedule/SessionModal';
import ScheduleModal from '@/components/admin/Interview Schedule/ScheduleModal';
import TrainerModal from '@/components/admin/Interview Schedule/TrainerModal';
import FilterModal from '@/components/admin/Interview Schedule/FilterModal';
import useInterviewSchedule from '@/hooks/admin/useInterviewSchedule';

const TrainerInterviewSchedule: React.FC = () => {
  const {
    trainers,
    activeTab,
    setActiveTab,
    currentWeekStart,
    navigateWeek,
    formatWeekRange,
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
    schedule,
    handleScheduleInterview,
    handleUpdateTrainer,
    handleShowSession,
    setTrainers,
  } = useInterviewSchedule();

  return (
    <div className="flex min-h-screen bg-black text-white flex-col lg:flex-row overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-6 overflow-auto">
        {/* Header */}
        <header className="mb-4 bg-gray-900 px-4 py-3 lg:px-6 lg:py-4 flex flex-col lg:flex-row items-center justify-between sticky top-0 z-10 rounded-lg">
          <h2 className="text-lg lg:text-xl font-bold text-white mb-2 lg:mb-0">
            Trainer Interview Schedule
          </h2>
          <div className="flex items-center space-x-2 lg:space-x-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-none">
              <Input
                type="text"
                placeholder="Search interviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full lg:w-64 bg-gray-800 text-white rounded-md"
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Actions */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6 lg:mb-8 gap-4">
          <div className="flex space-x-2 w-full lg:w-auto">
            <Button
              onClick={() => setShowFilterModal(true)}
              className="bg-gray-700 hover:bg-gray-600 flex-1 lg:flex-none"
            >
              <span className="mr-2">Filter</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586a1 1 0 01-1.707.707l-2-2a1 1 0 01-.293-.707v-2.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </Button>
            <Button className="bg-gray-700 hover:bg-gray-600 flex-1 lg:flex-none">
              <span className="mr-2">Export</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => navigateWeek(-1)}
              className="bg-gray-700 hover:bg-gray-600"
              size="icon"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <span className="font-medium text-sm lg:text-base">{formatWeekRange()}</span>
            <Button
              onClick={() => navigateWeek(1)}
              className="bg-gray-700 hover:bg-gray-600"
              size="icon"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-gray-800 border-b border-gray-700">
            <TabsTrigger value="weekly" className="data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 text-gray-400 hover:text-white">
              Weekly Schedule
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 text-gray-400 hover:text-white">
              Pending Approvals
            </TabsTrigger>
          </TabsList>
          <TabsContent value="weekly">
            <WeeklySchedule
              schedule={schedule}
              currentWeekStart={currentWeekStart}
              handleShowSession={handleShowSession}
            />
          </TabsContent>
          <TabsContent value="pending">
            <PendingApprovals
              trainers={trainers}
              searchTerm={searchTerm}
              handleScheduleInterview={handleScheduleInterview}
              handleUpdateTrainer={handleUpdateTrainer}
              setTrainers={setTrainers}
            />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="px-4 py-3 lg:px-6 lg:py-4 bg-gray-900 mt-6 lg:mt-8 rounded-lg">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-2">
            <p className="text-gray-400 text-xs lg:text-sm">
              © 2025 FitConnect Admin Portal. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </main>

      {/* Modals */}
      <SessionModal
        show={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        session={selectedSession}
      />
      <ScheduleModal
        show={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        trainer={selectedTrainer}
        onSchedule={(trainerId, date, time) => {
          setTrainers((prev:any) =>
            prev.map((t:any) =>
              t.id === trainerId
                ? {
                    ...t,
                    status: 'interview_scheduled',
                    interview: {
                      ...t.interview,
                      date: new Date(date),
                      startTime: new Date(`${date}T${time}:00`),
                      endTime: new Date(`${date}T${parseInt(time) + 1}:00`),
                      adminId: 'admin1',
                      roomId: 'room_new',
                    },
                  }
                : t
            )
          );
          setShowScheduleModal(false);
        }}
      />
      <TrainerModal
        show={showTrainerModal}
        onClose={() => setShowTrainerModal(false)}
        trainer={selectedTrainer}
        onSave={(trainerId) => {
          setTrainers((prev:any) =>
            prev.map((t:any) => (t.id === trainerId ? { ...t, status: 'approved' } : t))
          );
          setShowTrainerModal(false);
        }}
      />
      <FilterModal
        show={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        setFilters={setFilters}
        trainers={trainers}
      />
    </div>
  );
};

export default TrainerInterviewSchedule;