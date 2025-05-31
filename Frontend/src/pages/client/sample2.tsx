// import React, { Suspense, useEffect, useState } from 'react';
// import Lottie from 'lottie-react';

// const ExerciseAnimation =  ({ exerciseName }) => {
//   const [animationData, setAnimationData] = useState(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     // Normalize exercise name to match file name (e.g., "Push Up" -> "push-up")
//     const normalizedName = exerciseName.toLowerCase().replace(/\s+/g, '-');
//     // Dynamic import of the animation file
//     import(`../assets/animations/${normalizedName}.json`)
//       .then((module) => {
//         setAnimationData(module.default);
//       })
//       .catch(() => {
//         setError(`No animation found for ${exerciseName}`);
//       });
//   }, [exerciseName]);

//   if (error) {
//     return <div>{error}</div>;
//   }

//   if (!animationData) {
//     return <div>Loading animation...</div>;
//   }

//   return (
//     <div>
//       <h2>{exerciseName}</h2>
//       <Lottie animationData={animationData} loop={true} style={{ width: 300, height: 300 }} />
//     </div>
//   );
// };

// export default ExerciseAnimation;



import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import axios from 'axios';

const ExerciseAnimation = ({ exerciseName }) => {
  const [animationData, setAnimationData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimation = async () => {
      try {
        const response = await axios.get(
          `https://api.lottiefiles.com/v2/animations?search=${encodeURIComponent(exerciseName)}`,
          {
            headers: { Authorization: `Bearer YOUR_API_KEY` },
          }
        );
        const animation = response.data.data[0]; // Get the first matching animation
        if (animation) {
          const animationUrl = animation.lottie_url;
          const animationResponse = await axios.get(animationUrl);
          setAnimationData(animationResponse.data);
        } else {
          setError(`No animation found for ${exerciseName}`);
        }
      } catch (err) {
        setError(`Failed to load animation for ${exerciseName}`);
      }
    };
    fetchAnimation();
  }, [exerciseName]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!animationData) {
    return <div>Loading animation...</div>;
  }

  return (
    <div>
      <h2>{exerciseName}</h2>
      <Lottie animationData={animationData} loop={true} style={{ width: 300, height: 300 }} />
    </div>
  );
};

export default ExerciseAnimation;