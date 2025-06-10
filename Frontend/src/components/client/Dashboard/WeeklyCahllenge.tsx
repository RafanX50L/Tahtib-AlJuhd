"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ClientService } from "@/services/implementation/clientServices"
import type { ObjectId } from "mongoose"
import { useSelector } from "react-redux"
import { Calendar, Clock, Users, Trophy } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { RootState } from "@/store/store"

export interface IExercise extends Document {
  name: string
  sets?: string
  reps?: string
  rest?: string
  duration?: string
  instructions: string
  animation_link?: string
}

export interface IWorkoutReport {
  totalExercises?: number
  totalSets?: number
  estimatedDuration?: string
  caloriesBurned?: number
  intensity?: string
  feedback?: string
}

export interface IDay extends Document {
  title: string
  exercises: IExercise[]
  completed?: boolean
  report?: IWorkoutReport
}

export interface IChallenges {
  _id: string
  createdAt: string
  endDate: string
  enteredUsers: ObjectId[]
  score: number
  startDate: string
  tasks: IDay[]
  type: string
  updatedAt: string
}

interface WeeklyChallenges {
  beginner: IChallenges
  intermediate: IChallenges
  advanced: IChallenges
}

const WeeklyChallenge = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [challenges, setChallenges] = useState<WeeklyChallenges | null>(null)
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const userId = user?._id

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setIsLoading(true)
        const weeklyChallenges = await ClientService.getWeeklyChallenges()
        console.log("Fetched challenges:", weeklyChallenges)
        setChallenges(weeklyChallenges as WeeklyChallenges)
      } catch (error) {
        console.log(error)
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred."
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }
    fetchChallenges()
  }, [])

  const isJoinDay = (createdAt: string): boolean => {
    const today = new Date()
    const createdDate = new Date(createdAt)
    today.setHours(0, 0, 0, 0)
    createdDate.setHours(0, 0, 0, 0)
    return today.getTime() === createdDate.getTime()
  }

  const isJoinPeriodOver = (createdAt: string): boolean => {
    const today = new Date()
    const createdDate = new Date(createdAt)
    today.setHours(0, 0, 0, 0)
    createdDate.setHours(0, 0, 0, 0)
    return today.getTime() > createdDate.getTime()
  }

  const getDaysUntilNext = (endDate: string): number => {
    const today = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const isUserJoined = (challenge: IChallenges): boolean => {
    if (!userId || !challenge.enteredUsers) return false
    return challenge.enteredUsers.some(enteredUserId => enteredUserId.toString() === userId.toString())
  }

  const handleChallengeAction = (challenge: IChallenges, challengeType: string) => {
    if (!userId) {
      toast.error("Please login to join challenges", {
        action: {
          label: "Login",
          onClick: () => navigate("/login"),
        },
      })
      return
    }

    const userJoined = isUserJoined(challenge)

    if (isJoinDay(challenge.createdAt) && !userJoined) {
      navigate(`/challenge/${challenge._id}?type=${challengeType}`)
    } else if (userJoined) {
      navigate(`/challenge/${challenge._id}?type=${challengeType}`)
    } else {
      toast.info("Join period for this challenge has ended. Try again next week!")
    }
  }

  const getButtonText = (challenge: IChallenges): string => {
    if (!userId) return "Login Required"
    
    const userJoined = isUserJoined(challenge)

    if (userJoined) {
      return "Continue"
    } else if (isJoinDay(challenge.createdAt)) {
      return "Visit Challenge"
    } else if (isJoinPeriodOver(challenge.createdAt)) {
      return "Next Week"
    } else {
      return "Coming Soon"
    }
  }

  const getButtonVariant = (challenge: IChallenges): "default" | "outline" | "secondary" => {
    if (!userId) return "outline"
    
    const userJoined = isUserJoined(challenge)

    if (userJoined) {
      return "default"
    } else if (isJoinDay(challenge.createdAt)) {
      return "default"
    } else {
      return "outline"
    }
  }

  const isButtonDisabled = (challenge: IChallenges): boolean => {
    if (!userId) return true
    
    const userJoined = isUserJoined(challenge)
    return !userJoined && !isJoinDay(challenge.createdAt)
  }

  const getChallengeProgress = (challenge: IChallenges): number => {
    if (!userId || !isUserJoined(challenge) || !challenge.tasks) return 0
    const completedTasks = challenge.tasks.filter((task) => task.completed).length
    return (completedTasks / challenge.tasks.length) * 100
  }

  const getChallengeColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case "beginner":
        return "from-green-500 to-green-600"
      case "intermediate":
        return "from-yellow-500 to-orange-500"
      case "advanced":
        return "from-red-500 to-red-600"
      default:
        return "from-blue-500 to-blue-600"
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border-[#2A3042] mb-10 relative animate-[fadeIn_0.6s_ease-out_0.2s_forwards]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF9F43] to-[#FF4757]"></div>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white">Loading Weekly Challenges...</p>
        </div>
      </Card>
    )
  }

  if (!challenges || !challenges.beginner || !challenges.intermediate || !challenges.advanced) {
    return (
      <Card className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border-[#2A3042] mb-10 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF9F43] to-[#FF4757]"></div>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-white">No challenges available at the moment.</p>
        </CardContent>
      </Card>
    )
  }

  const challengeArray = [
    { ...challenges.beginner, type: "beginner" },
    { ...challenges.intermediate, type: "intermediate" },
    { ...challenges.advanced, type: "advanced" },
  ].filter(Boolean) as IChallenges[]

  return (
    <Card className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border-[#2A3042] mb-10 relative animate-[fadeIn_0.6s_ease-out_0.2s_forwards]">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF9F43] to-[#FF4757]"></div>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#FF9F43]" />
            Weekly Challenge
          </CardTitle>
          <div className="text-[#5D5FEF] text-sm cursor-pointer hover:text-[#7577F5] hover:underline flex items-center gap-2">
            View Leaderboard <span>→</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {challengeArray.map((challenge, index) => {
          const progress = getChallengeProgress(challenge)
          const userJoined = isUserJoined(challenge)
          const daysLeft = getDaysUntilNext(challenge.endDate)

          return (
            <div
              key={challenge._id}
              className={`flex flex-col md:flex-row gap-4 p-4 rounded-lg bg-gradient-to-r from-[#2A3042] to-[rgba(42,48,66,0.5)] border border-[#3A4052] ${index < challengeArray.length - 1 ? "mb-4" : ""}`}
            >
              <div className="flex-grow space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-lg text-white capitalize flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getChallengeColor(challenge.type)}`}></div>
                    {challenge.type} Challenge
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[#A0A7B8]">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {challenge.enteredUsers?.length || 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {daysLeft}d left
                    </div>
                  </div>
                </div>

                

                <div className="flex items-center justify-between">
                  <div className="text-[#A0A7B8] text-sm">
                    {userJoined
                      ? ` ${challenge.tasks?.length || 0} workouts`
                      : `${challenge.tasks?.length || 0} workouts • ${challenge.enteredUsers?.length || 0} participants`}
                  </div>

                  {isJoinPeriodOver(challenge.createdAt) && !userJoined && (
                    <div className="text-xs text-[#FF4757] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Join period ended
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <Button
                  variant={getButtonVariant(challenge)}
                  disabled={isButtonDisabled(challenge)}
                  className={`min-w-[120px] ${
                    !isButtonDisabled(challenge)
                      ? `bg-gradient-to-r ${getChallengeColor(challenge.type)} text-white hover:-translate-y-1 hover:shadow-xl transition-all duration-200`
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => handleChallengeAction(challenge, challenge.type)}
                >
                  {getButtonText(challenge)}
                </Button>

                {isJoinPeriodOver(challenge.createdAt) && !userJoined && (
                  <p className="text-xs text-[#A0A7B8] mt-2 text-center">Try again next week!</p>
                )}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default WeeklyChallenge