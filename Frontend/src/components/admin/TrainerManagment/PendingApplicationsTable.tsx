// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { ITrainerWithPersonalization } from "@/pages/admin/ATrainerManagment";
// import { Dispatch } from "@reduxjs/toolkit";
// import { AdminService } from "@/services/implementation/adminServices";

// interface trainer{
//   trainer:ITrainerWithPersonalization[]

// }

// const PendingApplicationsTable : React.FC<trainer> =  () => {
//   // console.log('pending trainers',trainer);
//   const [applications,setApplication] = useState<ITrainerWithPersonalization[] | null>(null);

//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(()=>{
//     const fetechData = async ()=>{
//       const trainers = await AdminService.getPendingTrainers(currentPage);
//       console.log('fetched pending tainers',trainers);
//       setApplication(trainers.data);
//     }
//     fetechData();
//   },[])

//   const handleAction = (id: number, action: string) => {
//     alert(`${action} action for application ID ${id}`);
//   };

//   return (
//     <div className="mb-8 mt-8">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-xl font-bold text-white">Pending Trainer Applications</h2>
//       </div>
//       <Card className="bg-gray-800 rounded-lg overflow-hidden border-none">
//         <Table className="border-none">
//           <TableHeader>
//             <TableRow className="bg-gray-900 hover:bg-gray-900 border-none">
//               <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-none">Trainer</TableHead>
//               <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-none">Specialization</TableHead>
//               <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-none">Experience</TableHead>
//               <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-none">Applied On</TableHead>
//               <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-none">Status</TableHead>
//               <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider border-none">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {paginatedApplications.map((application) => {
//               let statusClass, statusText;
//               switch (application.status.toLowerCase()) {
//                 case "interview completed":
//                   statusClass = "bg-yellow-200 text-yellow-800";
//                   statusText = "Interview Completed";
//                   break;
//                 case "interview scheduled":
//                   statusClass = "bg-green-200 text-green-800";
//                   statusText = "Interview Scheduled";
//                   break;
//                 case "not scheduled":
//                   statusClass = "bg-purple-200 text-purple-800";
//                   statusText = "Not Scheduled";
//                   break;
//                 default:
//                   statusClass = "bg-gray-200 text-gray-800";
//                   statusText = application.status;
//               }

//               return (
//                 <TableRow key={application._id+'1'} className="bg-gray-800 hover:bg-gray-700 border-none">
//                   <TableCell className="px-6 py-4 whitespace-nowrap border-none">
//                     <div className="flex items-center">
//                       <img
//                         className="h-10 w-10 rounded-full"
//                         src="https://via.placeholder.com/40"
//                         alt={application.personalization?.data?.basicInfo?.profilePhotoId}
//                       />
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-white">{application.name}</div>
//                         <div className="text-sm text-gray-400">{application.email}</div>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-white border-none">{application.personalization?.data?.professionalSummary?.specializations || "N/A"}</TableCell>
//                   <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-white border-none">{application.personalization?.data?.professionalSummary?.yearsOfExperience}</TableCell>
//                   <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 border-none">{application.personalization?.data?.createdAt }</TableCell>
//                   <TableCell className="px-6 py-4 whitespace-nowrap border-none">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
//                       {statusText}
//                     </span>
//                   </TableCell>
//                   <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium border-none">
//                     {application.status.toLowerCase() === "interview completed" ? (
//                       <>
//                         <Button
//                           className="text-indigo-400 hover:text-indigo-300 mr-3 transition-colors"
//                           variant="ghost"
//                           onClick={() => handleAction(application._id, "Approve")}
//                         >
//                           Approve
//                         </Button>
//                         <Button
//                           className="text-red-400 hover:text-red-300 transition-colors"
//                           variant="ghost"
//                           onClick={() => handleAction(application._id, "Reject")}
//                         >
//                           Reject
//                         </Button>
//                       </>
//                     ) : application.status.toLowerCase() === "interview scheduled" ? (
//                       <Button
//                         className="text-indigo-400 hover:text-indigo-300 transition-colors"
//                         variant="ghost"
//                         onClick={() => handleAction(application._id, "View Details")}
//                       >
//                         View Details
//                       </Button>
//                     ) : (
//                       <Button
//                         className="text-indigo-400 hover:text-indigo-300 transition-colors"
//                         variant="ghost"
//                         onClick={() => handleAction(application._id, "Schedule Review")}
//                       >
//                         Schedule Review
//                       </Button>
//                     )}
//                   </TableCell>
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </Card>
//       <div className="flex justify-between items-center px-6 py-4 mt-4 bg-gray-800 rounded-lg">
//         <div className="text-sm text-gray-400">
//           Showing {(currentPage - 1) * itemsPerPage + 1}-
//           {Math.min(currentPage * itemsPerPage, applications.length)} of{" "}
//           {applications.length} applications
//         </div>
//         <div className="flex space-x-2">
//           <Button
//             className="px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((prev) => prev - 1)}
//           >
//             Previous
//           </Button>
//           <div className="flex space-x-2">
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <Button
//                 key={page}
//                 className={`px-3 py-1 rounded-md ${
//                   currentPage === page
//                     ? "bg-indigo-600 text-white shadow-sm"
//                     : "bg-gray-700 text-white hover:bg-gray-600"
//                 }`}
//                 onClick={() => setCurrentPage(page)}
//               >
//                 {page}
//               </Button>
//             ))}
//           </div>
//           <Button
//             className="px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage((prev) => prev + 1)}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PendingApplicationsTable;]

import { useEffect, useState } from "react";
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
import { AdminService } from "@/services/implementation/adminServices";

const PendingApplicationsTable: React.FC = () => {
  const [applications, setApplications] = useState<
    ITrainerWithPersonalization[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      const trainers = await AdminService.getPendingTrainers(currentPage);
      console.log("fetched pending trainers", trainers);
      setApplications(Array.isArray(trainers.data) ? trainers.data : []);
    };
    fetchData();
  }, [currentPage]);

  const handleAction = (id: string, action: string) => {
    alert(`${action} action for application ID ${id}`);
  };

  const totalPages = Math.ceil(applications.length / itemsPerPage);
  const paginatedApplications = applications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mb-8 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          Pending Trainer Applications
        </h2>
      </div>
      <Card className="bg-gray-800 rounded-lg overflow-hidden border-none">
        <Table className="border-none">
          <TableHeader>
            <TableRow className="bg-gray-900 hover:bg-gray-900 border-none">
              <TableHead className="text-gray-400">Trainer</TableHead>
              <TableHead className="text-gray-400">Specialization</TableHead>
              <TableHead className="text-gray-400">Experience</TableHead>
              <TableHead className="text-gray-400">Applied On</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedApplications.map((application) => {
              const status =
                application.personalization?.data?.status || "unknown";

              let statusClass = "bg-gray-200 text-gray-800";
              let statusText =
                application.personalization?.data?.status || "Unknown";

              if (status === "interview completed") {
                statusClass = "bg-yellow-200 text-yellow-800";
                statusText = "Interview Completed";
              } else if (status === "interview scheduled") {
                statusClass = "bg-green-200 text-green-800";
                statusText = "Interview Scheduled";
              } else if (status === "not scheduled") {
                statusClass = "bg-purple-200 text-purple-800";
                statusText = "Not Scheduled";
              }

              return (
                <TableRow
                  key={application._id}
                  className="bg-gray-800 hover:bg-gray-700"
                >
                  <TableCell>
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={
                          application.personalization?.data?.basicInfo
                            ?.profilePhoto?.[0]?.filePath ||
                          "/default-profile.jpg"
                        }
                        alt="Profile"
                      />

                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {application.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {application.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-white">
                    {application.personalization?.data?.professionalSummary?.specializations?.join(
                      ", "
                    ) || "N/A"}
                  </TableCell>
                  <TableCell className="text-white">
                    {application.personalization?.data?.professionalSummary
                      ?.yearsOfExperience ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {new Date(
                      application.personalization?.createdAt ||
                        application.createdAt
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClass}`}
                    >
                      {statusText}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {status === "interview completed" ? (
                      <>
                        <Button
                          variant="ghost"
                          onClick={() =>
                            handleAction(application._id, "Approve")
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() =>
                            handleAction(application._id, "Reject")
                          }
                        >
                          Reject
                        </Button>
                      </>
                    ) : status === "interview scheduled" ? (
                      <Button
                        variant="ghost"
                        onClick={() =>
                          handleAction(application._id, "View Details")
                        }
                      >
                        View Details
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        onClick={() =>
                          handleAction(application._id, "Schedule Review")
                        }
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
          Showing {(currentPage - 1) * itemsPerPage + 1}–
          {Math.min(currentPage * itemsPerPage, applications.length)} of{" "}
          {applications.length} applications
        </div>
        <div className="flex space-x-2">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              className={currentPage === page ? "bg-indigo-600 text-white" : ""}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
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
