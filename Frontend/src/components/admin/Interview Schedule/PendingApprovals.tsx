import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Video, Edit, XCircle } from 'lucide-react';
import { Trainer } from '@/types/trainer';

interface PendingApprovalsProps {
  trainers: Trainer[];
  searchTerm: string;
  handleScheduleInterview: (trainerId: string) => void;
  handleUpdateTrainer: (trainerId: string) => void;
  setTrainers: React.Dispatch<React.SetStateAction<Trainer[]>>;
}

const StatusBadge: React.FC<{ status: string; completed: boolean }> = ({ status, completed }) => {
  let className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ';
  let text = '';
  if (completed) {
    className += 'bg-green-900 text-green-200';
    text = 'Completed';
  } else if (status === 'interview_scheduled') {
    className += 'bg-yellow-900 text-yellow-200';
    text = 'Scheduled';
  } else if (status === 'applied') {
    className += 'bg-gray-600 text-gray-200';
    text = 'Not Scheduled';
  } else if (status === 'rejected') {
    className += 'bg-red-900 text-red-200';
    text = 'Canceled';
  } else if (status === 'approved') {
    className += 'bg-green-900 text-green-200';
    text = 'Hired';
  }
  return <span className={className}>{text}</span>;
};

const formatDate = (date?: Date) => {
  if (!date) return 'Not Scheduled';
  return (
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' - ' +
    new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  );
};

const PendingApprovals: React.FC<PendingApprovalsProps> = ({
  trainers,
  searchTerm,
  handleScheduleInterview,
  handleUpdateTrainer,
  setTrainers,
}) => {
  const rowsPerPage = 4;
  const [currentPage, setCurrentPage] = React.useState(1);
  const filteredTrainers = trainers.filter(
    (trainer) =>
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredTrainers.length / rowsPerPage);
  const currentTrainers = filteredTrainers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="bg-gray-800 rounded-lg p-4 lg:p-6">
      <h3 className="text-base lg:text-lg font-semibold text-white mb-4">Pending Approval Interviews</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-400 text-xs lg:text-sm">Date & Time</TableHead>
              <TableHead className="text-gray-400 text-xs lg:text-sm">Session Type</TableHead>
              <TableHead className="text-gray-400 text-xs lg:text-sm">Trainer</TableHead>
              <TableHead className="text-gray-400 text-xs lg:text-sm">Admin</TableHead>
              <TableHead className="text-gray-400 text-xs lg:text-sm">Status</TableHead>
              <TableHead className="text-gray-400 text-xs lg:text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTrainers.map((trainer) => (
              <TableRow key={trainer.id}>
                <TableCell className="text-white text-xs lg:text-sm">{formatDate(trainer.interview?.startTime)}</TableCell>
                <TableCell className="text-gray-400 text-xs lg:text-sm">Trainer Interview</TableCell>
                <TableCell className="text-white text-xs lg:text-sm">
                  <div className="flex items-center">
                    <img src={trainer.avatar} alt="Trainer" className="w-8 h-8 lg:w-10 lg:h-10 rounded-full mr-2 lg:mr-3" />
                    <span>{trainer.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-400 text-xs lg:text-sm">
                  {trainer.interview?.adminId ? 'Admin User' : 'Not Assigned'}
                </TableCell>
                <TableCell>
                  <StatusBadge status={trainer.status} completed={trainer.interview?.completed} />
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {trainer.status === 'applied' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleScheduleInterview(trainer.id)}
                        className="text-indigo-400 hover:text-indigo-300"
                        title="Schedule Interview"
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                    )}
                    {trainer.status === 'interview_scheduled' && !trainer.interview?.completed && (
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled
                        className="text-gray-400"
                        title="Join Interview"
                      >
                        <Video className="h-4 w-4" />
                      </Button>
                    )}
                    {(trainer.status === 'interviewed' || trainer.status === 'approved') && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUpdateTrainer(trainer.id)}
                          className="text-green-400 hover:text-green-300"
                          title="Update Trainer"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm('Are you sure you want to reject this trainer?')) {
                              setTrainers((prev) =>
                                prev.map((t) => (t.id === trainer.id ? { ...t, status: 'rejected' } : t))
                              );
                            }
                          }}
                          className="text-red-400 hover:text-red-300"
                          title="Reject Trainer"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <Button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="bg-gray-700 hover:bg-gray-600"
        >
          Previous
        </Button>
        <span className="text-gray-400 text-xs lg:text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="bg-gray-700 hover:bg-gray-600"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default PendingApprovals;