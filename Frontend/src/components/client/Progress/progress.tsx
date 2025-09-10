// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { JSX, useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
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
// import { Calendar, TrendingDown, TrendingUp, Target, Plus, Activity } from "lucide-react";

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
//     case "Normal weight": return "text-green-400";
//     case "Overweight": return "text-yellow-400";
//     case "Obese": return "text-red-400";
//     default: return "text-gray-400";
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

// export default function Progress(): JSX.Element {
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
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
//         <div className="text-white text-xl">Error loading progress data</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
//             Health Progress Tracker
//           </h1>
//           <p className="text-slate-300">Monitor your fitness journey with detailed insights</p>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* LEFT Side: Current Progress & Stats */}
//           <div className="lg:col-span-1 space-y-6">
//             {/* Current Stats Card */}
//             <Card className="bg-white/10 backdrop-blur-lg border border-white/20 text-white shadow-2xl">
//               <CardHeader className="pb-4">
//                 <CardTitle className="flex items-center gap-2">
//                   <Activity className="h-5 w-5 text-purple-400" />
//                   Current Stats
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
//                     <div className="text-2xl font-bold text-purple-400">{lastEntry?.weight || "--"}</div>
//                     <div className="text-sm text-slate-300">Weight (kg)</div>
//                   </div>
//                   <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
//                     <div className="text-2xl font-bold text-pink-400">{lastEntry?.height || "--"}</div>
//                     <div className="text-sm text-slate-300">Height (cm)</div>
//                   </div>
//                 </div>

//                 <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-300/30">
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-sm text-slate-300">BMI</span>
//                     {lastEntry?.bmiCategory && (
//                       <Badge variant={getBMIBadgeVariant(lastEntry.bmiCategory)} className="text-xs">
//                         {lastEntry.bmiCategory}
//                       </Badge>
//                     )}
//                   </div>
//                   <div className={`text-3xl font-bold ${lastEntry?.bmiCategory ? getBMIColor(lastEntry.bmiCategory) : 'text-slate-400'}`}>
//                     {lastEntry?.bmi || "--"}
//                   </div>
//                 </div>

//                 {/* Weight Change Indicator */}
//                 {weightChange !== 0 && (
//                   <div className="flex items-center justify-center gap-2 p-3 bg-white/5 rounded-lg">
//                     {weightChange > 0 ? (
//                       <TrendingUp className="h-4 w-4 text-red-400" />
//                     ) : (
//                       <TrendingDown className="h-4 w-4 text-green-400" />
//                     )}
//                     <span className={`text-sm font-medium ${weightChange > 0 ? 'text-red-400' : 'text-green-400'}`}>
//                       {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg from last entry
//                     </span>
//                   </div>
//                 )}
//               </CardContent>
//               <CardFooter>
//                 <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//                   <DialogTrigger asChild>
//                     <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg">
//                       <Plus className="h-4 w-4 mr-2" />
//                       Add New Entry
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
//                     <DialogHeader>
//                       <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
//                         Add Progress Entry
//                       </DialogTitle>
//                     </DialogHeader>
//                     <div className="space-y-4">
//                       <div>
//                         <Label htmlFor="weight" className="text-slate-300 flex items-center gap-2 mb-2">
//                           <Target className="h-4 w-4" />
//                           Weight (kg)
//                         </Label>
//                         <Input
//                           id="weight"
//                           type="number"
//                           min="1"
//                           step="0.1"
//                           value={inputWeight}
//                           onChange={e => setInputWeight(e.target.value)}
//                           className="bg-slate-700 border-slate-600 text-white focus:border-purple-400"
//                           placeholder="Enter your weight"
//                         />
//                       </div>
//                       <div>
//                         <Label htmlFor="height" className="text-slate-300 flex items-center gap-2 mb-2">
//                           <Activity className="h-4 w-4" />
//                           Height (cm)
//                         </Label>
//                         <Input
//                           id="height"
//                           type="number"
//                           min="1"
//                           value={inputHeight}
//                           onChange={e => setInputHeight(e.target.value)}
//                           className="bg-slate-700 border-slate-600 text-white focus:border-purple-400"
//                           placeholder="Enter your height"
//                         />
//                       </div>
//                       <div>
//                         <Label htmlFor="date" className="text-slate-300 flex items-center gap-2 mb-2">
//                           <Calendar className="h-4 w-4" />
//                           Date
//                         </Label>
//                         <Input
//                           id="date"
//                           type="date"
//                           value={inputDate ? format(inputDate, "yyyy-MM-dd") : ""}
//                           onChange={e => setInputDate(e.target.value ? new Date(e.target.value) : null)}
//                           className="bg-slate-700 border-slate-600 text-white focus:border-purple-400"
//                         />
//                       </div>
//                     </div>
//                     <DialogFooter>
//                       <Button 
//                         onClick={handleAdd} 
//                         className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" 
//                         disabled={mutation.isPending}
//                       >
//                         {mutation.isPending ? "Saving..." : "Save Entry"}
//                       </Button>
//                     </DialogFooter>
//                   </DialogContent>
//                 </Dialog>
//               </CardFooter>
//             </Card>

//             {/* Quick Stats */}
//             <Card className="bg-white/10 backdrop-blur-lg border border-white/20 text-white">
//               <CardHeader>
//                 <CardTitle className="text-lg">Quick Stats</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-slate-300">Total Entries</span>
//                     <span className="font-semibold">{data?.length || 0}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-slate-300">Date Range</span>
//                     <span className="font-semibold text-sm">
//                       {filteredData.length > 0 
//                         ? `${format(new Date(filteredData[0].date), "MMM d")} - ${format(new Date(filteredData[filteredData.length - 1].date), "MMM d")}`
//                         : "No data"
//                       }
//                     </span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* RIGHT Side: Graph + Filters */}
//           <div className="lg:col-span-2 space-y-6">
//             <Card className="bg-white/10 backdrop-blur-lg border border-white/20 text-white shadow-2xl">
//               <CardHeader>
//                 <CardTitle className="text-xl font-bold">Progress Visualization</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {/* Filter Controls */}
//                 <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-white/5 rounded-lg">
//                   <div className="flex gap-2">
//                     {(['last10', 'month', 'custom'] as FilterType[]).map((filterType) => (
//                       <Button
//                         key={filterType}
//                         variant={filter === filterType ? "default" : "outline"}
//                         size="sm"
//                         onClick={() => setFilter(filterType)}
//                         className={filter === filterType 
//                           ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
//                           : "border-white/30 text-slate-300 hover:bg-white/10"
//                         }
//                       >
//                         {filterType === 'last10' ? 'Last 10' : 
//                          filterType === 'month' ? 'Last Month' : 'Custom Range'}
//                       </Button>
//                     ))}
//                   </div>
                  
//                   {filter === "custom" && (
//                     <div className="flex items-center gap-2 ml-4">
//                       <Label className="text-slate-300 text-sm">From:</Label>
//                       <Input
//                         type="date"
//                         value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
//                         onChange={e => setStartDate(e.target.value ? new Date(e.target.value) : null)}
//                         className="bg-slate-700 border-slate-600 text-white text-sm w-auto"
//                       />
//                       <Label className="text-slate-300 text-sm">To:</Label>
//                       <Input
//                         type="date"
//                         value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
//                         onChange={e => setEndDate(e.target.value ? new Date(e.target.value) : null)}
//                         className="bg-slate-700 border-slate-600 text-white text-sm w-auto"
//                       />
//                     </div>
//                   )}
//                 </div>

//                 {/* Chart */}
//                 <div className="h-96 p-4 bg-white/5 rounded-lg">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <AreaChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                       <defs>
//                         <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
//                           <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
//                           <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
//                         </linearGradient>
//                         <linearGradient id="heightGradient" x1="0" y1="0" x2="0" y2="1">
//                           <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8}/>
//                           <stop offset="95%" stopColor="#EC4899" stopOpacity={0.1}/>
//                         </linearGradient>
//                       </defs>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
//                       <XAxis 
//                         dataKey="date" 
//                         tickFormatter={d => format(new Date(d), "MMM d")} 
//                         stroke="#94A3B8" 
//                         fontSize={12}
//                       />
//                       <YAxis stroke="#94A3B8" fontSize={12} />
//                       <Tooltip
//                         contentStyle={{ 
//                           background: "rgba(30, 41, 59, 0.95)", 
//                           borderRadius: "12px", 
//                           border: "1px solid rgba(139, 92, 246, 0.3)",
//                           backdropFilter: "blur(10px)"
//                         }}
//                         labelStyle={{ color: "#fff", fontWeight: "bold" }}
//                         formatter={(value: number, name: string) => [
//                           `${value} ${name === "weight" ? "kg" : "cm"}`, 
//                           name === "weight" ? "Weight" : "Height"
//                         ]}
//                         labelFormatter={(label: string) => format(new Date(label), "MMM d, yyyy")}
//                       />
//                       <Area 
//                         type="monotone" 
//                         dataKey="weight" 
//                         stroke="#8B5CF6" 
//                         fillOpacity={1} 
//                         fill="url(#weightGradient)"
//                         strokeWidth={3}
//                         dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 5 }}
//                         activeDot={{ r: 7, stroke: "#8B5CF6", strokeWidth: 2 }}
//                       />
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//             </Card>
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
//   LineChart, 
//   Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { 
  Calendar, 
  TrendingDown, 
  TrendingUp, 
  Target, 
  Plus, 
  Activity, 
  Scale, 
  Ruler,
  BarChart3,
  Filter
} from "lucide-react";

// TypeScript interfaces
interface ProgressEntry {
  date: string;
  weight: number;
  height: number;
  bmi: string;
  bmiCategory: string;
}

interface BMIResult {
  bmi: string;
  category: string;
}

interface AddProgressParams {
  weight: number;
  height: number;
  date: string;
}

type FilterType = "last10" | "month" | "custom";

// MOCK SERVER
let mockDB: ProgressEntry[] = [
  { date: "2025-08-10", weight: 92, height: 176, bmi: "29.70", bmiCategory: "Overweight" },
  { date: "2025-08-17", weight: 91, height: 176, bmi: "29.38", bmiCategory: "Overweight" },
  { date: "2025-08-25", weight: 89, height: 176, bmi: "28.73", bmiCategory: "Overweight" },
  { date: "2025-09-01", weight: 88, height: 176, bmi: "28.41", bmiCategory: "Overweight" },
  { date: "2025-09-08", weight: 87.5, height: 176, bmi: "28.25", bmiCategory: "Overweight" },
  { date: "2025-09-10", weight: 87, height: 176, bmi: "28.08", bmiCategory: "Overweight" }
];

// API functions
const mockFetchProgress = (): Promise<ProgressEntry[]> => {
  return new Promise(resolve => 
    setTimeout(() => resolve([...mockDB]), 300)
  );
};

const mockAddProgress = ({ weight, height, date }: AddProgressParams): Promise<ProgressEntry[]> => {
  const { bmi, category } = calculateBMI(weight, height);
  mockDB.push({
    date,
    weight,
    height,
    bmi,
    bmiCategory: category,
  });
  mockDB = [...mockDB].sort((a, b) => a.date.localeCompare(b.date));
  return new Promise(resolve => 
    setTimeout(() => resolve([...mockDB]), 200)
  );
};

const calculateBMI = (weight: number, height: number): BMIResult => {
  const bmi = weight / ((height / 100) * (height / 100));
  let category = "";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal weight";
  else if (bmi < 30) category = "Overweight";
  else category = "Obese";
  return { bmi: bmi.toFixed(2), category };
};

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

  // React Query hooks
  const { data, isLoading, isError } = useQuery<ProgressEntry[]>({
    queryKey: ["progress"],
    queryFn: mockFetchProgress,
  });

  const mutation = useMutation<ProgressEntry[], Error, AddProgressParams>({
    mutationFn: mockAddProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    }
  });

  // Event handlers
  const handleAdd = (): void => {
    if (!inputWeight || !inputHeight || !inputDate) return;
    
    const dateStr = format(inputDate, "yyyy-MM-dd");
    if (data?.some(d => d.date === dateStr)) return;
    
    mutation.mutate({
      weight: parseFloat(inputWeight),
      height: parseFloat(inputHeight),
      date: dateStr
    });
    
    setDialogOpen(false);
    setInputWeight("");
    setInputHeight("");
    setInputDate(new Date());
  };

  // Data filtering logic
  let filteredData = data ?? [];
  if (filter === "last10") {
    filteredData = filteredData.slice(-10);
  } else if (filter === "month") {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    filteredData = filteredData.filter(d => new Date(d.date) >= oneMonthAgo);
  } else if (filter === "custom" && startDate && endDate) {
    filteredData = filteredData.filter(d => {
      const dDate = new Date(d.date);
      return dDate >= startDate && dDate <= endDate;
    });
  }

  const lastEntry = filteredData[filteredData.length - 1];
  const previousEntry = filteredData[filteredData.length - 2];
  const weightChange = lastEntry && previousEntry 
    ? lastEntry.weight - previousEntry.weight 
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#12151E] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#5D5FEF]/30 border-t-[#5D5FEF] rounded-full animate-spin"></div>
          <span className="text-white text-lg">Loading your progress...</span>
        </div>
      </div>
    );
  }

  if (isError) {
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
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Health Progress Tracker
          </h1>
          <p className="text-[#A0A7B8]">Monitor your fitness journey with detailed insights</p>
        </div>

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
                      <div className="text-2xl font-bold text-white">{lastEntry?.weight || "--"}</div>
                      <div className="text-sm text-[#A0A7B8]">Weight (kg)</div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-[#FF4757]/20 to-[#FF6B7A]/20 border border-[#FF4757]/30 rounded-xl p-4 text-center">
                      <div className="w-8 h-8 bg-[#FF4757]/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Ruler className="h-4 w-4 text-[#FF4757]" />
                      </div>
                      <div className="text-2xl font-bold text-white">{lastEntry?.height || "--"}</div>
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
                      {lastEntry?.bmi || "--"}
                    </div>
                  </div>

                  {/* Weight Change Indicator */}
                  {weightChange !== 0 && (
                    <div className="bg-[rgba(42,48,66,0.3)] border border-[#2A3042] rounded-xl p-4">
                      <div className="flex items-center justify-center gap-2">
                        {weightChange > 0 ? (
                          <TrendingUp className="h-4 w-4 text-[#FF4757]" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-[#00D68F]" />
                        )}
                        <span className={`text-sm font-medium ${weightChange > 0 ? 'text-[#FF4757]' : 'text-[#00D68F]'}`}>
                          {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg from last entry
                        </span>
                      </div>
                    </div>
                  )}
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
                  <span className="font-semibold text-white text-lg">{data?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[#A0A7B8]">Date Range</span>
                  <span className="font-semibold text-white text-sm">
                    {filteredData.length > 0 
                      ? `${format(new Date(filteredData[0].date), "MMM d")} - ${format(new Date(filteredData[filteredData.length - 1].date), "MMM d")}`
                      : "No data"
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[#A0A7B8]">Showing</span>
                  <span className="font-semibold text-white text-lg">{filteredData.length}</span>
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

                {/* Chart */}
                <div className="bg-[rgba(42,48,66,0.2)] border border-[#2A3042] rounded-xl p-4">
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                          <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#5D5FEF" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#5D5FEF" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="heightGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF4757" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#FF4757" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2A3042" opacity={0.3} />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={d => format(new Date(d), "MMM d")} 
                          stroke="#A0A7B8" 
                          fontSize={12}
                        />
                        <YAxis stroke="#A0A7B8" fontSize={12} />
                        <Tooltip
                          contentStyle={{ 
                            background: "rgba(30, 34, 53, 0.95)", 
                            borderRadius: "12px", 
                            border: "1px solid rgba(93, 95, 239, 0.3)",
                            backdropFilter: "blur(10px)"
                          }}
                          labelStyle={{ color: "#fff", fontWeight: "bold" }}
                          formatter={(value: number, name: string) => [
                            `${value} ${name === "weight" ? "kg" : "cm"}`, 
                            name === "weight" ? "Weight" : "Height"
                          ]}
                          labelFormatter={(label: string) => format(new Date(label), "MMM d, yyyy")}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="weight" 
                          stroke="#5D5FEF" 
                          fillOpacity={1} 
                          fill="url(#weightGradient)"
                          strokeWidth={3}
                          dot={{ fill: "#5D5FEF", strokeWidth: 2, r: 5 }}
                          activeDot={{ r: 7, stroke: "#5D5FEF", strokeWidth: 2 }}
                        />
                      </AreaChart>
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
