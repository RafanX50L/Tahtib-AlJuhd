import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Download } from "lucide-react";

interface TrainerActionsProps {
  onFilterClick: () => void;
  onExportClick: () => void;
  onStatusChange: (value: string) => void;
}

const TrainerActions = ({ onFilterClick, onExportClick, onStatusChange }: TrainerActionsProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex space-x-4">
        <Button
          className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center transition-colors"
          onClick={onFilterClick}
        >
          <Filter className="w-4 h-4 mr-2 text-white" />
          Filter
        </Button>
        <Button
          className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center transition-colors"
          onClick={onExportClick}
        >
          <Download className="w-4 h-4 mr-2 text-white" />
          Export
        </Button>
      </div>
      <div className="flex items-center space-x-4">
        <label htmlFor="trainer-status" className="text-sm text-gray-400">
          Show:
        </label>
        <Select onValueChange={onStatusChange}>
          <SelectTrigger className="bg-gray-700 text-white px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 w-[180px]">
            <SelectValue placeholder="All Approved Trainers" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700 shadow-lg">
            <SelectItem value="all">All Approved Trainers</SelectItem>
            <SelectItem value="active">Active Trainers</SelectItem>
            <SelectItem value="inactive">Inactive Trainers</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TrainerActions;