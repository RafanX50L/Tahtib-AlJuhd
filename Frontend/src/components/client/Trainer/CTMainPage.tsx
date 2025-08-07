import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
} from "lucide-react";
import { ClientService } from "@/services/implementation/clientServices";
import { useNavigate } from "react-router-dom";
import { CurrentTrainerCard, PreviousTrainerCard } from "./TrainerCards";

export interface Trainer {
  _id: string;
  name: string;

  personalization?: {
    data: {
      basicInfo: {
        profilePhoto: string;
        weeklySalary: number;
      };
      professionalSummary?: {
        specializations?: string[];
        yearsOfExperience?: string;
      };
      profilePicture?: string;
    };
  };
}

// Sample Current Trainer
const sampleCurrentTrainer: Trainer = {
  _id: "trainer_001",
  name: "Alex Johnson",
  personalization: {
    data: {
      basicInfo: {
        profilePhoto: "https://example.com/images/trainers/alex_johnson.jpg",
        weeklySalary: 150,
      },
      professionalSummary: {
        specializations: ["Strength", "Cardio", "HIIT"],
        yearsOfExperience: "8 years",
      },
    },
  },
};

// Sample Previous Trainers
const samplePreviousTrainers: Trainer[] = [
  {
    _id: "trainer_002",
    name: "Sarah Miller",
    personalization: {
      data: {
        basicInfo: {
          profilePhoto: "https://example.com/images/trainers/sarah_miller.jpg",
          weeklySalary: 120,
        },
        professionalSummary: {
          specializations: ["Yoga", "Pilates", "Meditation"],
          yearsOfExperience: "5 years",
        },
      },
    },
  },
  {
    _id: "trainer_003",
    name: "Michael Chen",
    personalization: {
      data: {
        basicInfo: {
          profilePhoto: "https://example.com/images/trainers/michael_chen.jpg",
          weeklySalary: 130,
        },
        professionalSummary: {
          specializations: ["Weightlifting", "Bodybuilding"],
          yearsOfExperience: "10 years",
        },
      },
    },
  },
  {
    _id: "trainer_004",
    name: "Emily Davis",
    personalization: {
      data: {
        basicInfo: {
          profilePhoto: "https://example.com/images/trainers/emily_davis.jpg",
          weeklySalary: 100,
        },
        professionalSummary: {
          specializations: ["Zumba", "Cardio"],
          yearsOfExperience: "3 years",
        },
      },
    },
  },
];

/**
 * Trainers page with search, filter and infinite‑scroll pagination.
 *
 * Fix 2025‑07‑01: `hasMore` was turning false after five pages because the backend
 * calculates `totalPages` using its own default `limit`. We now compute `hasMore`
 * on the client with `total` instead, so scrolling continues until all records
 * are fetched.
 */
const TrainersMain: React.FC = () => {
  /* ---------------------------------------------------------------------
   * STATE
   * ------------------------------------------------------------------ */
  const [displayedTrainers, setDisplayedTrainers] = useState<Trainer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentTrainer, setCurrentTrainer] = useState<Trainer | null>(null);
  const [previousTrainers, setPreviousTrainer] = useState<Trainer[]>([]);

  const isMountedRef = useRef(true);
  const limit = 5; // page size

  const navigate = useNavigate();
  /* ---------------------------------------------------------------------
   * EFFECTS
   * ------------------------------------------------------------------ */
  // Debounce raw search input ⇒ debouncedSearchTerm
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearchTerm(searchTerm.trim()), 500);
    return () => clearTimeout(id);
  }, [searchTerm]);

  // Track component mount status (safety against race‑conditions)
  useEffect(() => {
    setCurrentTrainer(sampleCurrentTrainer);
    setPreviousTrainer(samplePreviousTrainers);
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Fetch trainers whenever currentPage, debouncedSearchTerm or specialtyFilter changes
  useEffect(() => {
    // Define the expected response type
    interface TrainersResponse {
      total: number;
      trainers: Trainer[];
    }

    const fetchPage = async () => {
      if (isLoading || !hasMore) return;
      setIsLoading(true);

      try {
        const rawRes = await ClientService.getAvailabeTrainers(
          currentPage,
          limit,
          debouncedSearchTerm,
          specialtyFilter.trim()
        );
        if (!isMountedRef.current) return;
        // Normalize response to always have { total, trainers }
        const res: TrainersResponse = Array.isArray(rawRes)
          ? { total: rawRes.length, trainers: rawRes }
          : rawRes;

        console.log("response", res);

        // 🚨 NEW: compute `hasMore` from total count rather than backend's totalPages
        const more =
          typeof res.total === "number"
            ? currentPage * limit < res.total
            : res.trainers.length === limit;
        setDisplayedTrainers((prev) =>
          currentPage === 1 ? res.trainers : [...prev, ...res.trainers]
        );
        setHasMore(more);
      } catch (err) {
        console.error("Failed to load trainers", err);
      } finally {
        if (isMountedRef.current) setIsLoading(false);
      }
    };

    fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, debouncedSearchTerm, specialtyFilter]);

  // When search/filter changes we reset list & start from page 1
  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
  }, [debouncedSearchTerm, specialtyFilter]);

  // Window‑scroll listener: bump page when user is near bottom
  useEffect(() => {
    const handleWindowScroll = () => {
      if (isLoading || !hasMore) return;
      const scrolledToBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100;
      if (scrolledToBottom) setCurrentPage((p) => p + 1);
    };

    window.addEventListener("scroll", handleWindowScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, [isLoading, hasMore]);

  /* ---------------------------------------------------------------------
   * HELPERS
   * ------------------------------------------------------------------ */
  const renderTrainerCard = useCallback(
    (t: Trainer) => (
      <div
        key={t._id}
        className="group bg-gradient-to-br from-[#1E2235] to-[#252A40] border border-[#2A3042] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-[#5D5FEF] hover:shadow-[0_8px_30px_rgba(93,95,239,0.15)] transition-all duration-500 transform hover:-translate-y-1 backdrop-blur-sm relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-[rgba(93,95,239,0.05)] before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 sm:p-6"
      >
        {/* Profile Section */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative">
            <img
              src={t.personalization?.data.basicInfo.profilePhoto}
              alt={t.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-[#2A3042] group-hover:ring-[#5D5FEF] transition-all duration-300 shadow-lg"
            />
            {/* <span>{t.personalization?.data.basicInfo.profilePhoto}</span> */}
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#10B981] border-2 border-[#1E2235] rounded-full"></div>
          </div>

          {/* Name and basic info - visible on mobile */}
          <div className="flex-1 sm:hidden">
            <h3 className="text-white font-bold text-lg leading-tight">
              {t.name}
            </h3>
            <p className="text-[#A0A7B8] text-sm mt-1 line-clamp-2">
              {t.personalization?.data.professionalSummary?.specializations
                ?.slice(0, 2)
                .join(", ") || "No specialties"}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 w-full">
          {/* Name - hidden on mobile, shown on desktop */}
          <h3 className="hidden sm:block text-white font-bold text-xl mb-2 group-hover:text-[#5D5FEF] transition-colors duration-300">
            {t.name}
          </h3>

          {/* Specializations */}
          <div className="mb-3">
            <p className="text-[#A0A7B8] text-sm sm:text-base leading-relaxed">
              {t.personalization?.data.professionalSummary?.specializations?.join(
                ", "
              ) || "No specialties"}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-6">
            {/* Experience */}
            <div className="flex items-center gap-2 text-[#A0A7B8] text-sm group-hover:text-white transition-colors duration-300">
              <div className="p-1.5 bg-[#2A3042] rounded-lg group-hover:bg-[#5D5FEF] transition-colors duration-300">
                <Clock size={14} />
              </div>
              <div>
                <p className="text-xs text-[#6B7280] uppercase tracking-wide font-medium">
                  Experience
                </p>
                <span className="font-semibold">
                  {t.personalization?.data.professionalSummary
                    ?.yearsOfExperience || "N/A"}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 text-[#A0A7B8] text-sm group-hover:text-white transition-colors duration-300">
              <div className="p-1.5 bg-[#2A3042] rounded-lg group-hover:bg-[#5D5FEF] transition-colors duration-300">
                <DollarSign size={14} />
              </div>
              <div>
                <p className="text-xs text-[#6B7280] uppercase tracking-wide font-medium">
                  Rate/Week
                </p>
                <span className="font-semibold">
                  {t.personalization?.data.basicInfo.weeklySalary || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button - Desktop */}
        <div className="hidden sm:block">
          <button
            onClick={() => navigate("/trainer-details")}
            className="px-6 py-2 bg-[#5D5FEF] text-white rounded-xl font-medium hover:bg-[#4C4EE5] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[0_4px_20px_rgba(93,95,239,0.4)]"
          >
            View Profile
          </button>
        </div>

        {/* Action Button - Mobile (Full Width) */}
        <div className="sm:hidden w-full mt-2">
          <button
            onClick={() => navigate("/trainer-details")}
            className="w-full px-4 py-3 bg-[#5D5FEF] text-white rounded-xl font-medium hover:bg-[#4C4EE5] transition-all duration-300 shadow-lg"
          >
            View Profile
          </button>
        </div>
      </div>
    ),
    []
  );

  /* ---------------------------------------------------------------------
   * RENDER
   * ------------------------------------------------------------------ */
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0F1419] to-[#1A1F2E] transition-all duration-300">
      {/* Container with proper responsive margins */}
      <div className=" p-4 lg:pt-[calc(70px+1rem)] xl:p-6 2xl:p-8 max-w-7xl mx-auto lg:mx-0">
        {/* Current Trainer Section */}
        <section className="relative mb-8 animate-[fadeIn_0.6s_ease-out_0.1s_forwards]">
          <div className="bg-gradient-to-br from-[#1E2235] via-[#252A40] to-[rgba(30,34,53,0.8)] border border-[#2A3042] rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-sm">
            {/* Animated border */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5D5FEF] via-[#FF4757] to-[#5D5FEF] animate-pulse"></div>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#5D5FEF] rounded-xl">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Your Current Trainer
              </h2>
            </div>

            {currentTrainer ? (
              <CurrentTrainerCard trainer={currentTrainer} />
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-[#2A3042] rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-[#A0A7B8]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <p className="text-[#A0A7B8] text-lg">
                  No current trainer assigned
                </p>
                <p className="text-[#6B7280] text-sm mt-2">
                  Find your perfect trainer below
                </p>
              </div>
            )}
          </div>
        </section>
        {/* Previous Trainers Section */}
        {previousTrainers.length > 0 && (
          <section className="mb-8 animate-[fadeIn_0.6s_ease-out_0.2s_forwards]">
            <div className="bg-gradient-to-br from-[#1E2235] to-[#252A40] border border-[#2A3042] rounded-2xl p-6 shadow-xl backdrop-blur-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-[#FF4757] rounded-xl">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                Previous Trainers
              </h2>
              <div className="grid gap-4">
                {previousTrainers.map((trainer) => (
                  <PreviousTrainerCard key={trainer._id} trainer={trainer} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Search & Filter Section */}
        <section className="mb-8 animate-[fadeIn_0.6s_ease-out_0.15s_forwards]">
          <div className="bg-gradient-to-r from-[#1E2235] to-[#252A40] border border-[#2A3042] rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-[#5D5FEF]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Find Trainers
            </h3>

            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A7B8] z-10"
                  size={18}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, specialty, or experience..."
                  className="w-full bg-[#2A3042] border border-[#3A4052] rounded-xl py-4 pl-12 pr-4 text-white placeholder-[#A0A7B8] focus:border-[#5D5FEF] focus:shadow-[0_0_0_3px_rgba(93,95,239,0.1)] focus:outline-none transition-all duration-300 text-sm sm:text-base"
                />
              </div>

              {/* Filter Dropdown */}
              <div className="lg:w-80 relative">
                <button
                  onClick={() => setIsFilterOpen((p) => !p)}
                  aria-expanded={isFilterOpen}
                  aria-haspopup="listbox"
                  className="w-full bg-[#2A3042] border border-[#3A4052] rounded-xl py-4 px-4 text-white flex items-center justify-between focus:border-[#5D5FEF] focus:shadow-[0_0_0_3px_rgba(93,95,239,0.1)] focus:outline-none transition-all duration-300 hover:border-[#5D5FEF] text-sm sm:text-base"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[#5D5FEF]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
                      />
                    </svg>
                    {specialtyFilter || "All Specialties"}
                  </span>
                  {isFilterOpen ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>

                {isFilterOpen && (
                  <div
                    role="listbox"
                    className="absolute top-full left-0 w-full bg-[#1E2235] border border-[#2A3042] rounded-xl mt-2 z-20 shadow-2xl max-h-60 overflow-y-auto backdrop-blur-sm"
                  >
                    {[
                      "",
                      "Strength",
                      "Cardio",
                      "Yoga",
                      "HIIT",
                      "Nutrition",
                      "Rehabilitation",
                      "Pilates",
                      "Weightlifting",
                      "Zumba",
                      "CrossFit",
                      "Meditation",
                      "Bodybuilding",
                      "Boxing",
                    ].map((opt) => (
                      <div
                        key={opt || "all"}
                        role="option"
                        aria-selected={specialtyFilter === opt}
                        onClick={() => {
                          setSpecialtyFilter(opt);
                          setIsFilterOpen(false);
                        }}
                        className="px-4 py-3 text-sm hover:bg-[#2A3042] cursor-pointer transition-colors duration-200 border-b border-[#2A3042] last:border-b-0 flex items-center gap-2"
                      >
                        {specialtyFilter === opt && (
                          <svg
                            className="w-4 h-4 text-[#5D5FEF]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        {opt || "All Specialties"}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Available Trainers Section */}
        <section className="animate-[fadeIn_0.6s_ease-out_0.25s_forwards]">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-3">
              <div className="p-2 bg-[#10B981] rounded-xl">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              Available Trainers
            </h2>
            <p className="text-[#A0A7B8]">
              {displayedTrainers.length} trainer
              {displayedTrainers.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {/* Trainer Grid */}
          <div className="space-y-4">
            {displayedTrainers.length === 0 && !isLoading && (
              <div className="text-center py-16 bg-gradient-to-br from-[#1E2235] to-[#252A40] border border-[#2A3042] rounded-2xl">
                <div className="w-24 h-24 mx-auto mb-4 bg-[#2A3042] rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-[#A0A7B8]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-[#A0A7B8] text-lg mb-2">No trainers found</p>
                <p className="text-[#6B7280] text-sm">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}

            {displayedTrainers.map(renderTrainerCard)}

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-3 text-[#A0A7B8]">
                  <div className="w-5 h-5 border-2 border-[#5D5FEF] border-t-transparent rounded-full animate-spin"></div>
                  Loading more trainers...
                </div>
              </div>
            )}

            {/* End of Results */}
            {!hasMore && displayedTrainers.length > 0 && (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-2 text-[#A0A7B8] bg-[#1E2235] px-6 py-3 rounded-full border border-[#2A3042]">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  All trainers loaded
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default TrainersMain;
