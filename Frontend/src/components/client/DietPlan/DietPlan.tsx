import React, { useEffect, useState } from "react";
import {
  FaUtensils,
  FaClock,
  FaPlayCircle,
  FaChevronRight,
  FaArrowLeft,
  FaSun,
  FaMoon,
  FaCloudSun,
  FaLeaf,
  FaCookie,
  FaAppleAlt,
} from "react-icons/fa";
import { toast } from "sonner";
import Loading from "../Loading";
import { TrainerService } from "@/services/implementation/trainerServices";
import { ClientService } from "@/services/implementation/clientServices";

interface Dish {
  name: string;
  ingredients: string[];
  instructions: string;
  videoLink: string;
  _id: string;
}

interface MealPlan {
  breakfast?: { options: Dish[]; _id: string };
  snacks?: { options: Dish[]; _id: string };
  lunch?: { options: Dish[]; _id: string };
  dinner?: { options: Dish[]; _id: string };
  [key: string]: { options: Dish[]; _id: string } | undefined;
}

interface DietPlan {
  mealPlan: MealPlan;
  notes: string;
  created: string;
  updated: string;
}

interface SelectedDish extends Dish {
  mealType: string;
}

const DietPlanPage: React.FC = () => {
  const [selectedDish, setSelectedDish] = useState<SelectedDish | null>(null);
  const [dietPlan, setDietPlan] = useState<DietPlan>({
    mealPlan: {},
    notes: "",
    created: "",
    updated: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchChallenges = async () => {
      setIsLoading(true);
      try {
        const response = await ClientService.getDietPlan();
        console.log(response);
        setDietPlan(response);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  // Separate main meals from snacks
  const mainMeals = ["breakfast", "lunch", "dinner"];
  const snackMeals = ["snacks"];

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case "breakfast":
        return <FaSun className="text-yellow-400" />;
      case "lunch":
        return <FaCloudSun className="text-orange-400" />;
      case "dinner":
        return <FaMoon className="text-blue-400" />;
      case "snacks":
        return <FaAppleAlt className="text-green-400" />;
      default:
        return <FaUtensils className="text-green-400" />;
    }
  };

  const getMealTime = (mealType: string) => {
    switch (mealType) {
      case "breakfast":
        return "7:00 - 9:00 AM";
      case "lunch":
        return "12:00 - 2:00 PM";
      case "dinner":
        return "7:00 - 9:00 PM";
      case "snacks":
        return "Between meals";
      default:
        return "";
    }
  };

  const handleDishClick = (dish: Dish, mealType: string) => {
    setSelectedDish({ ...dish, mealType });
  };

  const handleBackClick = () => {
    setSelectedDish(null);
  };

  // Function to limit displayed options and handle "show more"
  const [showAllOptions, setShowAllOptions] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleShowAllOptions = (mealType: string) => {
    setShowAllOptions((prev) => ({
      ...prev,
      [mealType]: !prev[mealType],
    }));
  };

  const getDisplayedOptions = (options: Dish[], mealType: string) => {
    const maxDisplay = 3;
    if (showAllOptions[mealType] || options.length <= maxDisplay) {
      return options;
    }
    return options.slice(0, maxDisplay);
  };

  const MealCard: React.FC<{
    mealType: string;
    mealData: { options: Dish[]; _id: string };
    isSnack?: boolean;
  }> = ({ mealType, mealData, isSnack = false }) => (
    <div
      className={`bg-gradient-to-br from-[#1E2235] to-[#2A3042] rounded-2xl border border-[#3A4255] overflow不便overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 ${isSnack ? "md:col-span-2 lg:col-span-1" : ""}`}
    >
      <div className="p-6">
        {/* Meal Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-r from-[#5D5FEF] to-[#7577F5] rounded-xl">
            {getMealIcon(mealType)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white capitalize">
              {mealType}
            </h2>
            <p className="text-[#A0A7B8] text-sm">{getMealTime(mealType)}</p>
          </div>
        </div>

        {/* Meal Options */}
        <div className="space-y-3">
          {getDisplayedOptions(mealData.options, mealType).map(
            (dish, index) => (
              <div
                key={dish._id}
                onClick={() => handleDishClick(dish, mealType)}
                className="p-4 bg-[#12151E] rounded-lg border border-[#2A3042] hover:border-[#5D5FEF] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2 group-hover:text-[#5D5FEF] transition-colors">
                      {dish.name}
                    </h3>
                    <p className="text-[#A0A7B8] text-sm">
                      {dish.ingredients.length} ingredients • Click to view
                      recipe
                    </p>
                  </div>
                  <FaChevronRight className="text-[#5D5FEF] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            )
          )}

          {/* Show More/Less Button */}
          {mealData.options.length > 3 && (
            <button
              onClick={() => toggleShowAllOptions(mealType)}
              className="w-full p-3 bg-gradient-to-r from-[#5D5FEF] to-[#7577F5] text-white rounded-lg hover:from-[#6B6DF7] hover:to-[#8385F7] transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>
                {showAllOptions[mealType]
                  ? `Show Less (${mealData.options.length - 3} hidden)`
                  : `Show All Options (${mealData.options.length - 3} more)`}
              </span>
              <FaChevronRight
                className={`transform transition-transform ${
                  showAllOptions[mealType] ? "rotate-90" : "rotate-0"
                }`}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (selectedDish) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#12151E] to-[#1E2235] p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={handleBackClick}
              className="flex items-center gap-2 text-[#5D5FEF] hover:text-[#7577F5] transition-colors"
            >
              <FaArrowLeft />
              <span>Back to Diet Plan</span>
            </button>
          </div>

          {/* Dish Details Card */}
          <div className="bg-gradient-to-r from-[#1E2235] to-[#2A3042] rounded-2xl border border-[#3A4255] overflow-hidden shadow-2xl">
            <div className="p-8">
              {/* Dish Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-[#5D5FEF] to-[#7577F5] rounded-xl">
                    {getMealIcon(selectedDish.mealType)}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                      {selectedDish.name}
                    </h1>
                    <div className="flex items-center gap-4 text-[#A0A7B8]">
                      <div className="flex items-center gap-2">
                        <FaClock className="w-4 h-4" />
                        <span className="capitalize">
                          {selectedDish.mealType} •{" "}
                          {getMealTime(selectedDish.mealType)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaLeaf className="w-4 h-4 text-green-400" />
                        <span>Vegetarian</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <FaUtensils className="text-[#5D5FEF]" />
                  Ingredients
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedDish.ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-[#12151E] rounded-lg border border-[#2A3042]"
                    >
                      <div className="w-2 h-2 bg-[#5D5FEF] rounded-full flex-shrink-0"></div>
                      <span className="text-[#A0A7B8]">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Instructions
                </h2>
                <div className="bg-[#12151E] rounded-lg border border-[#2A3042] p-6">
                  <p className="text-[#A0A7B8] leading-relaxed">
                    {selectedDish.instructions}
                  </p>
                </div>
              </div>

              {/* Video Link */}
              <div>
                <a
                  href={selectedDish.videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105"
                >
                  <FaPlayCircle className="w-5 h-5" />
                  <span>Watch Recipe Video</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <Loading content="Loading Diet Plan...." />;
  } else {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#12151E] to-[#1E2235] p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Your Diet Plan
            </h1>
            <p className="text-[#A0A7B8] text-lg max-w-2xl mx-auto">
              Personalized vegetarian meal plan designed for muscle building and
              healthy weight gain
            </p>
          </div>

          {/* Main Meals Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <FaUtensils className="text-[#5D5FEF]" />
              Main Meals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mainMeals.map((mealType) => {
                const mealData = dietPlan.mealPlan[mealType];
                return mealData ? (
                  <MealCard
                    key={mealType}
                    mealType={mealType}
                    mealData={mealData}
                  />
                ) : null;
              })}
            </div>
          </div>

          {/* Snacks Section */}
          {snackMeals.some((mealType) => dietPlan.mealPlan[mealType]) && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <FaAppleAlt className="text-green-400" />
                Snacks & Light Bites
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {snackMeals.map((mealType) => {
                  const mealData = dietPlan.mealPlan[mealType];
                  return mealData ? (
                    <MealCard
                      key={mealType}
                      mealType={mealType}
                      mealData={mealData}
                      isSnack={true}
                    />
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Notes Section */}
          <div className="bg-gradient-to-r from-[#1E2235] to-[#2A3042] rounded-2xl border border-[#3A4255] p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <FaLeaf className="text-green-400" />
              Diet Plan Notes
            </h2>
            <p className="text-[#A0A7B8] leading-relaxed">{dietPlan.notes}</p>

            {/* Plan Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-[#3A4255]">
              <div>
                <h3 className="text-white font-semibold mb-2">Plan Created</h3>
                <p className="text-[#A0A7B8]">
                  {new Date(dietPlan.created).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Last Updated</h3>
                <p className="text-[#A0A7B8]">
                  {new Date(dietPlan.updated).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default DietPlanPage;