import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ITrainerWithPersonalization } from "@/pages/admin/ATrainerManagment";
import { Dispatch } from "@reduxjs/toolkit";

interface trainer{
  trainer:ITrainerWithPersonalization[]
  
}

const PendingApplicationsTable : React.FC<trainer> =  ({trainer}) => {
  console.log(trainer)
  // const [applications] = useState<Application[]>([
  //   {
  //     id: 1,
  //     name: "Michael Johnson",
  //     email: "michael.j@example.com",
  //     specialization: "Strength Training",
  //     experience: "7 years",
  //     appliedOn: "April 8, 2025",
  //     status: "Interview completed",
  //   },
  //   {
  //     id: 2,
  //     name: "Sarah Miller",
  //     email: "sarah.m@example.com",
  //     specialization: "Yoga & Pilates",
  //     experience: "5 years",
  //     appliedOn: "April 7, 2025",
  //     status: "Interview Scheduled",
  //   },
  //   {
  //     id: 3,
  //     name: "David Chen",
  //     email: "david.c@example.com",
  //     specialization: "CrossFit",
  //     experience: "3 years",
  //     appliedOn: "April 5, 2025",
  //     status: "Not Scheduled",
  //   },
  // ]);
  const [applications] = useState<ITrainerWithPersonalization[]>(trainer) 

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(applications.length / itemsPerPage);
  const paginatedApplications = applications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAction = (id: number, action: string) => {
    alert(`${action} action for application ID ${id}`);
  };

  return (
    <div className="mb-8 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Pending Trainer Applications</h2>
      </div>
      <Card className="bg-gray-800 rounded-lg overflow-hidden border-none">
        <Table className="border-none">
          <TableHeader>
            <TableRow className="bg-gray-900 hover:bg-gray-900 border-none">
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-none">Trainer</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-none">Specialization</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-none">Experience</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-none">Applied On</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-none">Status</TableHead>
              <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider border-none">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedApplications.map((application) => {
              let statusClass, statusText;
              switch (application.status.toLowerCase()) {
                case "interview completed":
                  statusClass = "bg-yellow-200 text-yellow-800";
                  statusText = "Interview Completed";
                  break;
                case "interview scheduled":
                  statusClass = "bg-green-200 text-green-800";
                  statusText = "Interview Scheduled";
                  break;
                case "not scheduled":
                  statusClass = "bg-purple-200 text-purple-800";
                  statusText = "Not Scheduled";
                  break;
                default:
                  statusClass = "bg-gray-200 text-gray-800";
                  statusText = application.status;
              }

              return (
                <TableRow key={application.id} className="bg-gray-800 hover:bg-gray-700 border-none">
                  <TableCell className="px-6 py-4 whitespace-nowrap border-none">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full"
                        src="https://via.placeholder.com/40"
                        alt={application.name}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{application.name}</div>
                        <div className="text-sm text-gray-400">{application.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-white border-none">{application.personalization?.data?.specialty || "N/A"}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-white border-none">{application.personalization?.data?.experience}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 border-none">{application.personalization?.createdAt }</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap border-none">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
                      {statusText}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium border-none">
                    {application.status.toLowerCase() === "interview completed" ? (
                      <>
                        <Button
                          className="text-indigo-400 hover:text-indigo-300 mr-3 transition-colors"
                          variant="ghost"
                          onClick={() => handleAction(application._id, "Approve")}
                        >
                          Approve
                        </Button>
                        <Button
                          className="text-red-400 hover:text-red-300 transition-colors"
                          variant="ghost"
                          onClick={() => handleAction(application._id, "Reject")}
                        >
                          Reject
                        </Button>
                      </>
                    ) : application.status.toLowerCase() === "interview scheduled" ? (
                      <Button
                        className="text-indigo-400 hover:text-indigo-300 transition-colors"
                        variant="ghost"
                        onClick={() => handleAction(application._id, "View Details")}
                      >
                        View Details
                      </Button>
                    ) : (
                      <Button
                        className="text-indigo-400 hover:text-indigo-300 transition-colors"
                        variant="ghost"
                        onClick={() => handleAction(application._id, "Schedule Review")}
                      >
                        Schedule Review
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
      <div className="flex justify-between items-center px-6 py-4 mt-4 bg-gray-800 rounded-lg">
        <div className="text-sm text-gray-400">
          Showing {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, applications.length)} of{" "}
          {applications.length} applications
        </div>
        <div className="flex space-x-2">
          <Button
            className="px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </Button>
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            className="px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PendingApplicationsTable;