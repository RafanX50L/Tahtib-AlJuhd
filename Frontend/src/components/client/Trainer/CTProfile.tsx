import React, { useState, useRef } from 'react';
import { Star, MapPin, Clock, DollarSign, Users, Calendar, Heart, MessageCircle, Share2, ThumbsUp, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Checkout from '@/components/trainer/payments/Checkouts';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

interface TrainerData {
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  experience: string;
  price: string;
  clientsTrained: string;
  availability: string;
  image: string;
  bio: string;
  skills: string[];
  plans: { duration: string; price: string }[];
}

interface PostImage {
  url: string;
  caption: string;
  alt: string;
}

interface Post {
  id: number;
  text: string;
  timestamp: string;
  likes: number;
  comments: { id: number; text: string }[];
  shares: number;
  location: string;
  images: PostImage[];
}

interface StarRatingProps {
  rating: number;
  total?: number;
}

const TrainerProfile: React.FC = () => {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [currentImageIndices, setCurrentImageIndices] = useState<{ [key: number]: number }>({});
  const [comments, setComments] = useState<{ [key: number]: { id: number; text: string }[] }>({});
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [showCommentInput, setShowCommentInput] = useState<{ [key: number]: boolean }>({});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const stripePromise = loadStripe('pk_test_YourStripePublishableKey');

  const touchStartX = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);

  const handleLike = (postId: number): void => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleNextImage = (postId: number, totalImages: number): void => {
    setCurrentImageIndices(prev => ({
      ...prev,
      [postId]: Math.min((prev[postId] || 0) + 1, totalImages - 1),
    }));
  };

  const handlePrevImage = (postId: number): void => {
    setCurrentImageIndices(prev => ({
      ...prev,
      [postId]: Math.max((prev[postId] || 0) - 1, 0),
    }));
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent, postId: number): void => {
    touchStartX.current = e.type === 'touchstart' ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    touchCurrentX.current = touchStartX.current;
    console.log(postId);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent): void => {
    touchCurrentX.current = e.type === 'touchmove' ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
  };

  const handleTouchEnd = (postId: number, totalImages: number): void => {
    if (touchStartX.current !== null && touchCurrentX.current !== null) {
      const diffX = touchStartX.current - touchCurrentX.current;
      if (diffX > 50) {
        handleNextImage(postId, totalImages);
      } else if (diffX < -50) {
        handlePrevImage(postId);
      }
    }
    touchStartX.current = null;
    touchCurrentX.current = null;
  };

  const handleCommentChange = (postId: number, value: string): void => {
    setNewComment(prev => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = (postId: number): void => {
    if (newComment[postId]?.trim()) {
      setComments(prev => ({
        ...prev,
        [postId]: [
          ...(prev[postId] || []),
          { id: (prev[postId]?.length || 0) + 1, text: newComment[postId].trim() },
        ],
      }));
      setNewComment(prev => ({ ...prev, [postId]: '' }));
      setShowCommentInput(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleShare = (postId: number): void => {
    alert(`Share link for post ${postId}: https://example.com/post/${postId}`);
  };

  const toggleCommentInput = (postId: number): void => {
    setShowCommentInput(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleBookNow = (): void => {
    setShowModal(true);
  };

  const handleCloseModal = (): void => {
    setShowModal(false);
    setSelectedPlan(null);
  };

  // const handleConfirmBooking = (): void => {
  //   if (selectedPlan) {
  //     alert(`Booking confirmed for plan: ${selectedPlan}`);
      
  //     setShowModal(false);
  //     setSelectedPlan(null);
  //   } else {
  //     alert('Please select a plan before confirming.');
  //   }
  // };

  const calculateExpiryDate = (duration: string): string => {
    const currentDate = new Date('2025-07-01');
    const months = parseInt(duration.match(/\d+/)?.[0] || '0', 10);
    currentDate.setMonth(currentDate.getMonth() + months);
    return currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const trainerData: TrainerData = {
    name: "Alex Johnson",
    specialty: "Strength & Conditioning Coach",
    rating: 4.9,
    reviews: 142,
    experience: "8 years",
    price: "$300/month",
    clientsTrained: "250+",
    availability: "Mon-Fri, 8 AM - 6 PM",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    bio: "Alex Johnson is a certified Strength & Conditioning Coach with over 8 years of experience in the fitness industry. He specializes in helping clients build muscle, increase strength, and achieve their bodybuilding goals. Alex has worked with over 250 clients, ranging from beginners to competitive athletes, and is known for his personalized training programs and motivational coaching style.",
    skills: ["Strength Training", "Bodybuilding", "Powerlifting", "Weight Management"],
    plans: [
      { duration: "1 Month (4 Weeks)", price: "$300" },
      { duration: "2 Months (8 Weeks)", price: "$550" },
      { duration: "3 Months (12 Weeks)", price: "$800" },
      { duration: "6 Months (24 Weeks)", price: "$1500" },
      { duration: "12 Months (48 Weeks)", price: "$2800" },
    ],
  };

  const posts: Post[] = [
    {
      id: 1,
      text: "Just finished a great session with a client who hit a new personal record on their deadlift! 💪 Consistency and proper form are key. What's your favorite lift to train?",
      timestamp: "2 hours ago",
      likes: 45,
      comments: [],
      shares: 8,
      location: "Elite Fitness Center, Downtown",
      images: [
        {
          url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          caption: "Pushing limits with every rep!",
          alt: "Strength Training",
        },
        {
          url: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          caption: "Perfecting form with 6 months of training",
          alt: "Gym session",
        },
      ],
    },
    {
      id: 2,
      text: "Sharing a quick tip for better squats: keep your core engaged and push your knees out as you descend. Here's a shot from today's session! 🏋️‍♂️ #FitnessTips #StrengthTraining",
      timestamp: "1 day ago",
      likes: 67,
      comments: [],
      shares: 15,
      location: "Iron Temple Gym, Westside",
      images: [
        {
          url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          caption: "Finding balance in body and mind.",
          alt: "Yoga Pose",
        },
        {
          url: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          caption: "Client progress after 3 months",
          alt: "Gym workout",
        },
        {
          url: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          caption: "Every mile tells a story of perseverance.",
          alt: "Running Trail",
        },
      ],
    },
  ];

  const StarRating: React.FC<StarRatingProps> = ({ rating, total = 5 }) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(total)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${
              i < Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-400'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0F1419] to-[#1A1F2E] p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Trainer Header */}
        <div className="bg-gradient-to-br from-[#1E2235] via-[#252A40] to-[rgba(30,34,53,0.8)] border border-[#2A3042] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5D5FEF] via-[#FF4757] to-[#5D5FEF] animate-pulse"></div>
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
            <div className="relative">
              <img
                src={trainerData.image}
                alt={trainerData.name}
                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-2xl object-cover ring-4 ring-[#2A3042] shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#10B981] border-4 border-[#1E2235] rounded-full"></div>
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">{trainerData.name}</h1>
              <p className="text-[#A0A7B8] text-base sm:text-lg lg:text-xl mb-4">{trainerData.specialty}</p>
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <StarRating rating={trainerData.rating} />
                <span className="text-yellow-400 font-semibold">{trainerData.rating}</span>
                <span className="text-[#A0A7B8]">({trainerData.reviews} reviews)</span>
              </div>
            </div>
            <div className="w-full lg:w-auto">
              <button
                onClick={handleBookNow}
                className="w-full lg:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#5D5FEF] text-white rounded-xl font-semibold text-base sm:text-lg hover:bg-[#4C4EE5] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[0_8px_30px_rgba(93,95,239,0.4)]"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>

        {showCheckout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <button
                onClick={() => setShowCheckout(false)}
                className="text-red-500 mb-4"
              >
                Close
              </button>
              <Elements stripe={stripePromise}>

              <Checkout
                planId={selectedPlan!}
                userId="user_123"
                amount={5000}
                currency="usd"
              />
              </Elements>
            </div>
          </div>
        )}

        {/* Book Now Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1E2235] rounded-2xl p-6 sm:p-8 max-w-md sm:max-w-lg w-full max-h-[80vh] overflow-y-auto border border-[#2A3042] shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Select a Training Plan</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-[#A0A7B8] hover:text-white transition-colors duration-300"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                {trainerData.plans.map((plan, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-4 p-4 bg-[#2A3042] rounded-xl hover:bg-[#3A4052] transition-colors duration-300 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="plan"
                      value={plan.duration}
                      checked={selectedPlan === plan.duration}
                      onChange={() => setSelectedPlan(plan.duration)}
                      className="h-5 w-5 text-[#5D5FEF] focus:ring-[#5D5FEF]"
                    />
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm sm:text-base">{plan.duration}</p>
                      <p className="text-[#A0A7B8] text-sm">Price: {plan.price}</p>
                      <p className="text-[#A0A7B8] text-sm">Expires: {calculateExpiryDate(plan.duration)}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={handleCloseModal}
                  className="px-4 sm:px-6 py-2 bg-[#2A3042] text-white rounded-lg text-sm sm:text-base hover:bg-[#3A4052]"
                >
                  Close
                </button>
                {/* <button
                  onClick={() => {
                    console.log('this works');
                    if (!selectedPlan) {
                      alert('Please select a plan before confirming.');
                      return;
                    }
                    setShowCheckout(true); // show the checkout form
                  }}
                  className="px-4 sm:px-6 py-2 bg-[#5D5FEF] text-white rounded-lg text-sm sm:text-base hover:bg-[#4C4EE5]"
                >
                  Confirm Booking
                </button> */}
                <button
                  onClick={() => {
                    console.log('this works');
                    if (!selectedPlan) {
                      alert('Please select a plan before confirming.');
                      return;
                    }
                    setShowModal(false);      // close the plan modal
                    setShowCheckout(true);    // open the checkout modal
                  }}
                  className="px-4 sm:px-6 py-2 bg-[#5D5FEF] text-white rounded-lg text-sm sm:text-base hover:bg-[#4C4EE5]"
                >
                  Confirm Booking
                </button>

              </div>
            </div>
          </div>
        )}

        {/* Trainer Details */}
        <div className="bg-gradient-to-br from-[#1E2235] to-[#252A40] border border-[#2A3042] rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2">
            <div className="p-2 bg-[#5D5FEF] rounded-lg">
              <Users size={20} />
            </div>
            Trainer Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Clock, label: "Experience", value: trainerData.experience },
              { icon: DollarSign, label: "Price", value: trainerData.price },
              { icon: Users, label: "Clients Trained", value: trainerData.clientsTrained },
              { icon: Calendar, label: "Availability", value: trainerData.availability },
            ].map((detail, index) => (
              <div key={index} className="bg-[#2A3042] rounded-xl p-4 hover:bg-[#3A4052] transition-colors duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#5D5FEF] rounded-lg">
                    <detail.icon size={16} className="text-white" />
                  </div>
                  <span className="text-[#A0A7B8] text-sm font-medium">{detail.label}</span>
                </div>
                <p className="text-white font-semibold text-sm sm:text-base">{detail.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="bg-gradient-to-br from-[#1E2235] to-[#252A40] border border-[#2A3042] rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2">
            <div className="p-2 bg-[#10B981] rounded-lg">
              <DollarSign size={20} />
            </div>
            Training Plans
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trainerData.plans.map((plan, index) => (
              <div key={index} className="bg-[#2A3042] rounded-xl p-4 hover:bg-[#3A4052] transition-colors duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#10B981] rounded-lg">
                    <Calendar size={16} className="text-white" />
                  </div>
                  <span className="text-[#A0A7B8] text-sm font-medium">{plan.duration}</span>
                </div>
                <p className="text-white font-semibold text-sm sm:text-base">{plan.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-gradient-to-br from-[#1E2235] to-[#252A40] border border-[#2A3042] rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2">
            <div className="p-2 bg-[#10B981] rounded-lg">
              <Star size={20} />
            </div>
            Skills
          </h2>
          <div className="flex flex-wrap gap-3">
            {trainerData.skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-[#2A3042] text-white rounded-full text-sm font-medium hover:bg-[#5D5FEF] transition-colors duration-300 cursor-pointer"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div className="bg-gradient-to-br from-[#1E2235] to-[#252A40] border border-[#2A3042] rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2">
            <div className="p-2 bg-[#FF4757] rounded-lg">
              <Heart size={20} />
            </div>
            About Alex
          </h2>
          <p className="text-[#A0A7B8] leading-relaxed text-sm sm:text-base">{trainerData.bio}</p>
        </div>

        {/* Posts */}
        <div className="bg-gradient-to-br from-[#1E2235] to-[#252A40] border border-[#2A3042] rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2">
            <div className="p-2 bg-[#FF9500] rounded-lg">
              <MessageCircle size={20} />
            </div>
            Recent Posts
          </h2>
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-[#2A3042] rounded-xl p-6 hover:bg-[#3A4052] transition-colors duration-300">
                <p className="text-[#A0A7B8] mb-4 leading-relaxed text-sm sm:text-base">{post.text}</p>
                {post.images && post.images.length > 0 && (
                  <div className="relative mb-4">
                    <div
                      className="relative overflow-hidden rounded-xl"
                      onTouchStart={(e) => handleTouchStart(e, post.id)}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={() => handleTouchEnd(post.id, post.images.length)}
                      onMouseDown={(e) => handleTouchStart(e, post.id)}
                      onMouseMove={handleTouchMove}
                      onMouseUp={() => handleTouchEnd(post.id, post.images.length)}
                      onMouseLeave={() => handleTouchEnd(post.id, post.images.length)}
                    >
                      <div
                        className="flex transition-transform duration-300 ease-out"
                        style={{ transform: `translateX(-${(currentImageIndices[post.id] || 0) * 100}%)` }}
                      >
                        {post.images.map((image, index) => (
                          <div key={index} className="relative w-full flex-shrink-0">
                            <img
                              src={image.url}
                              alt={image.alt}
                              className="w-full h-48 sm:h-64 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                              <div className="absolute bottom-3 left-3 right-3">
                                <p className="text-white text-sm font-medium">{image.caption}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {post.images.length > 1 && (
                        <>
                          <button
                            onClick={() => handlePrevImage(post.id)}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 rounded-full p-2 text-white hover:bg-black/70 disabled:opacity-50"
                            disabled={(currentImageIndices[post.id] || 0) === 0}
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            onClick={() => handleNextImage(post.id, post.images.length)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 rounded-full p-2 text-white hover:bg-black/70 disabled:opacity-50"
                            disabled={(currentImageIndices[post.id] || 0) === post.images.length - 1}
                          >
                            <ChevronRight size={20} />
                          </button>
                          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                            {post.images.map((_, index) => (
                              <div
                                key={index}
                                className={`h-2 w-2 rounded-full ${
                                  index === (currentImageIndices[post.id] || 0) ? 'bg-white' : 'bg-white/50'
                                }`}
                              ></div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
                {post.location && (
                  <div className="flex items-center gap-2 text-[#A0A7B8] text-sm mb-2">
                    <MapPin size={16} />
                    <span>{post.location}</span>
                  </div>
                )}
                <div className="text-[#A0A7B8] text-sm mb-4">{post.timestamp}</div>
                <div className="flex items-center gap-6 pt-4 border-t border-[#3A4052]">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 text-sm transition-colors duration-300 ${
                      likedPosts.has(post.id)
                        ? 'text-[#FF4757]'
                        : 'text-[#A0A7B8] hover:text-white'
                    }`}
                  >
                    <ThumbsUp size={16} className={likedPosts.has(post.id) ? 'fill-current' : ''} />
                    <span>{likedPosts.has(post.id) ? post.likes + 1 : post.likes} Likes</span>
                  </button>
                  <button
                    onClick={() => toggleCommentInput(post.id)}
                    className="flex items-center gap-2 text-[#A0A7B8] hover:text-white text-sm transition-colors duration-300"
                  >
                    <MessageCircle size={16} />
                    <span>{(comments[post.id]?.length || 0) + post.comments.length} Comments</span>
                  </button>
                  <button
                    onClick={() => handleShare(post.id)}
                    className="flex items-center gap-2 text-[#A0A7B8] hover:text-white text-sm transition-colors duration-300"
                  >
                    <Share2 size={16} />
                    <span>{post.shares} Shares</span>
                  </button>
                </div>
                {showCommentInput[post.id] && (
                  <div className="mt-4">
                    <textarea
                      className="w-full p-2 rounded-lg bg-[#3A4052] text-white text-sm border border-[#2A3042] focus:outline-none focus:ring-2 focus:ring-[#5D5FEF]"
                      rows={3}
                      placeholder="Add a comment..."
                      value={newComment[post.id] || ''}
                      onChange={(e) => handleCommentChange(post.id, e.target.value)}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => setShowCommentInput(prev => ({ ...prev, [post.id]: false }))}
                        className="px-4 py-2 bg-[#2A3042] text-white rounded-lg text-sm hover:bg-[#3A4052]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleCommentSubmit(post.id)}
                        className="px-4 py-2 bg-[#5D5FEF] text-white rounded-lg text-sm hover:bg-[#4C4EE5]"
                      >
                        Submit
                      </button>
                    </div>
                    {comments[post.id]?.map((comment) => (
                      <div key={comment.id} className="mt-2 p-2 bg-[#3A4052] rounded-lg text-sm text-[#A0A7B8]">
                        {comment.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default TrainerProfile;