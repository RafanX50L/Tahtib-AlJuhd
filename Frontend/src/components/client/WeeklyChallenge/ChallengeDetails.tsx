import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ClientService } from "@/services/implementation/clientServices";
import { useSelector } from "react-redux";
import {
  Calendar,
  Clock,
  Users,
  Trophy,
  Lock,
  CheckCircle,
  PlayCircle,
  ArrowLeft,
  Target,
  Zap,
  FileText,
} from "lucide-react";
import type { ObjectId } from "mongoose";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

interface IExercise {
  name: string;
  sets?: string;
  reps?: string;
  rest?: string;
  duration?: string;
  instructions: string;
  animation_link?: string;
}

interface IWorkoutReport {
  totalExercises?: number;
  totalSets?: number;
  estimatedDuration?: string;
  caloriesBurned?: number;
  intensity?: string;
  feedback?: string;
}

interface IDay {
  title: string;
  exercises: IExercise[];
  completed?: boolean;
  report?: IWorkoutReport;
}

interface IChallenges {
  _id: string;
  createdAt: string;
  endDate: string;
  enteredUsers: ObjectId[];
  score: number;
  startDate: string;
  tasks: IDay[];
  type: string;
  updatedAt: string;
}

interface IUserDayReport {
  dayIndex: number;
  completed: boolean;
  completedAt: Date;
  report: {
    caloriesBurned: string;
    feedback: string;
    intensity: string;
    estimatedDuration: string;
    totalExercises: string;
    totalSets: string;
  };
}

interface IUserWeeklyChallenge {
  user: string;
  challenge: string;
  type: string;
  startDate: string;
  progress: IUserDayReport[];
  score: number;
}

interface RootState {
  auth: {
    user: {
      _id: string;
    };
  };
}

const ChallengeDetail = () => {
  const params = useParams();
  const searchParams = new URLSearchParams(useSearchParams()[0]);
  const navigate = useNavigate();
  const challengeId = params.id as string;
  const challengeType = searchParams.get("type") || "beginner";

  const [challenge, setChallenge] = useState<IChallenges | null>(null);
  const [userWeeklyChallenge, setUserWeeklyChallenge] = useState<IUserWeeklyChallenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [expandedReport, setExpandedReport] = useState<number | null>(null);

  const userId = useSelector((state: RootState) => state.auth.user?._id);

  useEffect(() => {
    const fetchChallenge = async (retries = 3) => {
      try {
        setIsLoading(true);
        const response = await ClientService.getChallengeById(challengeId);
        const challengeData = response.data as {
          challenge: IChallenges;
          userWeeklyChallenge: IUserWeeklyChallenge;
        };

        if (
          !challengeData.challenge ||
          !Array.isArray(challengeData.challenge.tasks) ||
          !Array.isArray(challengeData.challenge.enteredUsers)
        ) {
          throw new Error("Invalid challenge data");
        }

        setChallenge(challengeData.challenge);
        setUserWeeklyChallenge(challengeData.userWeeklyChallenge);

        if (
          userId &&
          challengeData.challenge.enteredUsers.some(
            (enteredUserId: ObjectId) => enteredUserId.toString() === userId.toString()
          )
        ) {
          const joinDate = new Date(challengeData.challenge.startDate);
          const daysSinceJoin = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
          setCurrentDayIndex(Math.min(Math.max(daysSinceJoin, 0), challengeData.challenge.tasks.length - 1));
        }
      } catch (error) {
        console.error("Error fetching challenge:", error);
        if (retries > 0) {
          setTimeout(() => fetchChallenge(retries - 1), 1000);
        } else {
          toast.error("Failed to load challenge details. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (challengeId) {
      fetchChallenge();
    }
  }, [challengeId, userId]);

  const isUserJoined = (): boolean => {
    if (!userId || !challenge || !challenge.enteredUsers) return false;
    return challenge.enteredUsers.some(
      (enteredUserId: ObjectId) => enteredUserId.toString() === userId.toString()
    );
  };

  const handleJoinChallenge = async () => {
    if (!userId) {
      toast.error("Please login to join challenges", {
        action: {
          label: "Login",
          onClick: () => navigate("/login"),
        },
      });
      return;
    }

    try {
      setIsJoining(true);
      await ClientService.joinChallenge(challengeId);
      const response = await ClientService.getChallengeById(challengeId);
      const challengeData = response.data as {
        challenge: IChallenges;
        userWeeklyChallenge: IUserWeeklyChallenge;
      };
      const updatedChallenge = challengeData.challenge;
      const updatedUserWeeklyChallenge = challengeData.userWeeklyChallenge;

      if (
        !updatedChallenge ||
        !Array.isArray(updatedChallenge.tasks) ||
        !Array.isArray(updatedChallenge.enteredUsers)
      ) {
        throw new Error("Invalid updated challenge data");
      }

      setChallenge(updatedChallenge);
      setUserWeeklyChallenge(updatedUserWeeklyChallenge);
      setCurrentDayIndex(0);
      toast.success("Successfully joined the challenge!");
    } catch (error) {
      console.error("Error joining challenge:", error);
      toast.error("Failed to join challenge");
    } finally {
      setIsJoining(false);
    }
  };

  const handleStartWorkout = (dayIndex: number) => {
    if (dayIndex <= currentDayIndex) {
      localStorage.setItem(
        "Current_Workout_Exercises",
        JSON.stringify({
          exercises: challenge?.tasks[dayIndex].exercises,
          day: dayIndex,
          challengeId: challenge?._id,
        })
      );
      navigate("/workoutSession");
    } else {
      toast.info("Complete previous days to unlock this workout!");
    }
  };

  const toggleReport = (dayIndex: number) => {
    setExpandedReport(expandedReport === dayIndex ? null : dayIndex);
  };

  const getChallengeColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case "beginner":
        return "from-green-500 to-green-600";
      case "intermediate":
        return "from-yellow-500 to-orange-500";
      case "advanced":
        return "from-red-500 to-red-600";
      default:
        return "from-blue-500 to-blue-600";
    }
  };

  const getIntensityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "beginner":
        return <Target className="w-4 h-4" />;
      case "intermediate":
        return <Zap className="w-4 h-4" />;
      case "advanced":
        return <Trophy className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1419] to-[#1E2235] p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border-[#2A3042]">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-white">Loading Challenge Details...</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!challenge || !Array.isArray(challenge.tasks) || !Array.isArray(challenge.enteredUsers)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1419] to-[#1E2235] p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border-[#2A3042]">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-white">Challenge not found.</p>
              <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const userJoined = isUserJoined();
  const daysLeft = Math.ceil(
    (new Date(challenge.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1419] to-[#1E2235] p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-[#2A3042]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white capitalize">{challengeType} Challenge</h1>
        </div>

        <Card className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border-[#2A3042]">
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getChallengeColor(challengeType)}`}></div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${getChallengeColor(challengeType)}`}>
                  {getIntensityIcon(challengeType)}
                </div>
                <div>
                  <CardTitle className="text-xl text-white capitalize">{challengeType} Weekly Challenge</CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-[#A0A7B8]">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {challenge.enteredUsers.length} participants
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {daysLeft} days left
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {challenge.tasks.length} workouts
                    </div>
                  </div>
                </div>
              </div>

              {!userJoined && userId && (
                <Button
                  onClick={handleJoinChallenge}
                  disabled={isJoining}
                  className={`bg-gradient-to-r ${getChallengeColor(challengeType)} text-white hover:-translate-y-1 hover:shadow-xl transition-all duration-200`}
                >
                  {isJoining ? "Joining..." : "Join Challenge"}
                </Button>
              )}

              {!userId && (
                <Button
                  onClick={() => navigate("/login")}
                  className="bg-gradient-to-r from-[#5D5FEF] to-[#7577F5] text-white hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
                >
                  Login to Join
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-4">
          <h2 className="text-xl font-semibold text-white">Workout Schedule</h2>
          {userJoined && currentDayIndex < challenge.tasks.length && userWeeklyChallenge?.progress.find((p) => p.dayIndex === currentDayIndex)?.completed && (
            <Card className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border-[#2A3042] animate-in fade-in duration-300">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Today's Workout Completed!
                </h3>
                <p className="text-[#A0A7B8] mb-4">
                  Great job! You can do the next workout tomorrow.
                </p>
              </CardContent>
            </Card>
          )}
          {challenge.tasks.map((day, index) => {
            const isAccessible = userJoined && index <= currentDayIndex;
            const isCompleted = userWeeklyChallenge?.progress.find((p) => p.dayIndex === index)?.completed ?? false;
            const isCurrentDay = userJoined && index === currentDayIndex;
            const dayReport = userWeeklyChallenge?.progress.find((p) => p.dayIndex === index)?.report;

            return (
              <div key={index} className="space-y-2">
                <Card
                  className={`bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border-[#2A3042] transition-all duration-200 ${
                    isCurrentDay ? "ring-2 ring-[#5D5FEF]" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-full ${
                            isCompleted
                              ? "bg-green-500"
                              : isAccessible
                                ? `bg-gradient-to-r ${getChallengeColor(challengeType)}`
                                : "bg-[#2A3042]"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : isAccessible ? (
                            <PlayCircle className="w-5 h-5 text-white" />
                          ) : (
                            <Lock className="w-5 h-5 text-[#A0A7B8]" />
                          )}
                        </div>

                        <div>
                          <h3 className={`font-semibold ${isAccessible ? "text-white" : "text-[#A0A7B8]"}`}>
                            Day {index + 1}: {day.title}
                          </h3>
                          <p className="text-sm text-[#A0A7B8] mt-1">
                            {day.exercises?.length || 0} exercises
                            {dayReport?.estimatedDuration && ` • ${dayReport.estimatedDuration}`}
                          </p>
                          {isCurrentDay && (
                            <Badge variant="secondary" className="mt-2 bg-[#5D5FEF] text-white">
                              Today's Workout
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {!isCompleted && (
                          <Button
                            variant={isAccessible ? "default" : "outline"}
                            disabled={!isAccessible}
                            onClick={() => handleStartWorkout(index)}
                            className={isAccessible ? `bg-gradient-to-r ${getChallengeColor(challengeType)} text-white` : "text-[#A0A7B8]"}
                          >
                            {isAccessible ? "Start" : "Locked"}
                          </Button>
                        )}
                        {isCompleted && (
                          <Button
                            variant="outline"
                            onClick={() => toggleReport(index)}
                            className="text-white bg-[#5D5FEF] border-[#5D5FEF] hover:bg-[#3d3e74] hover:text-white transition-all duration-200"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            {expandedReport === index ? "Hide Report" : "Workout Report"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {isCompleted && expandedReport === index && dayReport && (
                  <Card className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border-[#2A3042] animate-in fade-in duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-6 h-6 text-[#5D5FEF]" />
                        <h4 className="text-lg font-semibold text-white">Day {index + 1} Workout Report</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-[#A0A7B8]">
                        <div>
                          <p className="text-sm font-medium">Total Exercises</p>
                          <p className="text-white text-lg">{dayReport.totalExercises}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Total Sets</p>
                          <p className="text-white text-lg">{dayReport.totalSets}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Estimated Duration</p>
                          <p className="text-white text-lg">{dayReport.estimatedDuration}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Calories Burned</p>
                          <p className="text-white text-lg">{dayReport.caloriesBurned}</p>
                        </div>
                        {dayReport.intensity && (
                          <div>
                            <p className="text-sm font-medium">Intensity</p>
                            <p className="text-white text-lg capitalize">{dayReport.intensity}</p>
                          </div>
                        )}
                        {dayReport.feedback && (
                          <div className="col-span-2">
                            <p className="text-sm font-medium">Feedback</p>
                            <p className="text-white text-lg">{dayReport.feedback}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>

        {!userJoined && userId && (
          <Card className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border-[#2A3042]">
            <CardContent className="p-6 text-center">
              <Lock className="w-12 h-12 text-[#A0A7B8] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Join the Challenge to Access Workouts
              </h3>
              <p className="text-[#A0A7B8] mb-4">
                Join this challenge to unlock all workouts and track your progress.
              </p>
              <Button
                onClick={handleJoinChallenge}
                disabled={isJoining}
                className={`bg-gradient-to-r ${getChallengeColor(challengeType)} text-white hover:-translate-y-1 hover:shadow-xl transition-all duration-200`}
              >
                {isJoining ? "Joining..." : "Join Challenge Now"}
              </Button>
            </CardContent>
          </Card>
        )}

        {!userId && (
          <Card className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border-[#2A3042]">
            <CardContent className="p-6 text-center">
              <Lock className="w-12 h-12 text-[#A0A7B8] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Login Required</h3>
              <p className="text-[#A0A7B8] mb-4">
                Please login to join challenges and access workouts.
              </p>
              <Button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-[#5D5FEF] to-[#7577F5] text-white hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
              >
                Login to Continue
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ChallengeDetail;