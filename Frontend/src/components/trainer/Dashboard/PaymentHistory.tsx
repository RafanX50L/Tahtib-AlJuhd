import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaSearch, FaEye, FaEdit, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const PaymentHistory = () => {
  const paymentData = [
    { client: 'John Doe', amount: 150, date: 'Apr 15, 2025', status: 'paid' },
    { client: 'Jane Smith', amount: 200, date: 'Apr 12, 2025', status: 'pending' },
    { client: 'Mike Johnson', amount: 150, date: 'Apr 10, 2025', status: 'pending' },
    { client: 'Sarah Williams', amount: 125, date: 'Apr 8, 2025', status: 'paid' },
    { client: 'Robert Brown', amount: 175, date: 'Apr 5, 2025', status: 'paid' },
    { client: 'Emily Davis', amount: 225, date: 'Apr 3, 2025', status: 'pending' },
    { client: 'David Miller', amount: 150, date: 'Mar 30, 2025', status: 'paid' },
    { client: 'Jessica Wilson', amount: 180, date: 'Mar 27, 2025', status: 'pending' },
    { client: 'Thomas Taylor', amount: 200, date: 'Mar 25, 2025', status: 'paid' },
    { client: 'Jennifer Moore', amount: 160, date: 'Mar 22, 2025', status: 'paid' },
    { client: 'Daniel Anderson', amount: 190, date: 'Mar 20, 2025', status: 'paid' },
    { client: 'Lisa Martinez', amount: 175, date: 'Mar 18, 2025', status: 'pending' },
    { client: 'Paul Harris', amount: 145, date: 'Mar 15, 2025', status: 'paid' },
    { client: 'Michelle Lee', amount: 215, date: 'Mar 12, 2025', status: 'pending' },
    { client: 'Kevin Clark', amount: 185, date: 'Mar 10, 2025', status: 'paid' },
    { client: 'Karen Lewis', amount: 170, date: 'Mar 8, 2025', status: 'paid' },
    { client: 'Brian Walker', amount: 195, date: 'Mar 5, 2025', status: 'pending' },
    { client: 'Nancy Hall', amount: 160, date: 'Mar 3, 2025', status: 'paid' },
  ];

  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState(paymentData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    const filtered = paymentData.filter((payment) => {
      const matchesSearch = payment.client.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      let matchesTime = true;
      if (timeFilter === 'month' && !payment.date.includes('Apr')) matchesTime = false;
      else if (timeFilter === 'last-month' && !payment.date.includes('Mar')) matchesTime = false;
      else if (timeFilter === 'year' && !payment.date.includes('2025')) matchesTime = false;
      return matchesSearch && matchesStatus && matchesTime;
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, timeFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedData = filteredData.slice(start, end);

  const handlePageChange = (page:number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <Card className="bg-[#1e1e1e] border-[#2c2c2c] rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#6366f1]">Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[240px] relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b0b0b0]" />
            <Input
              className="pl-10 bg-[#121212] border-[#2c2c2c] text-[#ffffff] focus:border-[#6366f1] focus:ring-[#6366f1]/20"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="min-w-[150px] bg-[#121212] border-[#2c2c2c] text-[#ffffff] focus:border-[#6366f1] focus:ring-[#6366f1]/20">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#121212] border-[#2c2c2c] text-[#ffffff]">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="min-w-[150px] bg-[#121212] border-[#2c2c2c] text-[#ffffff] focus:border-[#6366f1] focus:ring-[#6366f1]/20">
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent className="bg-[#121212] border-[#2c2c2c] text-[#ffffff]">
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-[#2c2c2c]">
                <TableHead className="text-[#b0b0b0] text-xs uppercase">Client</TableHead>
                <TableHead className="text-[#b0b0b0] text-xs uppercase">Amount</TableHead>
                <TableHead className="text-[#b0b0b0] text-xs uppercase">Date</TableHead>
                <TableHead className="text-[#b0b0b0] text-xs uppercase">Status</TableHead>
                <TableHead className="text-[#b0b0b0] text-xs uppercase">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((payment) => (
                <TableRow key={`${payment.client}-${payment.date}`} className="hover:bg-white/5 border-[#2c2c2c]">
                  <TableCell
                    data-label="Client"
                    className="text-sm max-sm:block max-sm:border-none text-[#ffffff] max-sm:border-b max-sm:border-[#ffffff00] max-sm:pl-[40%] max-sm:pr-4 max-sm:py-2 max-sm:text-right max-sm:before:content-['Client'] max-sm:before:absolute max-sm:before:left-4 max-sm:before:w-[35%] max-sm:before:pr-4 max-sm:before:whitespace-nowrap max-sm:before:font-semibold max-sm:before:text-[#b0b0b0] max-sm:before:text-left"
                  >
                    {payment.client}
                  </TableCell>
                  <TableCell
                    data-label="Amount"
                    className="text-sm max-sm:block max-sm:border-none text-[#ffffff] max-sm:border-b max-sm:border-[#2c2c2c] max-sm:pl-[40%] max-sm:pr-4 max-sm:py-2 max-sm:text-right max-sm:before:content-['Amount'] max-sm:before:absolute max-sm:before:left-4 max-sm:before:w-[35%] max-sm:before:pr-4 max-sm:before:whitespace-nowrap max-sm:before:font-semibold max-sm:before:text-[#b0b0b0] max-sm:before:text-left"
                  >
                    ${payment.amount}
                  </TableCell>
                  <TableCell
                    data-label="Date"
                    className="text-sm max-sm:block max-sm:border-none text-[#ffffff] max-sm:border-b max-sm:border-[#2c2c2c] max-sm:pl-[40%] max-sm:pr-4 max-sm:py-2 max-sm:text-right max-sm:before:content-['Date'] max-sm:before:absolute max-sm:before:left-4 max-sm:before:w-[35%] max-sm:before:pr-4 max-sm:before:whitespace-nowrap max-sm:before:font-semibold max-sm:before:text-[#b0b0b0] max-sm:before:text-left"
                  >
                    {payment.date}
                  </TableCell>
                  <TableCell
                    data-label="Status"
                    className="text-sm max-sm:block max-sm:border-none max-sm:border-b max-sm:border-[#2c2c2c] max-sm:pl-[40%] max-sm:pr-4 max-sm:py-2 max-sm:text-right max-sm:before:content-['Status'] max-sm:before:absolute max-sm:before:left-4 max-sm:before:w-[35%] max-sm:before:pr-4 max-sm:before:whitespace-nowrap max-sm:before:font-semibold max-sm:before:text-[#b0b0b0] max-sm:before:text-left"
                  >
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'paid'
                          ? 'bg-[#10b981]/20 text-[#10b981]'
                          : payment.status === 'pending'
                          ? 'bg-[#f59e0b]/20 text-[#f59e0b]'
                          : 'bg-[#ef4444]/20 text-[#ef4444]'
                      }`}
                    >
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell
                    data-label="Actions"
                    className="text-sm flex gap-2 justify-end max-sm:flex max-sm:gap-2 max-sm:justify-end max-sm:pl-4 max-sm:border-none max-sm:before:content-['Actions'] max-sm:before:mr-auto max-sm:before:font-semibold max-sm:before:text-[#b0b0b0]"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-[#2c2c2c] text-[#ffffff] hover:bg-[#6366f1]/10 hover:border-[#6366f1] hover:text-[#6366f1]"
                      title="View Details"
                    >
                      <FaEye />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-[#2c2c2c] text-[#ffffff] hover:bg-[#6366f1]/10 hover:border-[#6366f1] hover:text-[#6366f1]"
                      title="Edit Payment"
                    >
                      <FaEdit />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-center items-center mt-6 gap-2 flex-wrap">
          <div className="text-sm text-[#b0b0b0] mr-auto">
            Showing {start + 1}-{Math.min(end, filteredData.length)} of {filteredData.length} payments
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-[#121212] border-[#2c2c2c] text-[#ffffff] hover:bg-[#6366f1]/10 hover:text-[#6366f1] disabled:opacity-50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaChevronLeft />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              className={`min-w-[2.5rem] ${
                currentPage === page
                  ? 'bg-[#6366f1] text-white border-[#6366f1]'
                  : 'bg-[#121212] border-[#2c2c2c] text-[#ffffff] hover:bg-[#6366f1]/10 hover:text-[#6366f1]'
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="bg-[#121212] border-[#2c2c2c] text-[#ffffff] hover:bg-[#6366f1]/10 hover:text-[#6366f1] disabled:opacity-50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FaChevronRight />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;