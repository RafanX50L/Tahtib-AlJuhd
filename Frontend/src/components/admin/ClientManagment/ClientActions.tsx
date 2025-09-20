import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ClientActionsProps {
  onFilterClick: () => void;
  onExportClick: () => void;
  onStatusChange: (value: string) => void;
}

const ClientActions = ({  onStatusChange }: ClientActionsProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center space-x-4">
        <label htmlFor="client-status" className="text-sm text-gray-400">
          Show:
        </label>
        <Select onValueChange={onStatusChange}>
          <SelectTrigger className="bg-gray-700 text-white px-3 py-2 border-none rounded-md focus:ring-2 focus:ring-indigo-500 w-[180px]">
            <SelectValue placeholder="All Clients" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700 shadow-lg">
            <SelectItem value="all">All Clients</SelectItem>
            <SelectItem value="Active">Active Clients</SelectItem>
            <SelectItem value="Inactive">Inactive Clients</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ClientActions;