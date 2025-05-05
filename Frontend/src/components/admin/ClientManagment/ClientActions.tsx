import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Filter } from "lucide-react";

interface ClientActionsProps {
  onFilterClick: () => void;
  onExportClick: () => void;
  onStatusChange: (value: string) => void;
}

const ClientActions = ({ onFilterClick, onExportClick, onStatusChange }: ClientActionsProps) => {
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
        <label htmlFor="client-status" className="text-sm text-gray-400">
          Show:
        </label>
        <Select onValueChange={onStatusChange}>
          <SelectTrigger className="bg-gray-700 text-white px-3 py-2 border-none rounded-md focus:ring-2 focus:ring-indigo-500 w-[180px]">
            <SelectValue className="text-[#ffff]" placeholder="All Clients" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700 shadow-lg">
            <SelectItem value="all">All Clients</SelectItem>
            <SelectItem value="active">Active Clients</SelectItem>
            <SelectItem value="inactive">Inactive Clients</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ClientActions;