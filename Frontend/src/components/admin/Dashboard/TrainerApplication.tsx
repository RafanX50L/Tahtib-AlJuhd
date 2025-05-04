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

interface Application {
  name: string;
  email: string;
  specialization: string;
  experience: string;
  appliedOn: string;
  status: string;
  statusColor: string;
  actions: string[];
}

const TrainerApplications = () => {
  const applications: Application[] = [
    {
      name: "Michael Johnson",
      email: "michael.j@example.com",
      specialization: "Strength Training",
      experience: "7 years",
      appliedOn: "April 8, 2025",
      status: "Interview completed",
      statusColor: "yellow",
      actions: ["Approve", "Reject"],
    },
    {
      name: "Sarah Miller",
      email: "sarah.m@example.com",
      specialization: "Yoga & Pilates",
      experience: "5 years",
      appliedOn: "April 7, 2025",
      status: "Interview Scheduled",
      statusColor: "green",
      actions: ["View Details"],
    },
    {
      name: "David Chen",
      email: "david.c@example.com",
      specialization: "CrossFit",
      experience: "3 years",
      appliedOn: "April 5, 2025",
      status: "Not Scheduled",
      statusColor: "purple",
      actions: ["Schedule Review"],
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          Pending Trainer Applications
        </h2>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          View All Applications
        </Button>
      </div>
      <Card className="bg-gray-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-800 hover:bg-gray-800">
              <TableHead className="text-gray-300">Trainer</TableHead>
              <TableHead className="text-gray-300">Specialization</TableHead>
              <TableHead className="text-gray-300">Experience</TableHead>
              <TableHead className="text-gray-300">Applied On</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app, index) => (
              <TableRow key={index} className="bg-gray-800 hover:bg-gray-700">
                <TableCell>
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-full"
                      src="https://via.placeholder.com/40"
                      alt=""
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">
                        {app.name}
                      </div>
                      <div className="text-sm text-gray-400">{app.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-white">{app.specialization}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-white">{app.experience}</div>
                </TableCell>
                <TableCell className="text-sm text-gray-400">
                  {app.appliedOn}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${app.statusColor}-100 text-${app.statusColor}-800`}
                  >
                    {app.status}
                  </span>
                </TableCell>
                <TableCell className="text-right text-sm font-medium">
                  {app.actions.map((action, idx) => (
                    <Button
                      key={idx}
                      className={`mr-3 ${
                        action === "Approve" || action === "View Details" || action === "Schedule Review"
                          ? "text-indigo-400 hover:text-indigo-300"
                          : "text-red-400 hover:text-red-300"
                      }`}
                      variant="ghost"
                    >
                      {action}
                    </Button>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default TrainerApplications;