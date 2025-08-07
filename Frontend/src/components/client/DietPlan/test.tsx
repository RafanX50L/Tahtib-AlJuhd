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

const DietPlanPage = () => {
  const [selectedDish, setSelectedDish] = useState(null);
  const [dietPlans, setDietPlan] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchChallenges = async () => {
      setIsLoading(true);
      try {
        // const weeklyChallenges = await ClientService.getWeeklyChallenges();
        // setChallenges(weeklyChallenges as WeeklyChallenges);
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

    setTimeout(() => {
      fetchChallenges();
    }, 3000);
  }, []);
  // Sample data with multiple options to demonstrate handling
  const dietPlan = {
    _id: "6893455a6bd67e4b83ebb379",
    mealPlan: {
      breakfast: {
        options: [
          {
            name: "High-Protein Oatmeal with Berries",
            ingredients: [
              "1/2 cup rolled oats",
              "1 scoop vegan protein powder (soy or pea-based)",
              "1 cup unsweetened almond milk",
              "1/2 cup mixed berries",
              "1 tbsp chia seeds",
            ],
            instructions:
              "Combine oats, protein powder, and almond milk in a saucepan. Cook over medium heat, stirring frequently, until oats are cooked through. Stir in berries and chia seeds.",
            videoLink:
              "https://www.youtube.com/results?search_query=high+protein+oatmeal+recipe",
            _id: "6893455a6bd67e4b83ebb37b",
          },
        ],
        _id: "6893455a6bd67e4b83ebb37a",
      },
      snacks: {
        options: [
          {
            name: "Greek Yogurt with Hemp Seeds",
            ingredients: [
              "1 cup Greek yogurt",
              "1 tbsp hemp seeds",
              "1/2 cup mixed berries",
              "1 tsp honey (optional)",
            ],
            instructions:
              "Mix Greek yogurt with hemp seeds, top with berries and drizzle with honey if desired.",
            videoLink:
              "https://www.youtube.com/results?search_query=greek+yogurt+hemp+seeds",
            _id: "6893455a6bd67e4b83ebb37b1",
          },
          {
            name: "Greek Yogurt with Hemp Seeds",
            ingredients: [
              "1 cup Greek yogurt",
              "1 tbsp hemp seeds",
              "1/2 cup mixed berries",
              "1 tsp honey (optional)",
            ],
            instructions:
              "Mix Greek yogurt with hemp seeds, top with berries and drizzle with honey if desired.",
            videoLink:
              "https://www.youtube.com/results?search_query=greek+yogurt+hemp+seeds",
            _id: "6893455a6bd67e4b83ebb37b1",
          },
          {
            name: "Greek Yogurt with Hemp Seeds",
            ingredients: [
              "1 cup Greek yogurt",
              "1 tbsp hemp seeds",
              "1/2 cup mixed berries",
              "1 tsp honey (optional)",
            ],
            instructions:
              "Mix Greek yogurt with hemp seeds, top with berries and drizzle with honey if desired.",
            videoLink:
              "https://www.youtube.com/results?search_query=greek+yogurt+hemp+seeds",
            _id: "6893455a6bd67e4b83ebb37b1",
          },
          {
            name: "Hummus with Veggie Sticks",
            ingredients: [
              "3 tbsp hummus",
              "1 carrot (cut into sticks)",
              "1 cucumber (sliced)",
              "1/4 bell pepper (strips)",
            ],
            instructions:
              "Prepare vegetables and serve with hummus for dipping.",
            videoLink:
              "https://www.youtube.com/results?search_query=hummus+vegetable+snack",
            _id: "6893455a6bd67e4b83ebb37b2",
          },
        ],
        _id: "6893455a6bd67e4b83ebb37a",
      },
      lunch: {
        options: [
          {
            name: "Quinoa Salad with Black Beans and Avocado",
            ingredients: [
              "1 cup cooked quinoa",
              "1/2 cup black beans (rinsed and drained)",
              "1/2 avocado (diced)",
              "1/4 cup chopped red onion",
              "1/4 cup chopped cilantro",
              "2 tbsp lime juice",
              "1 tbsp olive oil",
              "Salt and pepper to taste",
            ],
            instructions: "Combine all ingredients in a bowl and mix well.",
            videoLink:
              "https://www.youtube.com/results?search_query=quinoa+salad+vegetarian+recipe",
            _id: "6893455a6bd67e4b83ebb37d1",
          },
          {
            name: "Mediterranean Chickpea Bowl",
            ingredients: [
              "1 cup cooked chickpeas",
              "1/2 cucumber (diced)",
              "1/4 cup cherry tomatoes",
              "1/4 cup red onion",
              "2 tbsp olive oil",
              "1 tbsp lemon juice",
              "Fresh herbs",
            ],
            instructions: "Mix all ingredients in a bowl and season to taste.",
            videoLink:
              "https://www.youtube.com/results?search_query=mediterranean+chickpea+bowl",
            _id: "6893455a6bd67e4b83ebb37d2",
          },
          {
            name: "Protein-Packed Hummus Wrap",
            ingredients: [
              "1 whole wheat tortilla",
              "3 tbsp hummus",
              "1/4 cup sprouts",
              "1/2 cucumber sliced",
              "1/4 avocado",
              "Mixed greens",
            ],
            instructions:
              "Spread hummus on tortilla, add vegetables and wrap tightly.",
            videoLink:
              "https://www.youtube.com/results?search_query=hummus+vegetarian+wrap",
            _id: "6893455a6bd67e4b83ebb37d3",
          },
          {
            name: "Lentil Power Bowl",
            ingredients: [
              "3/4 cup cooked lentils",
              "1/2 cup brown rice",
              "1/4 cup roasted vegetables",
              "2 tbsp tahini dressing",
              "1 tbsp hemp seeds",
            ],
            instructions:
              "Layer ingredients in bowl and drizzle with dressing.",
            videoLink:
              "https://www.youtube.com/results?search_query=lentil+power+bowl",
            _id: "6893455a6bd67e4b83ebb37d4",
          },
          {
            name: "Greek-Style Quinoa Salad",
            ingredients: [
              "1 cup quinoa",
              "1/4 cup olives",
              "1/2 cup cherry tomatoes",
              "1/4 cup feta cheese",
              "2 tbsp olive oil",
              "1 tbsp lemon juice",
            ],
            instructions: "Combine cooked quinoa with vegetables and dressing.",
            videoLink:
              "https://www.youtube.com/results?search_query=greek+quinoa+salad",
            _id: "6893455a6bd67e4b83ebb37d5",
          },
          {
            name: "Asian-Inspired Tofu Bowl",
            ingredients: [
              "150g firm tofu",
              "1/2 cup brown rice",
              "1/4 cup edamame",
              "1/4 cup shredded carrots",
              "2 tbsp soy sauce",
              "1 tsp sesame oil",
            ],
            instructions:
              "Pan-fry tofu, serve over rice with vegetables and sauce.",
            videoLink:
              "https://www.youtube.com/results?search_query=tofu+bowl+recipe",
            _id: "6893455a6bd67e4b83ebb37d6",
          },
        ],
        _id: "6893455a6bd67e4b83ebb37c",
      },
      dinner: {
        options: [
          {
            name: "Lentil Shepherd's Pie with Sweet Potato Topping",
            ingredients: [
              "1 cup brown or green lentils",
              "2 cups vegetable broth",
              "1 cup chopped carrots",
              "1 cup chopped celery",
              "1 onion (chopped)",
              "2 cloves garlic (minced)",
              "1 tbsp tomato paste",
              "1 tsp dried thyme",
              "Salt and pepper to taste",
              "2 large sweet potatoes (cooked and mashed)",
            ],
            instructions:
              "Sauté onion, carrots, and celery until softened. Add garlic and tomato paste and cook for 1 minute. Stir in lentils, vegetable broth, thyme, salt, and pepper. Bring to a boil, then reduce heat and simmer for 20-25 minutes, or until lentils are tender. Top with mashed sweet potatoes and bake at 375°F (190°C) for 20 minutes, or until heated through.",
            videoLink:
              "https://www.youtube.com/results?search_query=vegetarian+lentil+shepherd%27s+pie",
            _id: "6893455a6bd67e4b83ebb37f",
          },
          {
            name: "Stuffed Bell Peppers with Quinoa",
            ingredients: [
              "4 bell peppers (tops cut, seeds removed)",
              "1 cup cooked quinoa",
              "1/2 cup black beans",
              "1/4 cup corn",
              "1/4 cup diced tomatoes",
              "1/4 cup cheese (optional)",
              "1 tsp cumin",
              "Salt and pepper to taste",
            ],
            instructions:
              "Mix quinoa, beans, corn, tomatoes, and seasonings. Stuff peppers with mixture, top with cheese if using. Bake at 375°F for 25-30 minutes.",
            videoLink:
              "https://www.youtube.com/results?search_query=stuffed+bell+peppers+quinoa",
            _id: "6893455a6bd67e4b83ebb37f2",
          },
        ],
        _id: "6893455a6bd67e4b83ebb37e",
      },
    },
    notes:
      "This vegetarian diet plan focuses on building muscle mass for a 20-year-old female, aiming for a weight gain of 5kg. It prioritizes vegetarian protein sources like lentils, quinoa, Greek yogurt, eggs, and edamame, while excluding nuts and gluten as per the user's specifications. The plan includes 6 meals to support consistent energy levels and muscle protein synthesis. Remember to adjust portion sizes based on individual needs and activity levels. Consult a healthcare professional or registered dietitian for personalized advice.",
    createdAt: "2025-08-06T12:06:50.080Z",
    updatedAt: "2025-08-06T12:06:50.080Z",
  };

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

  const handleDishClick = (dish, mealType) => {
    setSelectedDish({ ...dish, mealType });
  };

  const handleBackClick = () => {
    setSelectedDish(null);
  };

  // Function to limit displayed options and handle "show more"
  const [showAllOptions, setShowAllOptions] = useState({});

  const toggleShowAllOptions = (mealType) => {
    setShowAllOptions((prev) => ({
      ...prev,
      [mealType]: !prev[mealType],
    }));
  };

  const getDisplayedOptions = (options, mealType) => {
    const maxDisplay = 3;
    if (showAllOptions[mealType] || options.length <= maxDisplay) {
      return options;
    }
    return options.slice(0, maxDisplay);
  };

  const MealCard = ({ mealType, mealData, isSnack = false }) => (
    <div
      className={`bg-gradient-to-br from-[#1E2235] to-[#2A3042] rounded-2xl border border-[#3A4255] overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 ${isSnack ? "md:col-span-2 lg:col-span-1" : ""}`}
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
                  {new Date(dietPlan.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Last Updated</h3>
                <p className="text-[#A0A7B8]">
                  {new Date(dietPlan.updatedAt).toLocaleDateString()}
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
