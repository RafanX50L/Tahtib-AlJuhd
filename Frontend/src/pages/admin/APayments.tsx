import AdminLayout from "@/components/admin/AdminLayout";
import { useEffect, useMemo, useState } from "react";
import { AdminService } from "@/services/implementation/adminServices";
import { DollarSign } from "lucide-react";

type PaymentRow = {
  id: string;
  trainerId: string;
  trainerName: string;
  clientId: string;
  clientName: string;
  amount: number;
  currency: string;
  createdAt: string;
  planTitle?: string;
};

const formatCurrency = (amount: number, currency: string) => {
  const currencySymbols: Record<string, string> = {
    inr: "₹",
    usd: "$",
    eur: "€",
    gbp: "£",
  };
  return `${(currencySymbols as Record<string, string>)[currency.toLowerCase()] || "₹"}${amount.toLocaleString()}`;
};

const APayments = () => {
  const [rows, setRows] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch a generous number and paginate client-side for now
        const data = await AdminService.getDashboardRecentPayments(200);
        // latest first
        const sorted = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRows(sorted);
      } catch {
        setError("Failed to load payments");
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(rows.length / pageSize)), [rows.length, pageSize]);
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page, pageSize]);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <AdminLayout title="Payments">
        
        <div className="px-0 sm:px-0">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-gray-700/50 backdrop-blur-sm shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-xl backdrop-blur-sm">
                  <DollarSign className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Payments</h3>
                  <p className="text-gray-400 text-sm">All transactions (latest first)</p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-700 rounded w-1/3 mb-6"></div>
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-12 bg-gray-700/50 rounded"></div>
                    ))}
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-12 text-gray-400">{error}</div>
              ) : rows.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-8 text-gray-600" />
                  </div>
                  <div className="text-gray-400 text-lg mb-2">No payments found</div>
                  <p className="text-gray-500">Payment data will appear here once available</p>
                </div>
              ) : (
                <>
                  <div className="overflow-hidden rounded-xl border border-gray-700/50">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[720px]">
                        <thead>
                          <tr className="bg-gradient-to-r from-gray-800/80 to-gray-700/60 border-b border-gray-700/50">
                            <th className="text-left p-4 text-gray-300 font-semibold text-sm uppercase tracking-wide">Trainer</th>
                            <th className="text-left p-4 text-gray-300 font-semibold text-sm uppercase tracking-wide">Client</th>
                            <th className="text-left p-4 text-gray-300 font-semibold text-sm uppercase tracking-wide">Amount</th>
                            <th className="text-left p-4 text-gray-300 font-semibold text-sm uppercase tracking-wide">Currency</th>
                            <th className="text-left p-4 text-gray-300 font-semibold text-sm uppercase tracking-wide">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pageRows.map((r) => (
                            <tr key={r.id} className="hover:bg-gray-800/40 border-b border-gray-700/30 transition-all duration-300">
                              <td className="p-4">
                                <div className="text-white font-medium">{r.trainerName}</div>
                                <div className="text-gray-400 text-xs">{r.planTitle || "Fitness Trainer"}</div>
                              </td>
                              <td className="p-4">
                                <div className="text-white font-medium">{r.clientName}</div>
                                <div className="text-gray-400 text-xs">Premium Member</div>
                              </td>
                              <td className="p-4">
                                <span className="text-lg font-bold text-green-400">{formatCurrency(r.amount, r.currency)}</span>
                              </td>
                              <td className="p-4">
                                <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-gray-700 to-gray-600 text-gray-300 rounded-full text-xs uppercase font-bold tracking-wider shadow-sm">
                                  {r.currency}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex flex-col gap-1">
                                  <span className="text-white font-medium">{new Date(r.createdAt).toLocaleDateString()}</span>
                                  <span className="text-gray-400 text-xs">{new Date(r.createdAt).toLocaleTimeString()}</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-400">
                    <div>
                      Showing {(page - 1) * pageSize + 1}
                      -{Math.min(page * pageSize, rows.length)} of {rows.length}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="px-3 py-1.5 rounded bg-gray-800 text-white disabled:opacity-50 border border-gray-700"
                        onClick={goPrev}
                        disabled={page === 1}
                      >
                        Previous
                      </button>
                      <span className="px-2">Page {page} / {totalPages}</span>
                      <button
                        className="px-3 py-1.5 rounded bg-gray-800 text-white disabled:opacity-50 border border-gray-700"
                        onClick={goNext}
                        disabled={page === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
    </AdminLayout>
  );
};

export default APayments;


