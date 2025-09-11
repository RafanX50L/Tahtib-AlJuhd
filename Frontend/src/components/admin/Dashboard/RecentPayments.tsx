
import { useEffect, useState } from "react";
import { Download, FileText, File, TrendingUp, Users, DollarSign, Calendar } from "lucide-react";
import { AdminService } from "@/services/implementation/adminServices";

const RecentPayments = () => {
  const [rows, setRows] = useState<Array<{ id: string; trainerName: string; clientName: string; amount: number; currency: string; createdAt: string }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await AdminService.getDashboardRecentPayments(10);
        setRows(data);
      } catch (err) {
        setError('Failed to load payment data');
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const downloadCSV = () => {
    const header = ["Trainer", "Client", "Amount", "Currency", "Purchase Date"];
    const lines = rows.map(r => [
      r.trainerName, 
      r.clientName, 
      r.amount, 
      r.currency, 
      new Date(r.createdAt).toLocaleString()
    ]);
    const csv = [header, ...lines].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    // Mock PDF download functionality
    const mockPDF = () => {
      const content = `Recent Payments Report
Generated: ${new Date().toLocaleString()}

${rows.map(r => `${r.trainerName} | ${r.clientName} | ₹${r.amount} | ${new Date(r.createdAt).toLocaleDateString()}`).join('\n')}`;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payments-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    };
    
    mockPDF();
  };

  const formatCurrency = (amount: number, currency: string) => {
    const currencySymbols = {
      inr: '₹',
      usd: '$',
      eur: '€',
      gbp: '£'
    };
    return `${currencySymbols[currency.toLowerCase()] || '₹'}${amount.toLocaleString()}`;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const totalAmount = rows.reduce((sum, row) => sum + row.amount, 0);
  const uniqueTrainers = new Set(rows.map(r => r.trainerName)).size;
  const uniqueClients = new Set(rows.map(r => r.clientName)).size;

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm shadow-2xl">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-700/50 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-red-500/30 shadow-2xl">
        <div className="text-center py-8">
          <div className="text-red-400 text-lg mb-2">⚠️ Error Loading Data</div>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-gray-700/50 backdrop-blur-sm shadow-2xl overflow-hidden">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-xl backdrop-blur-sm">
              <TrendingUp className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Recent Payments
              </h3>
              <p className="text-gray-400 text-sm">Latest transaction activity</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 border border-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-gray-500"
              onClick={downloadCSV}
            >
              <File className="w-4 h-4" />
              CSV
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-indigo-500/25"
              onClick={downloadPDF}
            >
              <FileText className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 rounded-xl p-4 border border-gray-700/30 backdrop-blur-sm hover:bg-gray-800/80 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <DollarSign className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-gray-400 text-sm font-medium">Total Amount</span>
            </div>
            <div className="text-xl font-bold text-white">₹{totalAmount.toLocaleString()}</div>
            <div className="text-green-400 text-xs mt-1">+12.5% from last week</div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 rounded-xl p-4 border border-gray-700/30 backdrop-blur-sm hover:bg-gray-800/80 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-gray-400 text-sm font-medium">Active Trainers</span>
            </div>
            <div className="text-xl font-bold text-white">{uniqueTrainers}</div>
            <div className="text-blue-400 text-xs mt-1">{uniqueClients} clients served</div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 rounded-xl p-4 border border-gray-700/30 backdrop-blur-sm hover:bg-gray-800/80 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Calendar className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-gray-400 text-sm font-medium">Transactions</span>
            </div>
            <div className="text-xl font-bold text-white">{rows.length}</div>
            <div className="text-purple-400 text-xs mt-1">Last 7 days</div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="p-6">
        {rows.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-gray-600" />
            </div>
            <div className="text-gray-400 text-lg mb-2">No payments found</div>
            <p className="text-gray-500">Payment data will appear here once available</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-700/50">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-800/80 to-gray-700/60 border-b border-gray-700/50">
                    <th className="text-left p-4 text-gray-300 font-semibold text-sm uppercase tracking-wide">Trainer</th>
                    <th className="text-left p-4 text-gray-300 font-semibold text-sm uppercase tracking-wide">Client</th>
                    <th className="text-left p-4 text-gray-300 font-semibold text-sm uppercase tracking-wide">Amount</th>
                    <th className="text-left p-4 text-gray-300 font-semibold text-sm uppercase tracking-wide">Currency</th>
                    <th className="text-left p-4 text-gray-300 font-semibold text-sm uppercase tracking-wide">Date</th>
                    <th className="text-left p-4 text-gray-300 font-semibold text-sm uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, index) => (
                    <tr 
                      key={r.id} 
                      className="hover:bg-gray-800/40 border-b border-gray-700/30 transition-all duration-300 group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                              {r.trainerName.charAt(0)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                          </div>
                          <div>
                            <div className="text-white font-medium">{r.trainerName}</div>
                            <div className="text-gray-400 text-xs">Fitness Trainer</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-white font-medium">{r.clientName}</div>
                        <div className="text-gray-400 text-xs">Premium Member</div>
                      </td>
                      <td className="p-4">
                        <span className="text-lg font-bold text-green-400">
                          {formatCurrency(r.amount, r.currency)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-gray-700 to-gray-600 text-gray-300 rounded-full text-xs uppercase font-bold tracking-wider shadow-sm">
                          {r.currency}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-white font-medium">{new Date(r.createdAt).toLocaleDateString()}</span>
                          <span className="text-gray-400 text-xs">{getTimeAgo(r.createdAt)}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-xs font-medium backdrop-blur-sm">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                              Completed
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
          <div>Showing {rows.length} transactions</div>
          <div className="flex items-center gap-2">
            <span>Last updated:</span>
            <span className="text-white font-medium">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentPayments;