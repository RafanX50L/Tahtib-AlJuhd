// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { JSX, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { format } from "date-fns";
// import {
// //   LineChart, 
// //   Line, 
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   ResponsiveContainer,
//   Area,
//   AreaChart
// } from "recharts";
// import { 
//   Calendar, 
//   TrendingDown, 
//   TrendingUp, 
//   Target, 
//   Plus, 
//   Activity, 
//   Scale, 
//   Ruler,
//   BarChart3,
//   Filter
// } from "lucide-react";

// // TypeScript interfaces
// interface ProgressEntry {
//   date: string;
//   weight: number;
//   height: number;
//   bmi: string;
//   bmiCategory: string;
// }

// interface BMIResult {
//   bmi: string;
//   category: string;
// }

// interface AddProgressParams {
//   weight: number;
//   height: number;
//   date: string;
// }

// type FilterType = "last10" | "month" | "custom";

// // MOCK SERVER
// let mockDB: ProgressEntry[] = [
//   { date: "2025-08-10", weight: 92, height: 176, bmi: "29.70", bmiCategory: "Overweight" },
//   { date: "2025-08-17", weight: 91, height: 176, bmi: "29.38", bmiCategory: "Overweight" },
//   { date: "2025-08-25", weight: 89, height: 176, bmi: "28.73", bmiCategory: "Overweight" },
//   { date: "2025-09-01", weight: 88, height: 176, bmi: "28.41", bmiCategory: "Overweight" },
//   { date: "2025-09-08", weight: 87.5, height: 176, bmi: "28.25", bmiCategory: "Overweight" },
//   { date: "2025-09-10", weight: 87, height: 176, bmi: "28.08", bmiCategory: "Overweight" }
// ];

// // API functions
// const mockFetchProgress = (): Promise<ProgressEntry[]> => {
//   return new Promise(resolve => 
//     setTimeout(() => resolve([...mockDB]), 300)
//   );
// };

// const mockAddProgress = ({ weight, height, date }: AddProgressParams): Promise<ProgressEntry[]> => {
//   const { bmi, category } = calculateBMI(weight, height);
//   mockDB.push({
//     date,
//     weight,
//     height,
//     bmi,
//     bmiCategory: category,
//   });
//   mockDB = [...mockDB].sort((a, b) => a.date.localeCompare(b.date));
//   return new Promise(resolve => 
//     setTimeout(() => resolve([...mockDB]), 200)
//   );
// };

// const calculateBMI = (weight: number, height: number): BMIResult => {
//   const bmi = weight / ((height / 100) * (height / 100));
//   let category = "";
//   if (bmi < 18.5) category = "Underweight";
//   else if (bmi < 25) category = "Normal weight";
//   else if (bmi < 30) category = "Overweight";
//   else category = "Obese";
//   return { bmi: bmi.toFixed(2), category };
// };

// // Helper function to get BMI category color
// const getBMIColor = (category: string): string => {
//   switch (category) {
//     case "Underweight": return "text-blue-400";
//     case "Normal weight": return "text-[#00D68F]";
//     case "Overweight": return "text-[#FF9F43]";
//     case "Obese": return "text-[#FF4757]";
//     default: return "text-[#A0A7B8]";
//   }
// };

// const getBMIBadgeVariant = (category: string): "default" | "secondary" | "destructive" | "outline" => {
//   switch (category) {
//     case "Normal weight": return "default";
//     case "Underweight": return "secondary";
//     case "Overweight": return "outline";
//     case "Obese": return "destructive";
//     default: return "outline";
//   }
// };

// const getBMIGradient = (category: string): string => {
//   switch (category) {
//     case "Normal weight": return "from-[#00D68F]/20 to-[#33DEAC]/20 border-[#00D68F]/30";
//     case "Underweight": return "from-[#5D5FEF]/20 to-[#7577F5]/20 border-[#5D5FEF]/30";
//     case "Overweight": return "from-[#FF9F43]/20 to-[#FFBB33]/20 border-[#FF9F43]/30";
//     case "Obese": return "from-[#FF4757]/20 to-[#FF6B7A]/20 border-[#FF4757]/30";
//     default: return "from-[#2A3042]/20 to-[#2A3042]/10 border-[#2A3042]/30";
//   }
// };

// export default function ProgressPage(): JSX.Element {
//   const queryClient = useQueryClient();

//   // State management with proper TypeScript types
//   const [filter, setFilter] = useState<FilterType>("last10");
//   const [startDate, setStartDate] = useState<Date | null>(null);
//   const [endDate, setEndDate] = useState<Date | null>(null);
//   const [dialogOpen, setDialogOpen] = useState<boolean>(false);
//   const [inputWeight, setInputWeight] = useState<string>("");
//   const [inputHeight, setInputHeight] = useState<string>("");
//   const [inputDate, setInputDate] = useState<Date | null>(new Date());

//   // React Query hooks
//   const { data, isLoading, isError } = useQuery<ProgressEntry[]>({
//     queryKey: ["progress"],
//     queryFn: mockFetchProgress,
//   });

//   const mutation = useMutation<ProgressEntry[], Error, AddProgressParams>({
//     mutationFn: mockAddProgress,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["progress"] });
//     }
//   });

//   // Event handlers
//   const handleAdd = (): void => {
//     if (!inputWeight || !inputHeight || !inputDate) return;
    
//     const dateStr = format(inputDate, "yyyy-MM-dd");
//     if (data?.some(d => d.date === dateStr)) return;
    
//     mutation.mutate({
//       weight: parseFloat(inputWeight),
//       height: parseFloat(inputHeight),
//       date: dateStr
//     });
    
//     setDialogOpen(false);
//     setInputWeight("");
//     setInputHeight("");
//     setInputDate(new Date());
//   };

//   // Data filtering logic
//   let filteredData = data ?? [];
//   if (filter === "last10") {
//     filteredData = filteredData.slice(-10);
//   } else if (filter === "month") {
//     const oneMonthAgo = new Date();
//     oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
//     filteredData = filteredData.filter(d => new Date(d.date) >= oneMonthAgo);
//   } else if (filter === "custom" && startDate && endDate) {
//     filteredData = filteredData.filter(d => {
//       const dDate = new Date(d.date);
//       return dDate >= startDate && dDate <= endDate;
//     });
//   }

//   const lastEntry = filteredData[filteredData.length - 1];
//   const previousEntry = filteredData[filteredData.length - 2];
//   const weightChange = lastEntry && previousEntry 
//     ? lastEntry.weight - previousEntry.weight 
//     : 0;

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-[#12151E] flex items-center justify-center">
//         <div className="flex items-center gap-3">
//           <div className="w-8 h-8 border-3 border-[#5D5FEF]/30 border-t-[#5D5FEF] rounded-full animate-spin"></div>
//           <span className="text-white text-lg">Loading your progress...</span>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="min-h-screen bg-[#12151E] flex items-center justify-center">
//         <div className="text-center">
//           <Activity className="h-16 w-16 text-[#FF4757] mx-auto mb-4" />
//           <div className="text-white text-xl">Error loading progress data</div>
//           <p className="text-[#A0A7B8] mt-2">Please try refreshing the page</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#12151E] text-white">
//       <div className="max-w-7xl mx-auto px-4 py-8">

//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* LEFT Side: Current Progress & Stats */}
//           <div className="lg:col-span-1 space-y-6">
//             {/* Current Stats Card */}
//             <div className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border border-[#2A3042] rounded-2xl shadow-lg overflow-hidden">
//               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5D5FEF] to-[#FF4757]"></div>
//               <div className="p-6">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-10 h-10 bg-gradient-to-r from-[#5D5FEF] to-[#FF4757] rounded-full flex items-center justify-center">
//                     <Activity className="h-5 w-5 text-white" />
//                   </div>
//                   <h2 className="text-lg font-semibold text-white">Current Stats</h2>
//                 </div>

//                 <div className="space-y-4">
//                   {/* Weight & Height Grid */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="bg-gradient-to-r from-[#5D5FEF]/20 to-[#7577F5]/20 border border-[#5D5FEF]/30 rounded-xl p-4 text-center">
//                       <div className="w-8 h-8 bg-[#5D5FEF]/20 rounded-lg flex items-center justify-center mx-auto mb-2">
//                         <Scale className="h-4 w-4 text-[#5D5FEF]" />
//                       </div>
//                       <div className="text-2xl font-bold text-white">{lastEntry?.weight || "--"}</div>
//                       <div className="text-sm text-[#A0A7B8]">Weight (kg)</div>
//                     </div>
                    
//                     <div className="bg-gradient-to-r from-[#FF4757]/20 to-[#FF6B7A]/20 border border-[#FF4757]/30 rounded-xl p-4 text-center">
//                       <div className="w-8 h-8 bg-[#FF4757]/20 rounded-lg flex items-center justify-center mx-auto mb-2">
//                         <Ruler className="h-4 w-4 text-[#FF4757]" />
//                       </div>
//                       <div className="text-2xl font-bold text-white">{lastEntry?.height || "--"}</div>
//                       <div className="text-sm text-[#A0A7B8]">Height (cm)</div>
//                     </div>
//                   </div>

//                   {/* BMI Section */}
//                   <div className={`bg-gradient-to-r ${lastEntry?.bmiCategory ? getBMIGradient(lastEntry.bmiCategory) : getBMIGradient("default")} rounded-xl p-4 border backdrop-blur-sm`}>
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="flex items-center gap-2">
//                         <Target className="h-4 w-4 text-white" />
//                         <span className="text-sm font-medium text-white">BMI Index</span>
//                       </div>
//                       {lastEntry?.bmiCategory && (
//                         <Badge 
//                           variant={getBMIBadgeVariant(lastEntry.bmiCategory)} 
//                           className="text-xs bg-white/20 text-white border-white/30"
//                         >
//                           {lastEntry.bmiCategory}
//                         </Badge>
//                       )}
//                     </div>
//                     <div className={`text-3xl font-bold ${lastEntry?.bmiCategory ? getBMIColor(lastEntry.bmiCategory) : 'text-[#A0A7B8]'}`}>
//                       {lastEntry?.bmi || "--"}
//                     </div>
//                   </div>

//                   {/* Weight Change Indicator */}
//                   {weightChange !== 0 && (
//                     <div className="bg-[rgba(42,48,66,0.3)] border border-[#2A3042] rounded-xl p-4">
//                       <div className="flex items-center justify-center gap-2">
//                         {weightChange > 0 ? (
//                           <TrendingUp className="h-4 w-4 text-[#FF4757]" />
//                         ) : (
//                           <TrendingDown className="h-4 w-4 text-[#00D68F]" />
//                         )}
//                         <span className={`text-sm font-medium ${weightChange > 0 ? 'text-[#FF4757]' : 'text-[#00D68F]'}`}>
//                           {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg from last entry
//                         </span>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <div className="mt-6">
//                   <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//                     <DialogTrigger asChild>
//                       <Button className="w-full bg-gradient-to-r from-[#5D5FEF] to-[#FF4757] hover:from-[#7577F5] hover:to-[#FF6B7A] text-white shadow-lg">
//                         <Plus className="h-4 w-4 mr-2" />
//                         Add New Entry
//                       </Button>
//                     </DialogTrigger>
//                     <DialogContent className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border border-[#2A3042] text-white max-w-md">
//                       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5D5FEF] to-[#FF4757]"></div>
//                       <DialogHeader className="pt-4">
//                         <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
//                           <div className="w-8 h-8 bg-gradient-to-r from-[#5D5FEF] to-[#FF4757] rounded-full flex items-center justify-center">
//                             <Plus className="h-4 w-4 text-white" />
//                           </div>
//                           Add Progress Entry
//                         </DialogTitle>
//                       </DialogHeader>
//                       <div className="space-y-4">
//                         <div>
//                           <Label htmlFor="weight" className="text-[#A0A7B8] flex items-center gap-2 mb-2">
//                             <Scale className="h-4 w-4" />
//                             Weight (kg)
//                           </Label>
//                           <Input
//                             id="weight"
//                             type="number"
//                             min="1"
//                             step="0.1"
//                             value={inputWeight}
//                             onChange={e => setInputWeight(e.target.value)}
//                             className="bg-[#12151E] border-[#2A3042] text-white focus:border-[#5D5FEF]"
//                             placeholder="Enter your weight"
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor="height" className="text-[#A0A7B8] flex items-center gap-2 mb-2">
//                             <Ruler className="h-4 w-4" />
//                             Height (cm)
//                           </Label>
//                           <Input
//                             id="height"
//                             type="number"
//                             min="1"
//                             value={inputHeight}
//                             onChange={e => setInputHeight(e.target.value)}
//                             className="bg-[#12151E] border-[#2A3042] text-white focus:border-[#5D5FEF]"
//                             placeholder="Enter your height"
//                           />
//                         </div>
//                         <div>
//                           <Label htmlFor="date" className="text-[#A0A7B8] flex items-center gap-2 mb-2">
//                             <Calendar className="h-4 w-4" />
//                             Date
//                           </Label>
//                           <Input
//                             id="date"
//                             type="date"
//                             value={inputDate ? format(inputDate, "yyyy-MM-dd") : ""}
//                             onChange={e => setInputDate(e.target.value ? new Date(e.target.value) : null)}
//                             className="bg-[#12151E] border-[#2A3042] text-white focus:border-[#5D5FEF]"
//                           />
//                         </div>
//                       </div>
//                       <DialogFooter>
//                         <Button 
//                           onClick={handleAdd} 
//                           className="w-full bg-gradient-to-r from-[#5D5FEF] to-[#FF4757] hover:from-[#7577F5] hover:to-[#FF6B7A]" 
//                           disabled={mutation.isPending}
//                         >
//                           {mutation.isPending ? (
//                             <div className="flex items-center gap-2">
//                               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                               Saving...
//                             </div>
//                           ) : (
//                             'Save Entry'
//                           )}
//                         </Button>
//                       </DialogFooter>
//                     </DialogContent>
//                   </Dialog>
//                 </div>
//               </div>
//             </div>

//             {/* Quick Stats */}
//             <div className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border border-[#2A3042] rounded-2xl shadow-lg p-6">
//               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00D68F] to-[#33DEAC]"></div>
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="w-10 h-10 bg-gradient-to-r from-[#00D68F] to-[#33DEAC] rounded-full flex items-center justify-center">
//                   <BarChart3 className="h-5 w-5 text-white" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-white">Quick Stats</h3>
//               </div>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center py-2">
//                   <span className="text-[#A0A7B8]">Total Entries</span>
//                   <span className="font-semibold text-white text-lg">{data?.length || 0}</span>
//                 </div>
//                 <div className="flex justify-between items-center py-2">
//                   <span className="text-[#A0A7B8]">Date Range</span>
//                   <span className="font-semibold text-white text-sm">
//                     {filteredData.length > 0 
//                       ? `${format(new Date(filteredData[0].date), "MMM d")} - ${format(new Date(filteredData[filteredData.length - 1].date), "MMM d")}`
//                       : "No data"
//                     }
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center py-2">
//                   <span className="text-[#A0A7B8]">Showing</span>
//                   <span className="font-semibold text-white text-lg">{filteredData.length}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT Side: Graph + Filters */}
//           <div className="lg:col-span-2 space-y-6">
//             <div className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border border-[#2A3042] rounded-2xl shadow-lg">
//               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5D5FEF] to-[#FF4757]"></div>
//               <div className="p-6">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-10 h-10 bg-gradient-to-r from-[#5D5FEF] to-[#FF4757] rounded-full flex items-center justify-center">
//                     <BarChart3 className="h-5 w-5 text-white" />
//                   </div>
//                   <h2 className="text-xl font-bold text-white">Progress Visualization</h2>
//                 </div>

//                 {/* Filter Controls */}
//                 <div className="bg-[rgba(42,48,66,0.3)] border border-[#2A3042] rounded-xl p-4 mb-6">
//                   <div className="flex items-center gap-2 mb-4">
//                     <Filter className="h-4 w-4 text-[#A0A7B8]" />
//                     <span className="text-sm font-medium text-[#A0A7B8]">Filter Options</span>
//                   </div>
                  
//                   <div className="flex flex-wrap items-center gap-3">
//                     <div className="flex gap-2">
//                       {(['last10', 'month', 'custom'] as FilterType[]).map((filterType) => (
//                         <Button
//                           key={filterType}
//                           variant={filter === filterType ? "default" : "outline"}
//                           size="sm"
//                           onClick={() => setFilter(filterType)}
//                           className={filter === filterType 
//                             ? "bg-gradient-to-r from-[#5D5FEF] to-[#FF4757] text-white border-0 hover:from-[#7577F5] hover:to-[#FF6B7A]" 
//                             : "border-[#2A3042] text-[#A0A7B8] hover:bg-[rgba(42,48,66,0.5)] hover:text-white"
//                           }
//                         >
//                           {filterType === 'last10' ? 'Last 10' : 
//                            filterType === 'month' ? 'Last Month' : 'Custom Range'}
//                         </Button>
//                       ))}
//                     </div>
                    
//                     {filter === "custom" && (
//                       <div className="flex items-center gap-3 ml-4 flex-wrap">
//                         <div className="flex items-center gap-2">
//                           <Label className="text-[#A0A7B8] text-sm whitespace-nowrap">From:</Label>
//                           <Input
//                             type="date"
//                             value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
//                             onChange={e => setStartDate(e.target.value ? new Date(e.target.value) : null)}
//                             className="bg-[#12151E] border-[#2A3042] text-white text-sm w-auto focus:border-[#5D5FEF]"
//                           />
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Label className="text-[#A0A7B8] text-sm whitespace-nowrap">To:</Label>
//                           <Input
//                             type="date"
//                             value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
//                             onChange={e => setEndDate(e.target.value ? new Date(e.target.value) : null)}
//                             className="bg-[#12151E] border-[#2A3042] text-white text-sm w-auto focus:border-[#5D5FEF]"
//                           />
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Chart */}
//                 <div className="bg-[rgba(42,48,66,0.2)] border border-[#2A3042] rounded-xl p-4">
//                   <div className="h-96">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <AreaChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                         <defs>
//                           <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
//                             <stop offset="5%" stopColor="#5D5FEF" stopOpacity={0.8}/>
//                             <stop offset="95%" stopColor="#5D5FEF" stopOpacity={0.1}/>
//                           </linearGradient>
//                           <linearGradient id="heightGradient" x1="0" y1="0" x2="0" y2="1">
//                             <stop offset="5%" stopColor="#FF4757" stopOpacity={0.8}/>
//                             <stop offset="95%" stopColor="#FF4757" stopOpacity={0.1}/>
//                           </linearGradient>
//                         </defs>
//                         <CartesianGrid strokeDasharray="3 3" stroke="#2A3042" opacity={0.3} />
//                         <XAxis 
//                           dataKey="date" 
//                           tickFormatter={d => format(new Date(d), "MMM d")} 
//                           stroke="#A0A7B8" 
//                           fontSize={12}
//                         />
//                         <YAxis stroke="#A0A7B8" fontSize={12} />
//                         <Tooltip
//                           contentStyle={{ 
//                             background: "rgba(30, 34, 53, 0.95)", 
//                             borderRadius: "12px", 
//                             border: "1px solid rgba(93, 95, 239, 0.3)",
//                             backdropFilter: "blur(10px)"
//                           }}
//                           labelStyle={{ color: "#fff", fontWeight: "bold" }}
//                           formatter={(value: number, name: string) => [
//                             `${value} ${name === "weight" ? "kg" : "cm"}`, 
//                             name === "weight" ? "Weight" : "Height"
//                           ]}
//                           labelFormatter={(label: string) => format(new Date(label), "MMM d, yyyy")}
//                         />
//                         <Area 
//                           type="monotone" 
//                           dataKey="weight" 
//                           stroke="#5D5FEF" 
//                           fillOpacity={1} 
//                           fill="url(#weightGradient)"
//                           strokeWidth={3}
//                           dot={{ fill: "#5D5FEF", strokeWidth: 2, r: 5 }}
//                           activeDot={{ r: 7, stroke: "#5D5FEF", strokeWidth: 2 }}
//                         />
//                       </AreaChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { JSX, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { 
  Calendar, 
  
  Target, 
  Plus, 
  Activity, 
  Scale, 
  Ruler,
  BarChart3,
  Filter,
  Eye,
  EyeOff
} from "lucide-react";
import { ClientService } from "@/services/implementation/clientServices";

// TypeScript interfaces
interface ProgressEntry {
  date: string;
  weight: number;
  height: number;
  bmi: string;
  bmiCategory: string;
}

interface AddProgressParams {
  weight: number;
  height: number;
  date: string;
}

type FilterType = "last10" | "month" | "custom";

interface LineVisibility {
  weight: boolean;
  height: boolean;
  bmi: boolean;
}

// Backend provides BMI and category; no local BMI calc needed

// Helper function to get BMI category color
const getBMIColor = (category: string): string => {
  switch (category) {
    case "Underweight": return "text-blue-400";
    case "Normal weight": return "text-[#00D68F]";
    case "Overweight": return "text-[#FF9F43]";
    case "Obese": return "text-[#FF4757]";
    default: return "text-[#A0A7B8]";
  }
};

const getBMIBadgeVariant = (category: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (category) {
    case "Normal weight": return "default";
    case "Underweight": return "secondary";
    case "Overweight": return "outline";
    case "Obese": return "destructive";
    default: return "outline";
  }
};

const getBMIGradient = (category: string): string => {
  switch (category) {
    case "Normal weight": return "from-[#00D68F]/20 to-[#33DEAC]/20 border-[#00D68F]/30";
    case "Underweight": return "from-[#5D5FEF]/20 to-[#7577F5]/20 border-[#5D5FEF]/30";
    case "Overweight": return "from-[#FF9F43]/20 to-[#FFBB33]/20 border-[#FF9F43]/30";
    case "Obese": return "from-[#FF4757]/20 to-[#FF6B7A]/20 border-[#FF4757]/30";
    default: return "from-[#2A3042]/20 to-[#2A3042]/10 border-[#2A3042]/30";
  }
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ payload: ProgressEntry }>; label?: string }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.95)] border border-[#2A3042] rounded-xl p-4 shadow-lg backdrop-blur-sm">
        <p className="text-white font-semibold mb-2">{format(new Date(label || ''), "MMM d, yyyy")}</p>
        <div className="space-y-1">
          <p className="text-[#5D5FEF] flex items-center gap-2">
            <Scale className="h-3 w-3" />
            Weight: {data.weight} kg
          </p>
          <p className="text-[#FF4757] flex items-center gap-2">
            <Ruler className="h-3 w-3" />
            Height: {data.height} cm
          </p>
          <p className="text-[#00D68F] flex items-center gap-2">
            <Target className="h-3 w-3" />
            BMI: {data.bmi} ({data.bmiCategory})
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function ProgressPage(): JSX.Element {
  const queryClient = useQueryClient();

  // State management with proper TypeScript types
  const [filter, setFilter] = useState<FilterType>("last10");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [inputWeight, setInputWeight] = useState<string>("");
  const [inputHeight, setInputHeight] = useState<string>("");
  const [inputDate, setInputDate] = useState<Date | null>(new Date());
  
  // New state for line visibility
  const [lineVisibility, setLineVisibility] = useState<LineVisibility>({
    weight: true,
    height: true,
    bmi: true
  });

  // React Query hooks
  const { data: current, isLoading: isLoadingCurrent } = useQuery<ProgressEntry | null>({
    queryKey: ["progress-current"],
    queryFn: ClientService.getProgressCurrent,
  });

  const { data: graphPoints, isLoading: isLoadingGraph, refetch: refetchGraph } = useQuery<{ date: string; weight: number; bmi: number }[]>({
    queryKey: ["progress-graph", filter, startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      let start: Date;
      let end: Date;
      const now = new Date();
      if (filter === "last10") {
        end = now;
        start = new Date();
        start.setMonth(now.getMonth() - 3);
      } else if (filter === "month") {
        end = now;
        start = new Date();
        start.setMonth(now.getMonth() - 1);
      } else {
        start = startDate ?? new Date(now.getFullYear(), now.getMonth(), 1);
        end = endDate ?? now;
      }
      return ClientService.getProgressGraph(start.toISOString(), end.toISOString());
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: AddProgressParams) => ClientService.addProgressEntry(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress-current"] });
      refetchGraph();
    }
  });

  const previewMutation = useMutation({
    mutationFn: (payload: AddProgressParams) => ClientService.previewProgressEntry(payload),
  });

  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<ProgressEntry | null>(null);

  // Event handlers
  const handleAdd = (): void => {
    if (!inputWeight || !inputHeight || !inputDate) return;
    
    const dateStr = format(inputDate, "yyyy-MM-dd");
    
    const payload = { weight: parseFloat(inputWeight), height: parseFloat(inputHeight), date: dateStr };
    mutation.mutate(payload, {
      onError: async (err) => {
        // If weekly limit blocks, show preview in a modal (not saved)
        const isWeeklyLimit = (err as Error)?.message?.toLowerCase().includes('only one entry');
        if (isWeeklyLimit) {
          const preview = await previewMutation.mutateAsync(payload);
          setPreviewData(preview as unknown as ProgressEntry);
          setPreviewOpen(true);
        }
      },
    });
    
    setDialogOpen(false);
    setInputWeight("");
    setInputHeight("");
    setInputDate(new Date());
  };

  // Toggle line visibility
  const toggleLineVisibility = (line: keyof LineVisibility): void => {
    setLineVisibility(prev => ({
      ...prev,
      [line]: !prev[line]
    }));
  };

  // Build chart data from API graph points and enrich with current meta
  const chartData: (ProgressEntry & { bmiValue: number })[] = (graphPoints ?? []).map(p => {
    const bmiNum = Number(p.bmi);
    const bmiFixed = Number.isFinite(bmiNum) ? Number(bmiNum.toFixed(1)) : 0;
    return {
      date: p.date,
      weight: p.weight,
      height: current?.height ?? 0,
      bmi: String(bmiFixed.toFixed(1)),
      bmiCategory: current?.bmiCategory ?? "",
      bmiValue: bmiFixed,
    };
  });

  const lastEntry: ProgressEntry | undefined = current ?? undefined;
  // Deprecated weight change display on API-driven screen

  if (isLoadingCurrent || isLoadingGraph) {
    return (
      <div className="min-h-screen bg-[#12151E] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#5D5FEF]/30 border-t-[#5D5FEF] rounded-full animate-spin"></div>
          <span className="text-white text-lg">Loading your progress...</span>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="min-h-screen bg-[#12151E] flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-16 w-16 text-[#FF4757] mx-auto mb-4" />
          <div className="text-white text-xl">Error loading progress data</div>
          <p className="text-[#A0A7B8] mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#12151E] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border border-[#2A3042] text-white max-w-md">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF9F43] to-[#FF4757]"></div>
            <DialogHeader className="pt-4">
              <DialogTitle className="text-xl font-bold text-white">Preview (Not Saved)</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="text-[#A0A7B8] text-sm">You can add only one entry per week. This is a preview and will not be stored.</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[rgba(42,48,66,0.3)] border border-[#2A3042] rounded-xl p-3">
                  <div className="text-xs text-[#A0A7B8]">Date</div>
                  <div className="text-white font-semibold">{previewData ? format(new Date(previewData.date), 'MMM d, yyyy') : '--'}</div>
                </div>
                <div className="bg-[rgba(42,48,66,0.3)] border border-[#2A3042] rounded-xl p-3">
                  <div className="text-xs text-[#A0A7B8]">BMI</div>
                  <div className="text-white font-semibold">{previewData?.bmi ?? '--'}</div>
                </div>
                <div className="bg-[rgba(42,48,66,0.3)] border border-[#2A3042] rounded-xl p-3">
                  <div className="text-xs text-[#A0A7B8]">Weight (kg)</div>
                  <div className="text-white font-semibold">{previewData?.weight ?? '--'}</div>
                </div>
                <div className="bg-[rgba(42,48,66,0.3)] border border-[#2A3042] rounded-xl p-3">
                  <div className="text-xs text-[#A0A7B8]">Height (cm)</div>
                  <div className="text-white font-semibold">{previewData?.height ?? '--'}</div>
                </div>
                <div className="col-span-2 bg-[rgba(42,48,66,0.3)] border border-[#2A3042] rounded-xl p-3">
                  <div className="text-xs text-[#A0A7B8]">BMI Category</div>
                  <div className="text-white font-semibold">{previewData?.bmiCategory ?? '--'}</div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setPreviewOpen(false)} className="w-full bg-gradient-to-r from-[#5D5FEF] to-[#FF4757] hover:from-[#7577F5] hover:to-[#FF6B7A]">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT Side: Current Progress & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Stats Card */}
            <div className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border border-[#2A3042] rounded-2xl shadow-lg overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5D5FEF] to-[#FF4757]"></div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#5D5FEF] to-[#FF4757] rounded-full flex items-center justify-center">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Current Stats</h2>
                </div>

                <div className="space-y-4">
                  {/* Weight & Height Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-[#5D5FEF]/20 to-[#7577F5]/20 border border-[#5D5FEF]/30 rounded-xl p-4 text-center">
                      <div className="w-8 h-8 bg-[#5D5FEF]/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Scale className="h-4 w-4 text-[#5D5FEF]" />
                      </div>
                      <div className="text-2xl font-bold text-white">{lastEntry?.weight ?? "--"}</div>
                      <div className="text-sm text-[#A0A7B8]">Weight (kg)</div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-[#FF4757]/20 to-[#FF6B7A]/20 border border-[#FF4757]/30 rounded-xl p-4 text-center">
                      <div className="w-8 h-8 bg-[#FF4757]/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Ruler className="h-4 w-4 text-[#FF4757]" />
                      </div>
                      <div className="text-2xl font-bold text-white">{lastEntry?.height ?? "--"}</div>
                      <div className="text-sm text-[#A0A7B8]">Height (cm)</div>
                    </div>
                  </div>

                  {/* BMI Section */}
                  <div className={`bg-gradient-to-r ${lastEntry?.bmiCategory ? getBMIGradient(lastEntry.bmiCategory) : getBMIGradient("default")} rounded-xl p-4 border backdrop-blur-sm`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-white" />
                        <span className="text-sm font-medium text-white">BMI Index</span>
                      </div>
                      {lastEntry?.bmiCategory && (
                        <Badge 
                          variant={getBMIBadgeVariant(lastEntry.bmiCategory)} 
                          className="text-xs bg-white/20 text-white border-white/30"
                        >
                          {lastEntry.bmiCategory}
                        </Badge>
                      )}
                    </div>
                    <div className={`text-3xl font-bold ${lastEntry?.bmiCategory ? getBMIColor(lastEntry.bmiCategory) : 'text-[#A0A7B8]'}`}>
                      {typeof lastEntry?.bmi === 'string' ? lastEntry.bmi : "--"}
                    </div>
                  </div>

                  {/* Weight Change Indicator (optional) */}
                  {/* Weight change indicator intentionally removed */}
                </div>

                <div className="mt-6">
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-[#5D5FEF] to-[#FF4757] hover:from-[#7577F5] hover:to-[#FF6B7A] text-white shadow-lg">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Entry
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border border-[#2A3042] text-white max-w-md">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5D5FEF] to-[#FF4757]"></div>
                      <DialogHeader className="pt-4">
                        <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#5D5FEF] to-[#FF4757] rounded-full flex items-center justify-center">
                            <Plus className="h-4 w-4 text-white" />
                          </div>
                          Add Progress Entry
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="weight" className="text-[#A0A7B8] flex items-center gap-2 mb-2">
                            <Scale className="h-4 w-4" />
                            Weight (kg)
                          </Label>
                          <Input
                            id="weight"
                            type="number"
                            min="1"
                            step="0.1"
                            value={inputWeight}
                            onChange={e => setInputWeight(e.target.value)}
                            className="bg-[#12151E] border-[#2A3042] text-white focus:border-[#5D5FEF]"
                            placeholder="Enter your weight"
                          />
                        </div>
                        <div>
                          <Label htmlFor="height" className="text-[#A0A7B8] flex items-center gap-2 mb-2">
                            <Ruler className="h-4 w-4" />
                            Height (cm)
                          </Label>
                          <Input
                            id="height"
                            type="number"
                            min="1"
                            value={inputHeight}
                            onChange={e => setInputHeight(e.target.value)}
                            className="bg-[#12151E] border-[#2A3042] text-white focus:border-[#5D5FEF]"
                            placeholder="Enter your height"
                          />
                        </div>
                        <div>
                          <Label htmlFor="date" className="text-[#A0A7B8] flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4" />
                            Date
                          </Label>
                          <Input
                            id="date"
                            type="date"
                            value={inputDate ? format(inputDate, "yyyy-MM-dd") : ""}
                            onChange={e => setInputDate(e.target.value ? new Date(e.target.value) : null)}
                            className="bg-[#12151E] border-[#2A3042] text-white focus:border-[#5D5FEF]"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          onClick={handleAdd} 
                          className="w-full bg-gradient-to-r from-[#5D5FEF] to-[#FF4757] hover:from-[#7577F5] hover:to-[#FF6B7A]" 
                          disabled={mutation.isPending}
                        >
                          {mutation.isPending ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Saving...
                            </div>
                          ) : (
                            'Save Entry'
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border border-[#2A3042] rounded-2xl shadow-lg p-6">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00D68F] to-[#33DEAC]"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-[#00D68F] to-[#33DEAC] rounded-full flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Quick Stats</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-[#A0A7B8]">Total Entries</span>
                  <span className="font-semibold text-white text-lg">{chartData.length}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[#A0A7B8]">Date Range</span>
                  <span className="font-semibold text-white text-sm">
                    {chartData.length > 0 
                      ? `${format(new Date(chartData[0].date), "MMM d")} - ${format(new Date(chartData[chartData.length - 1].date), "MMM d")}`
                      : "No data"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[#A0A7B8]">Showing</span>
                  <span className="font-semibold text-white text-lg">{chartData.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT Side: Graph + Filters */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border border-[#2A3042] rounded-2xl shadow-lg">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5D5FEF] to-[#FF4757]"></div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#5D5FEF] to-[#FF4757] rounded-full flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Progress Visualization</h2>
                </div>

                {/* Filter Controls */}
                <div className="bg-[rgba(42,48,66,0.3)] border border-[#2A3042] rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="h-4 w-4 text-[#A0A7B8]" />
                    <span className="text-sm font-medium text-[#A0A7B8]">Filter Options</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex gap-2">
                      {(['last10', 'month', 'custom'] as FilterType[]).map((filterType) => (
                        <Button
                          key={filterType}
                          variant={filter === filterType ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFilter(filterType)}
                          className={filter === filterType 
                            ? "bg-gradient-to-r from-[#5D5FEF] to-[#FF4757] text-white border-0 hover:from-[#7577F5] hover:to-[#FF6B7A]" 
                            : "border-[#2A3042] text-[#A0A7B8] hover:bg-[rgba(42,48,66,0.5)] hover:text-white"
                          }
                        >
                          {filterType === 'last10' ? 'Last 10' : 
                           filterType === 'month' ? 'Last Month' : 'Custom Range'}
                        </Button>
                      ))}
                    </div>
                    
                    {filter === "custom" && (
                      <div className="flex items-center gap-3 ml-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Label className="text-[#A0A7B8] text-sm whitespace-nowrap">From:</Label>
                          <Input
                            type="date"
                            value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
                            onChange={e => setStartDate(e.target.value ? new Date(e.target.value) : null)}
                            className="bg-[#12151E] border-[#2A3042] text-white text-sm w-auto focus:border-[#5D5FEF]"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-[#A0A7B8] text-sm whitespace-nowrap">To:</Label>
                          <Input
                            type="date"
                            value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
                            onChange={e => setEndDate(e.target.value ? new Date(e.target.value) : null)}
                            className="bg-[#12151E] border-[#2A3042] text-white text-sm w-auto focus:border-[#5D5FEF]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Line Visibility Controls */}
                <div className="bg-[rgba(42,48,66,0.3)] border border-[#2A3042] rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="h-4 w-4 text-[#A0A7B8]" />
                    <span className="text-sm font-medium text-[#A0A7B8]">Show/Hide Lines</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleLineVisibility('weight')}
                      className={`flex items-center gap-2 ${
                        lineVisibility.weight
                          ? "bg-[#5D5FEF]/20 border-[#5D5FEF] text-[#5D5FEF] hover:bg-[#5D5FEF]/30"
                          : "border-[#2A3042] text-[#A0A7B8] hover:bg-[rgba(42,48,66,0.5)]"
                      }`}
                    >
                      {lineVisibility.weight ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3" />
                      )}
                      <Scale className="h-3 w-3" />
                      Weight
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleLineVisibility('height')}
                      className={`flex items-center gap-2 ${
                        lineVisibility.height
                          ? "bg-[#FF4757]/20 border-[#FF4757] text-[#FF4757] hover:bg-[#FF4757]/30"
                          : "border-[#2A3042] text-[#A0A7B8] hover:bg-[rgba(42,48,66,0.5)]"
                      }`}
                    >
                      {lineVisibility.height ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3" />
                      )}
                      <Ruler className="h-3 w-3" />
                      Height
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleLineVisibility('bmi')}
                      className={`flex items-center gap-2 ${
                        lineVisibility.bmi
                          ? "bg-[#00D68F]/20 border-[#00D68F] text-[#00D68F] hover:bg-[#00D68F]/30"
                          : "border-[#2A3042] text-[#A0A7B8] hover:bg-[rgba(42,48,66,0.5)]"
                      }`}
                    >
                      {lineVisibility.bmi ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3" />
                      )}
                      <Target className="h-3 w-3" />
                      BMI
                    </Button>
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-[rgba(42,48,66,0.2)] border border-[#2A3042] rounded-xl p-4">
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2A3042" opacity={0.3} />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={d => format(new Date(d), "MMM d")} 
                          stroke="#A0A7B8" 
                          fontSize={12}
                        />
                        <YAxis stroke="#A0A7B8" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                          wrapperStyle={{ color: '#A0A7B8' }}
                          formatter={(value, entry) => (
                            <span style={{ color: entry.color }}>
                              {value === 'weight' ? 'Weight (kg)' : 
                               value === 'height' ? 'Height (cm)' : 
                               'BMI'}
                            </span>
                          )}
                        />
                        
                        {lineVisibility.weight && (
                          <Line 
                            type="monotone" 
                            dataKey="weight" 
                            stroke="#5D5FEF" 
                            strokeWidth={3}
                            dot={{ fill: "#5D5FEF", strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: "#5D5FEF", strokeWidth: 2 }}
                            name="weight"
                          />
                        )}
                        
                        {lineVisibility.height && (
                          <Line 
                            type="monotone" 
                            dataKey="height" 
                            stroke="#FF4757" 
                            strokeWidth={3}
                            dot={{ fill: "#FF4757", strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: "#FF4757", strokeWidth: 2 }}
                            name="height"
                          />
                        )}
                        
                        {lineVisibility.bmi && (
                          <Line 
                            type="monotone" 
                            dataKey="bmiValue" 
                            stroke="#00D68F" 
                            strokeWidth={3}
                            dot={{ fill: "#00D68F", strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: "#00D68F", strokeWidth: 2 }}
                            name="bmi"
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
