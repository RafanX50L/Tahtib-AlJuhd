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
  Lock,
  CheckCircle,
  PlayCircle,
  ArrowLeft,
  Target,
  Zap,
  Trophy,
} from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { RootState } from "@/store/store";
import { IUserWeeklyChallengeView } from "@/interfaces/client/IWeeklyChallenges";
import { IChallengesViews } from "@/interfaces/client/IWorkout";


const ChallengeDetail = () => {
  const params = useParams();
  const searchParams = new URLSearchParams(useSearchParams()[0]);
  const navigate = useNavigate();
  const challengeId = params.id as string;
  const challengeType = searchParams.get("type") || "beginner";

  const [challenge, setChallenge] = useState<IChallengesViews | null>(null);
  const [userWeeklyChallenge, setUserWeeklyChallenge] = useState<IUserWeeklyChallengeView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  const userId = useSelector((state: RootState) => state.auth.user?._id);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setIsLoading(true);
        const response = await ClientService.getChallengeById(challengeId);
        const challengeData = response.data as {
          challenge: IChallengesViews;
          userProgress: IUserWeeklyChallengeView;
        };

        if (
          !challengeData.challenge ||
          !Array.isArray(challengeData.challenge.tasks) ||
          !Array.isArray(challengeData.challenge.enteredUsers)
        ) {
          throw new Error("Invalid challenge data");
        }

        setChallenge(challengeData.challenge);
        setUserWeeklyChallenge(challengeData.userProgress);

        if (userId && isUserJoined(challengeData.challenge)) {
          updateCurrentDayIndex(challengeData.challenge, challengeData.userProgress);
        }
      } catch (error) {
        console.error("Error fetching challenge:", error);
        toast.error("Failed to load challenge details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (challengeId) {
      fetchChallenge();
    }
  }, [challengeId, userId]);

  const isUserJoined = (challengeData: IChallengesViews = challenge!): boolean => {
    if (!userId || !challengeData || !challengeData.enteredUsers) return false;
    return challengeData.enteredUsers.some(
      (enteredUserId) => enteredUserId.toString() === userId.toString()
    );
  };

  const updateCurrentDayIndex = (challengeData: IChallengesViews, userProgress: IUserWeeklyChallengeView | null) => {
    const challengeStartDate = new Date(challengeData.startDate);
    const today = new Date();
    challengeStartDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const daysSinceStart = Math.floor(
      (today.getTime() - challengeStartDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const progress = userProgress?.progress || [];
    let maxAccessibleDay = 0;
    for (let i = 0; i < challengeData.tasks.length; i++) {
      const isDayCompleted = progress.some((p) => p.dayIndex === i && p.completed);
      if (isDayCompleted) {
        maxAccessibleDay = i + 1;
      } else {
        break;
      }
    }

    const currentDay = Math.min(
      daysSinceStart,
      maxAccessibleDay,
      challengeData.tasks.length - 1
    );
    setCurrentDayIndex(currentDay);
  };

  const handleJoinChallenge = async () => {
    if (!userId) {
      toast.error("Please login to join challenges", {
        action: { label: "Login", onClick: () => navigate("/login") },
      });
      return;
    }

    try {
      setIsJoining(true);
      await ClientService.joinChallenge(challengeId);
      const response = await ClientService.getChallengeById(challengeId);
      const challengeData = response.data as {
        challenge: IChallengesViews;
        userProgress: IUserWeeklyChallengeView;
      };

      console.log(challengeData);
      setChallenge(challengeData.challenge);
      setUserWeeklyChallenge(challengeData.userProgress);
      updateCurrentDayIndex(challengeData.challenge, challengeData.userProgress);
      toast.success("Successfully joined the challenge!");
    } catch (error) {
      toast.error(`Failed to join challenge. Please try again : ${error}`);
    } finally {
      setIsJoining(false);
    }
  };

  const isDayAccessible = (dayIndex: number): boolean => {
    if (!userWeeklyChallenge || !challenge) return false;

    const challengeStartDate = new Date(challenge.startDate);
    const today = new Date();
    challengeStartDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const daysSinceStart = Math.floor(
      (today.getTime() - challengeStartDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (dayIndex > daysSinceStart) return false;

    for (let i = 0; i < dayIndex; i++) {
      const isPreviousDayCompleted = userWeeklyChallenge.progress.some(
        (p) => p.dayIndex === i && p.completed
      );
      if (!isPreviousDayCompleted) return false;
    }

    return true;
  };

  const handleStartWorkout = (dayIndex: number) => {
    if (isDayAccessible(dayIndex)) {
      const isCompleted = userWeeklyChallenge?.progress.some((p) => p.dayIndex === dayIndex && p.completed) ?? false;
      if (isCompleted) {
        toast.info("This workout is already completed!");
        return;
      }
      localStorage.setItem(
        "Current_Workout_Exercises",
        JSON.stringify({
          exercises: challenge?.tasks[dayIndex].exercises,
          day: dayIndex,
          challengeId: challenge?.id,
        })
      );
      navigate("/workoutSession");
    } else {
      const challengeStartDate = new Date(challenge?.startDate || "");
      const targetDate = new Date(challengeStartDate);
      targetDate.setDate(challengeStartDate.getDate() + dayIndex);
      const formattedDate = targetDate.toLocaleDateString();
      toast.info(
        dayIndex > currentDayIndex
          ? `This workout unlocks on ${formattedDate}.`
          : "Complete the previous day's workout to unlock this one!"
      );
    }
  };

  const getChallengeColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case "beginner": return "from-green-500 to-green-600";
      case "intermediate": return "from-yellow-500 to-orange-500";
      case "advanced": return "from-red-500 to-red-600";
      default: return "from-blue-500 to-blue-600";
    }
  };

  const getIntensityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "beginner": return <Target className="w-4 h-4" />;
      case "intermediate": return <Zap className="w-4 h-4" />;
      case "advanced": return <Trophy className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-[#0F1419] to-[#1E2235] p-4 text-white">Loading...</div>;
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1419] to-[#1E2235] p-4">
        <Card className="bg-[#1E2235] border-[#2A3042]">
          <CardContent className="p-6 text-center text-white">
            <p>Challenge not found.</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userJoined = isUserJoined();
  const daysLeft = Math.ceil((new Date(challenge.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1419] to-[#1E2235] p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-white"><ArrowLeft /></Button>
          <h1 className="text-2xl font-bold text-white capitalize">{challengeType} Challenge</h1>
        </div>

        <Card className="bg-[#1E2235] border-[#2A3042]">
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
                    <div className="flex items-center gap-1"><Users className="w-4 h-4" />{challenge.enteredUsers.length} participants</div>
                    <div className="flex items-center gap-1"><Calendar className="w-4 h-4" />{daysLeft} days left</div>
                    <div className="flex items-center gap-1"><Clock className="w-4 h-4" />{challenge.tasks.length} workouts</div>
                  </div>
                </div>
              </div>
              {!userJoined && userId && (
                <Button
                  onClick={handleJoinChallenge}
                  disabled={isJoining}
                  className={`bg-gradient-to-r ${getChallengeColor(challengeType)} text-white`}
                >
                  {isJoining ? "Joining..." : "Join Challenge"}
                </Button>
              )}
              {!userId && (
                <Button onClick={() => navigate("/login")} className="bg-gradient-to-r from-[#5D5FEF] to-[#7577F5] text-white">
                  Login to Join
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-4">
          <h2 className="text-xl font-semibold text-white">Workout Schedule</h2>
          {challenge.tasks.map((day, index) => {
            const isAccessible = userJoined && isDayAccessible(index);
            const isCompleted = userWeeklyChallenge?.progress.some((p) => p.dayIndex === index && p.completed) ?? false;
            const isCurrentDay = userJoined && index === currentDayIndex;

            return (
              <Card
                key={index}
                className={`bg-[#1E2235] border-[#2A3042] ${isCurrentDay ? "ring-2 ring-[#5D5FEF]" : ""}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-full ${
                          isCompleted ? "bg-green-500" : isAccessible ? `bg-gradient-to-r ${getChallengeColor(challengeType)}` : "bg-[#2A3042]"
                        }`}
                      >
                        {isCompleted ? <CheckCircle className="w-5 h-5 text-white" /> : isAccessible ? <PlayCircle className="w-5 h-5 text-white" /> : <Lock className="w-5 h-5 text-[#A0A7B8]" />}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isAccessible || isCompleted ? "text-white" : "text-[#A0A7B8]"}`}>
                          Day {index + 1}: {day.title}
                        </h3>
                        <p className="text-sm text-[#A0A7B8] mt-1">{day.exercises?.length || 0} exercises</p>
                        {isCurrentDay && (
                          <Badge className={isCompleted ? "bg-green-500" : "bg-[#5D5FEF]"}>{isCompleted ? "Completed" : "Today's Workout"}</Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant={isAccessible && !isCompleted ? "default" : "outline"}
                      disabled={!isAccessible || isCompleted}
                      onClick={() => handleStartWorkout(index)}
                      className={isAccessible && !isCompleted ? `bg-gradient-to-r ${getChallengeColor(challengeType)} text-white` : "text-[#A0A7B8]"}
                    >
                      {isCompleted ? "Done" : isAccessible ? "Start" : "Locked"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {!userJoined && userId && (
          <Card className="bg-[#1E2235] border-[#2A3042]">
            <CardContent className="p-6 text-center text-white">
              <Lock className="w-12 h-12 text-[#A0A7B8] mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Join the Challenge</h3>
              <p className="text-[#A0A7B8] mb-4">Join now to start your workout journey!</p>
              <Button
                onClick={handleJoinChallenge}
                disabled={isJoining}
                className={`bg-gradient-to-r ${getChallengeColor(challengeType)} text-white`}
              >
                {isJoining ? "Joining..." : "Join Now"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ChallengeDetail;