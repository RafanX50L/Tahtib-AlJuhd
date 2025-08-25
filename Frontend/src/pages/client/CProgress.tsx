import { useState, useEffect } from 'react';
import Sidebar from '../../components/client/Sidebar';
import Header from '../../components/client/Header';
import CFooter from '@/components/client/Footer';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Weight, 
  Ruler, 
  Dumbbell, 
  Utensils, 
  Target, 
  Camera,
  Plus,
  Calendar,
  BarChart3,
  LineChart,
  Activity,
  Target as TargetIcon,
  CheckCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface ProgressEntry {
  _id: string;
  type: 'weight' | 'measurements' | 'workout' | 'nutrition' | 'goal' | 'photo';
  date: string;
  weight?: number;
  bodyFatPercentage?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    biceps?: number;
    thighs?: number;
    calves?: number;
    neck?: number;
    shoulders?: number;
  };
  workoutProgress?: {
    workoutId: string;
    workoutName: string;
    duration: number;
    caloriesBurned?: number;
    exercises: Array<{
      exerciseName: string;
      sets: number;
      reps: number;
      weight?: number;
      duration?: number;
      completed: boolean;
    }>;
  };
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    water: number;
    meals: Array<{
      mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
      name: string;
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
    }>;
  };
  goals?: Array<{
    goalId: string;
    goalType: 'weight' | 'measurement' | 'workout' | 'nutrition';
    target: number;
    current: number;
    unit: string;
    isCompleted: boolean;
  }>;
  photos?: Array<{
    type: 'front' | 'back' | 'side' | 'other';
    url: string;
    caption?: string;
  }>;
  notes?: string;
  mood?: 1 | 2 | 3 | 4 | 5;
  energyLevel?: 1 | 2 | 3 | 4 | 5;
}

interface Goal {
  _id: string;
  title: string;
  description: string;
  goalType: 'weight' | 'measurement' | 'workout' | 'nutrition';
  target: number;
  current: number;
  unit: string;
  deadline: string;
  isCompleted: boolean;
  createdAt: string;
}

const CProgress = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [selectedType, setSelectedType] = useState<ProgressEntry['type']>('weight');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  useEffect(() => {
    const mockProgress: ProgressEntry[] = [
      {
        _id: '1',
        type: 'weight',
        date: '2024-01-15',
        weight: 75.5,
        bodyFatPercentage: 18.2
      },
      {
        _id: '2',
        type: 'measurements',
        date: '2024-01-15',
        measurements: {
          chest: 95,
          waist: 78,
          hips: 98,
          biceps: 32,
          thighs: 58,
          calves: 38,
          neck: 40,
          shoulders: 110
        }
      },
      {
        _id: '3',
        type: 'workout',
        date: '2024-01-15',
        workoutProgress: {
          workoutId: 'w1',
          workoutName: 'Upper Body Strength',
          duration: 45,
          caloriesBurned: 320,
          exercises: [
            { exerciseName: 'Bench Press', sets: 3, reps: 8, weight: 135, completed: true },
            { exerciseName: 'Pull-ups', sets: 3, reps: 6, completed: true },
            { exerciseName: 'Shoulder Press', sets: 3, reps: 10, weight: 65, completed: true }
          ]
        }
      },
      {
        _id: '4',
        type: 'nutrition',
        date: '2024-01-15',
        nutrition: {
          calories: 2100,
          protein: 180,
          carbs: 200,
          fats: 70,
          water: 2.5,
          meals: [
            { mealType: 'breakfast', name: 'Oatmeal with berries', calories: 350, protein: 15, carbs: 60, fats: 8 },
            { mealType: 'lunch', name: 'Chicken salad', calories: 450, protein: 35, carbs: 25, fats: 20 },
            { mealType: 'dinner', name: 'Salmon with vegetables', calories: 550, protein: 40, carbs: 30, fats: 25 }
          ]
        }
      }
    ];

    const mockGoals: Goal[] = [
      {
        _id: 'g1',
        title: 'Lose 10 pounds',
        description: 'Reduce body weight through consistent diet and exercise',
        goalType: 'weight',
        target: 70,
        current: 75.5,
        unit: 'kg',
        deadline: '2024-03-15',
        isCompleted: false,
        createdAt: '2024-01-01'
      },
      {
        _id: 'g2',
        title: 'Increase bench press',
        description: 'Improve upper body strength',
        goalType: 'workout',
        target: 150,
        current: 135,
        unit: 'lbs',
        deadline: '2024-02-15',
        isCompleted: false,
        createdAt: '2024-01-01'
      },
      {
        _id: 'g3',
        title: 'Reduce waist measurement',
        description: 'Target core fat loss',
        goalType: 'measurement',
        target: 72,
        current: 78,
        unit: 'cm',
        deadline: '2024-04-15',
        isCompleted: false,
        createdAt: '2024-01-01'
      }
    ];

    setProgressEntries(mockProgress);
    setGoals(mockGoals);
    setIsLoading(false);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'weight': return <Weight className="w-5 h-5" />;
      case 'measurements': return <Ruler className="w-5 h-5" />;
      case 'workout': return <Dumbbell className="w-5 h-5" />;
      case 'nutrition': return <Utensils className="w-5 h-5" />;
      case 'goal': return <Target className="w-5 h-5" />;
      case 'photo': return <Camera className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'weight': return 'bg-blue-500';
      case 'measurements': return 'bg-green-500';
      case 'workout': return 'bg-purple-500';
      case 'nutrition': return 'bg-orange-500';
      case 'goal': return 'bg-yellow-500';
      case 'photo': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const calculateGoalProgress = (goal: Goal) => {
    const progress = ((goal.current - goal.target) / (goal.target - goal.current)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getLatestWeight = () => {
    const weightEntries = progressEntries
      .filter(entry => entry.type === 'weight' && entry.weight)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return weightEntries[0]?.weight;
  };

  const getWeightChange = () => {
    const weightEntries = progressEntries
      .filter(entry => entry.type === 'weight' && entry.weight)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (weightEntries.length < 2) return 0;
    return weightEntries[0].weight! - weightEntries[1].weight!;
  };

  if (isLoading) {
    return (
      <div className="bg-[#12151E] text-white min-h-screen font-sans">
        <Sidebar />
        <main className="lg:ml-[280px] p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#12151E] text-white min-h-screen font-sans">
      <Sidebar />
      <main className="lg:ml-[280px] p-8">
        <Header
          title="Progress Tracking"
          content="Monitor your fitness journey and celebrate your achievements"
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm">Current Weight</p>
                  <p className="text-2xl font-bold">{getLatestWeight() || 'N/A'} kg</p>
                  <p className={`text-sm ${getWeightChange() > 0 ? 'text-red-300' : 'text-green-300'}`}>
                    {getWeightChange() > 0 ? '+' : ''}{getWeightChange().toFixed(1)} kg this week
                  </p>
                </div>
                <Weight className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-green-700 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm">Active Goals</p>
                  <p className="text-2xl font-bold">{goals.filter(g => !g.isCompleted).length}</p>
                  <p className="text-green-300 text-sm">Keep pushing!</p>
                </div>
                <TargetIcon className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Workouts This Week</p>
                  <p className="text-2xl font-bold">
                    {progressEntries.filter(entry => 
                      entry.type === 'workout' && 
                      new Date(entry.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    ).length}
                  </p>
                  <p className="text-purple-300 text-sm">Great consistency!</p>
                </div>
                <Dumbbell className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600 to-orange-700 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-200 text-sm">Avg. Calories</p>
                  <p className="text-2xl font-bold">
                    {Math.round(progressEntries
                      .filter(entry => entry.type === 'nutrition' && entry.nutrition)
                      .reduce((sum, entry) => sum + (entry.nutrition?.calories || 0), 0) / 
                      Math.max(progressEntries.filter(entry => entry.type === 'nutrition').length, 1)
                    )}
                  </p>
                  <p className="text-orange-300 text-sm">Daily intake</p>
                </div>
                <Utensils className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-800 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'goals', label: 'Goals', icon: Target },
            { id: 'entries', label: 'Entries', icon: Activity },
            { id: 'charts', label: 'Charts', icon: LineChart }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Add Entry Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowAddEntry(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Progress Entry
          </Button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Goals Progress */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Goal Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goals.filter(g => !g.isCompleted).map(goal => (
                    <div key={goal._id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{goal.title}</h4>
                          <p className="text-sm text-gray-400">{goal.description}</p>
                        </div>
                        <Badge variant="outline" className="border-gray-600">
                          {goal.current} / {goal.target} {goal.unit}
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${calculateGoalProgress(goal)}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>{calculateGoalProgress(goal).toFixed(1)}% complete</span>
                        <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Entries */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressEntries.slice(0, 5).map(entry => (
                    <div key={entry._id} className="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg">
                      <div className={`p-2 rounded-lg ${getTypeColor(entry.type)}`}>
                        {getTypeIcon(entry.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold capitalize">{entry.type}</h4>
                        <p className="text-sm text-gray-400">
                          {new Date(entry.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="border-gray-600">
                        {entry.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-6">
            {goals.map(goal => (
              <Card key={goal._id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <TargetIcon className="w-6 h-6 text-yellow-500" />
                      <div>
                        <CardTitle className="text-white">{goal.title}</CardTitle>
                        <p className="text-gray-400">{goal.description}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={goal.isCompleted ? "default" : "outline"}
                      className={goal.isCompleted ? "bg-green-600" : "border-gray-600"}
                    >
                      {goal.isCompleted ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Progress</span>
                      <span className="font-semibold">
                        {goal.current} / {goal.target} {goal.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${calculateGoalProgress(goal)}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        {calculateGoalProgress(goal).toFixed(1)}% complete
                      </span>
                      <span className="text-gray-400">
                        Due: {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    {goal.isCompleted && (
                      <div className="flex items-center space-x-2 text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span>Goal achieved!</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'entries' && (
          <div className="space-y-6">
            {progressEntries.map(entry => (
              <Card key={entry._id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(entry.type)}`}>
                        {getTypeIcon(entry.type)}
                      </div>
                      <div>
                        <CardTitle className="text-white capitalize">{entry.type}</CardTitle>
                        <p className="text-gray-400">
                          {new Date(entry.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-gray-600">
                      {entry.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {entry.type === 'weight' && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Weight:</span>
                        <span className="font-semibold">{entry.weight} kg</span>
                      </div>
                      {entry.bodyFatPercentage && (
                        <div className="flex justify-between">
                          <span>Body Fat:</span>
                          <span className="font-semibold">{entry.bodyFatPercentage}%</span>
                        </div>
                      )}
                    </div>
                  )}

                  {entry.type === 'measurements' && entry.measurements && (
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(entry.measurements).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key}:</span>
                          <span className="font-semibold">{value} cm</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {entry.type === 'workout' && entry.workoutProgress && (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Workout:</span>
                        <span className="font-semibold">{entry.workoutProgress.workoutName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-semibold">{entry.workoutProgress.duration} min</span>
                      </div>
                      {entry.workoutProgress.caloriesBurned && (
                        <div className="flex justify-between">
                          <span>Calories Burned:</span>
                          <span className="font-semibold">{entry.workoutProgress.caloriesBurned}</span>
                        </div>
                      )}
                      <div className="space-y-2">
                        <h5 className="font-semibold">Exercises:</h5>
                        {entry.workoutProgress.exercises.map((exercise, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                            <span>{exercise.exerciseName}</span>
                            <div className="flex items-center space-x-2">
                              <span>{exercise.sets}×{exercise.reps}</span>
                              {exercise.weight && <span>{exercise.weight} lbs</span>}
                              {exercise.completed && <CheckCircle className="w-4 h-4 text-green-400" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {entry.type === 'nutrition' && entry.nutrition && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex justify-between">
                          <span>Calories:</span>
                          <span className="font-semibold">{entry.nutrition.calories}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Protein:</span>
                          <span className="font-semibold">{entry.nutrition.protein}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Carbs:</span>
                          <span className="font-semibold">{entry.nutrition.carbs}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fats:</span>
                          <span className="font-semibold">{entry.nutrition.fats}g</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-semibold">Meals:</h5>
                        {entry.nutrition.meals.map((meal, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                            <div>
                              <span className="capitalize">{meal.mealType}:</span>
                              <span className="ml-2">{meal.name}</span>
                            </div>
                            <span>{meal.calories} cal</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {entry.notes && (
                    <div className="mt-4 p-3 bg-gray-700 rounded">
                      <h5 className="font-semibold mb-2">Notes:</h5>
                      <p className="text-gray-300">{entry.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'charts' && (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Weight Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <LineChart className="w-16 h-16 mx-auto mb-4" />
                    <p>Chart visualization coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Workout Frequency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4" />
                    <p>Chart visualization coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <CFooter />
      </main>
    </div>
  );
};

export default CProgress;
