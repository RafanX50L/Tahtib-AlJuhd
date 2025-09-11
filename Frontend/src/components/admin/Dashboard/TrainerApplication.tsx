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
import { AdminService } from "@/services/implementation/adminServices";
import { Link, useNavigate } from "react-router-dom";

interface ApplicationRow {
  id: string;
  name: string;
  email?: string;
  specialization: string;
  experience: string;
  appliedOn: string;
  status: string;
}

const TrainerApplications = () => {
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await AdminService.getPendingTrainers(1, 5, "");
        const rows = (res.data?.data?.trainers || []).map((t: { id: string; name: string; email?: string; specializations?: string[]; yearsOfExperience?: number; appliedOn?: string; status?: string; }) => ({
          id: t.id,
          name: t.name,
          email: t.email,
          specialization: t.specializations?.[0] || "-",
          experience: t.yearsOfExperience ? `${t.yearsOfExperience} years` : "-",
          appliedOn: t.appliedOn ? new Date(t.appliedOn).toLocaleDateString() : "-",
          status: t.status || "Pending",
        }));
        setApplications(rows);
      } catch {
        setApplications([]);
      }
    })();
  }, []);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          Pending Trainer Applications
        </h2>
        <Link to="/admin/trainer-management">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            View All Applications
          </Button>
        </Link>
      </div>
      <Card className="bg-gray-800 overflow-hidden border-none">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-800 hover:bg-gray-800 ">
              <TableHead className="text-gray-300">Trainer</TableHead>
              <TableHead className="text-gray-300">Specialization</TableHead>
              <TableHead className="text-gray-300">Experience</TableHead>
              <TableHead className="text-gray-300">Applied On</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id} className=" border-none bg-gray-800 hover:bg-gray-700">
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
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800`}
                  >
                    {app.status}
                  </span>
                </TableCell>
                <TableCell className="text-right text-sm font-medium">
                  <Button
                    className="mr-3 text-indigo-400 hover:text-indigo-300"
                    variant="ghost"
                    onClick={() => navigate('/admin/trainer-management')}
                  >
                    Review
                  </Button>
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